
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.41.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    // Match modifiers on DOM events.
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match modifiers on other events.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;

    function forwardEventsBuilder(component) {
      // This is our pseudo $on function. It is defined on component mount.
      let $on;
      // This is a list of events bound before mount.
      let events = [];
      // This is the original component $on function.
      const componentOn = component.$on;

      // And we override the $on function to forward all bound events.
      component.$on = (fullEventType, callback) => {
        let eventType = fullEventType;
        let destructor = () => {};
        if ($on) {
          // The event was bound programmatically.
          destructor = $on(eventType, callback);
        } else {
          // The event was bound before mount by Svelte.
          events.push([eventType, callback]);
        }
        const oldModifierMatch = eventType.match(oldModifierRegex);
        const newModifierMatch = eventType.match(newModifierRegex);
        const modifierMatch = oldModifierMatch || newModifierMatch;

        if (oldModifierMatch && console) {
          console.warn(
            'Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ',
            eventType
          );
        }

        if (modifierMatch) {
          // Remove modifiers from the real event.
          const parts = eventType.split(oldModifierMatch ? ':' : '$');
          eventType = parts[0];
        }

        // Call the original $on function.
        const componentDestructor = componentOn.call(
          component,
          eventType,
          callback
        );

        return (...args) => {
          destructor();
          return componentDestructor(...args);
        };
      };

      function forward(e) {
        // Internally bubble the event up from Svelte components.
        bubble(component, e);
      }

      return (node) => {
        const destructors = [];
        const forwardDestructors = {};

        // This function is responsible for forwarding all bound events.
        $on = (fullEventType, callback) => {
          let eventType = fullEventType;
          let handler = callback;
          // DOM addEventListener options argument.
          let options = false;
          const oldModifierMatch = eventType.match(oldModifierRegex);
          const newModifierMatch = eventType.match(newModifierRegex);
          const modifierMatch = oldModifierMatch || newModifierMatch;
          if (modifierMatch) {
            // Parse the event modifiers.
            // Supported modifiers:
            // - preventDefault
            // - stopPropagation
            // - passive
            // - nonpassive
            // - capture
            // - once
            const parts = eventType.split(oldModifierMatch ? ':' : '$');
            eventType = parts[0];
            options = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
            if (options.nonpassive) {
              options.passive = false;
              delete options.nonpassive;
            }
            if (options.preventDefault) {
              handler = prevent_default(handler);
              delete options.preventDefault;
            }
            if (options.stopPropagation) {
              handler = stop_propagation(handler);
              delete options.stopPropagation;
            }
          }

          // Listen for the event directly, with the given options.
          const off = listen(node, eventType, handler, options);
          const destructor = () => {
            off();
            const idx = destructors.indexOf(destructor);
            if (idx > -1) {
              destructors.splice(idx, 1);
            }
          };

          destructors.push(destructor);

          // Forward the event from Svelte.
          if (!eventType in forwardDestructors) {
            forwardDestructors[eventType] = listen(node, eventType, forward);
          }

          return destructor;
        };

        for (let i = 0; i < events.length; i++) {
          // Listen to all the events added before mount.
          $on(events[i][0], events[i][1]);
        }

        return {
          destroy: () => {
            // Remove all event listeners.
            for (let i = 0; i < destructors.length; i++) {
              destructors[i]();
            }

            // Remove all event forwarders.
            for (let entry of Object.entries(forwardDestructors)) {
              entry[1]();
            }
          },
        };
      };
    }

    function classMap(classObj) {
      return Object.entries(classObj)
        .filter(([name, value]) => name !== '' && value)
        .map(([name]) => name)
        .join(' ');
    }

    function useActions(node, actions) {
      let objects = [];

      if (actions) {
        for (let i = 0; i < actions.length; i++) {
          const isArray = Array.isArray(actions[i]);
          const action = isArray ? actions[i][0] : actions[i];
          if (isArray && actions[i].length > 1) {
            objects.push(action(node, actions[i][1]));
          } else {
            objects.push(action(node));
          }
        }
      }

      return {
        update(actions) {
          if (((actions && actions.length) || 0) != objects.length) {
            throw new Error('You must not change the length of an actions array.');
          }

          if (actions) {
            for (let i = 0; i < actions.length; i++) {
              if (objects[i] && 'update' in objects[i]) {
                const isArray = Array.isArray(actions[i]);
                if (isArray && actions[i].length > 1) {
                  objects[i].update(actions[i][1]);
                } else {
                  objects[i].update();
                }
              }
            }
          }
        },

        destroy() {
          for (let i = 0; i < objects.length; i++) {
            if (objects[i] && 'destroy' in objects[i]) {
              objects[i].destroy();
            }
          }
        },
      };
    }

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded_ = false;
            _this.activationTimer_ = 0;
            _this.fgDeactivationRemovalTimer_ = 0;
            _this.fgScale_ = '0';
            _this.frame_ = { width: 0, height: 0 };
            _this.initialSize_ = 0;
            _this.layoutFrame_ = 0;
            _this.maxRadius_ = 0;
            _this.unboundedCoords_ = { left: 0, top: 0 };
            _this.activationState_ = _this.defaultActivationState_();
            _this.activationTimerCallback_ = function () {
                _this.activationAnimationHasEnded_ = true;
                _this.runDeactivationUXLogicIfReady_();
            };
            _this.activateHandler_ = function (e) { return _this.activate_(e); };
            _this.deactivateHandler_ = function () { return _this.deactivate_(); };
            _this.focusHandler_ = function () { return _this.handleFocus(); };
            _this.blurHandler_ = function () { return _this.handleBlur(); };
            _this.resizeHandler_ = function () { return _this.layout(); };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple_();
            this.registerRootHandlers_(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal_();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple_()) {
                if (this.activationTimer_) {
                    clearTimeout(this.activationTimer_);
                    this.activationTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer_) {
                    clearTimeout(this.fgDeactivationRemovalTimer_);
                    this.fgDeactivationRemovalTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars_();
                });
            }
            this.deregisterRootHandlers_();
            this.deregisterDeactivationHandlers_();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activate_(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivate_();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame_) {
                cancelAnimationFrame(this.layoutFrame_);
            }
            this.layoutFrame_ = requestAnimationFrame(function () {
                _this.layoutInternal_();
                _this.layoutFrame_ = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple_ = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState_ = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers_ = function (supportsPressRipple) {
            var _this = this;
            if (supportsPressRipple) {
                ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerInteractionHandler(evtType, _this.activateHandler_);
                });
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler_);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler_);
            this.adapter.registerInteractionHandler('blur', this.blurHandler_);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers_ = function (evt) {
            var _this = this;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler_);
            }
            else {
                POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerDocumentInteractionHandler(evtType, _this.deactivateHandler_);
                });
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers_ = function () {
            var _this = this;
            ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterInteractionHandler(evtType, _this.activateHandler_);
            });
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler_);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler_);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler_);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers_ = function () {
            var _this = this;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler_);
            POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterDocumentInteractionHandler(evtType, _this.deactivateHandler_);
            });
        };
        MDCRippleFoundation.prototype.removeCssVars_ = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activate_ = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState_;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent_;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState_();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers_(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation_();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive_(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation_();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState_ = _this.defaultActivationState_();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive_ = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation_ = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal_();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates_(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer_);
            clearTimeout(this.fgDeactivationRemovalTimer_);
            this.rmBoundedActivationClasses_();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer_ = setTimeout(function () { return _this.activationTimerCallback_(); }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates_ = function () {
            var _a = this.activationState_, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame_.width / 2,
                    y: this.frame_.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize_ / 2),
                y: startPoint.y - (this.initialSize_ / 2),
            };
            var endPoint = {
                x: (this.frame_.width / 2) - (this.initialSize_ / 2),
                y: (this.frame_.height / 2) - (this.initialSize_ / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady_ = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState_, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded_) {
                this.rmBoundedActivationClasses_();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer_ = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses_ = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded_ = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState_ = function () {
            var _this = this;
            this.previousActivationEvent_ = this.activationState_.activationEvent;
            this.activationState_ = this.defaultActivationState_();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent_ = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivate_ = function () {
            var _this = this;
            var activationState = this.activationState_;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () { return _this.animateDeactivation_(state); });
                this.resetActivationState_();
            }
            else {
                this.deregisterDeactivationHandlers_();
                requestAnimationFrame(function () {
                    _this.activationState_.hasDeactivationUXRun = true;
                    _this.animateDeactivation_(state);
                    _this.resetActivationState_();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation_ = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady_();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal_ = function () {
            var _this = this;
            this.frame_ = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame_.height, this.frame_.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame_.width, 2) + Math.pow(_this.frame_.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius_ = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize_ = initialSize - 1;
            }
            else {
                this.initialSize_ = initialSize;
            }
            this.fgScale_ = "" + this.maxRadius_ / this.initialSize_;
            this.updateLayoutCssVars_();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars_ = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale_);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords_ = {
                    left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
                    top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    const { applyPassive } = events;
    const { matches } = ponyfill;

    function Ripple(
      node,
      {
        ripple = true,
        surface = false,
        unbounded = false,
        disabled = false,
        color = null,
        active = null,
        eventTarget = null,
        activeTarget = null,
        addClass = (className) => node.classList.add(className),
        removeClass = (className) => node.classList.remove(className),
        addStyle = (name, value) => node.style.setProperty(name, value),
        initPromise = Promise.resolve(),
      } = {}
    ) {
      let instance;
      let addLayoutListener = getContext('SMUI:addLayoutListener');
      let removeLayoutListener;
      let oldActive = active;
      let oldEventTarget = eventTarget;
      let oldActiveTarget = activeTarget;

      function handleProps() {
        if (surface) {
          addClass('mdc-ripple-surface');
          if (color === 'primary') {
            addClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          } else if (color === 'secondary') {
            removeClass('smui-ripple-surface--primary');
            addClass('smui-ripple-surface--secondary');
          } else {
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }
        }

        // Handle activation first.
        if (instance && oldActive !== active) {
          oldActive = active;
          if (active) {
            instance.activate();
          } else if (active === false) {
            instance.deactivate();
          }
        }

        // Then create/destroy an instance.
        if (ripple && !instance) {
          instance = new MDCRippleFoundation({
            addClass,
            browserSupportsCssVars: () => supportsCssVariables(window),
            computeBoundingRect: () => node.getBoundingClientRect(),
            containsEventTarget: (target) => node.contains(target),
            deregisterDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterInteractionHandler: (evtType, handler) =>
              (eventTarget || node).removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterResizeHandler: (handler) =>
              window.removeEventListener('resize', handler),
            getWindowPageOffset: () => ({
              x: window.pageXOffset,
              y: window.pageYOffset,
            }),
            isSurfaceActive: () =>
              active == null ? matches(activeTarget || node, ':active') : active,
            isSurfaceDisabled: () => !!disabled,
            isUnbounded: () => !!unbounded,
            registerDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerInteractionHandler: (evtType, handler) =>
              (eventTarget || node).addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerResizeHandler: (handler) =>
              window.addEventListener('resize', handler),
            removeClass,
            updateCssVariable: addStyle,
          });

          initPromise.then(() => {
            instance.init();
            instance.setUnbounded(unbounded);
          });
        } else if (instance && !ripple) {
          initPromise.then(() => {
            instance.destroy();
            instance = null;
          });
        }

        // Now handle event/active targets
        if (
          instance &&
          (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)
        ) {
          oldEventTarget = eventTarget;
          oldActiveTarget = activeTarget;

          instance.destroy();
          requestAnimationFrame(() => {
            if (instance) {
              instance.init();
              instance.setUnbounded(unbounded);
            }
          });
        }

        if (!ripple && unbounded) {
          addClass('mdc-ripple-upgraded--unbounded');
        }
      }

      handleProps();

      if (addLayoutListener) {
        removeLayoutListener = addLayoutListener(layout);
      }

      function layout() {
        if (instance) {
          instance.layout();
        }
      }

      return {
        update(props) {
          ({
            ripple,
            surface,
            unbounded,
            disabled,
            color,
            active,
            eventTarget,
            activeTarget,
            addClass,
            removeClass,
            addStyle,
            initPromise,
          } = {
            ripple: true,
            surface: false,
            unbounded: false,
            disabled: false,
            color: null,
            active: null,
            eventTarget: null,
            activeTarget: null,
            addClass: (className) => node.classList.add(className),
            removeClass: (className) => node.classList.remove(className),
            addStyle: (name, value) => node.style.setProperty(name, value),
            initPromise: Promise.resolve(),
            ...props,
          });
          handleProps();
        },

        destroy() {
          if (instance) {
            instance.destroy();
            instance = null;
            removeClass('mdc-ripple-surface');
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }

          if (removeLayoutListener) {
            removeLayoutListener();
          }
        },
      };
    }

    /* node_modules\@smui\common\A.svelte generated by Svelte v3.41.0 */
    const file$4 = "node_modules\\@smui\\common\\A.svelte";

    function create_fragment$4(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('A', slots, ['default']);
    	let { href = 'javascript:void(0);' } = $$props;
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		href,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { href: 0, use: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\Button.svelte generated by Svelte v3.41.0 */
    const file$3 = "node_modules\\@smui\\common\\Button.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\fab\Fab.svelte generated by Svelte v3.41.0 */
    const file$2 = "node_modules\\@smui\\fab\\Fab.svelte";

    // (37:10) {#if touch}
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-fab__touch");
    			add_location(div, file$2, 36, 21, 783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(37:10) {#if touch}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-fab': true,     'mdc-fab--mini': mini,     'mdc-fab--exited': exited,     'mdc-fab--extended': extended,     'smui-fab--color-primary': color === 'primary',     'mdc-fab--touch': touch,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {href}   {...$$restProps}   >
    function create_default_slot(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);
    	let if_block = /*touch*/ ctx[8] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "mdc-fab__ripple");
    			add_location(div, file$2, 35, 3, 730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[8]) {
    				if (if_block) ; else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-fab': true,     'mdc-fab--mini': mini,     'mdc-fab--exited': exited,     'mdc-fab--extended': extended,     'smui-fab--color-primary': color === 'primary',     'mdc-fab--touch': touch,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {href}   {...$$restProps}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						color: /*color*/ ctx[4],
    						disabled: !!/*$$restProps*/ ctx[18].disabled,
    						addClass: /*addClass*/ ctx[15],
    						removeClass: /*removeClass*/ ctx[16],
    						addStyle: /*addStyle*/ ctx[17]
    					}
    				],
    				/*forwardEvents*/ ctx[14],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-fab': true,
    				'mdc-fab--mini': /*mini*/ ctx[5],
    				'mdc-fab--exited': /*exited*/ ctx[6],
    				'mdc-fab--extended': /*extended*/ ctx[7],
    				'smui-fab--color-primary': /*color*/ ctx[4] === 'primary',
    				'mdc-fab--touch': /*touch*/ ctx[8],
    				.../*internalClasses*/ ctx[12]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[13]).map(func).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		{ href: /*href*/ ctx[9] },
    		/*$$restProps*/ ctx[18]
    	];

    	var switch_value = /*component*/ ctx[10];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[21](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*Ripple, ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use, classMap, className, mini, exited, extended, touch, internalClasses, Object, internalStyles, style, href*/ 521215)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*Ripple, ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use*/ 507929 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3],
    									unbounded: false,
    									color: /*color*/ ctx[4],
    									disabled: !!/*$$restProps*/ ctx[18].disabled,
    									addClass: /*addClass*/ ctx[15],
    									removeClass: /*removeClass*/ ctx[16],
    									addStyle: /*addStyle*/ ctx[17]
    								}
    							],
    							/*forwardEvents*/ ctx[14],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty & /*classMap, className, mini, exited, extended, color, touch, internalClasses*/ 4594 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-fab': true,
    							'mdc-fab--mini': /*mini*/ ctx[5],
    							'mdc-fab--exited': /*exited*/ ctx[6],
    							'mdc-fab--extended': /*extended*/ ctx[7],
    							'smui-fab--color-primary': /*color*/ ctx[4] === 'primary',
    							'mdc-fab--touch': /*touch*/ ctx[8],
    							.../*internalClasses*/ ctx[12]
    						})
    					},
    					dirty & /*Object, internalStyles, style*/ 8196 && {
    						style: Object.entries(/*internalStyles*/ ctx[13]).map(func).concat([/*style*/ ctx[2]]).join(' ')
    					},
    					dirty & /*href*/ 512 && { href: /*href*/ ctx[9] },
    					dirty & /*$$restProps*/ 262144 && get_spread_object(/*$$restProps*/ ctx[18])
    				])
    			: {};

    			if (dirty & /*$$scope, touch*/ 4194560) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[10])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[21](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[21](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","ripple","color","mini","exited","extended","touch","href","component","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fab', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { mini = false } = $$props;
    	let { exited = false } = $$props;
    	let { extended = false } = $$props;
    	let { touch = false } = $$props;
    	let { href = null } = $$props;
    	let element;
    	let internalClasses = {};
    	let internalStyles = {};
    	let { component = href == null ? Button : A } = $$props;
    	setContext('SMUI:label:context', 'fab');
    	setContext('SMUI:icon:context', 'fab');

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(12, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(12, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(13, internalStyles);
    			} else {
    				$$invalidate(13, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(11, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('mini' in $$new_props) $$invalidate(5, mini = $$new_props.mini);
    		if ('exited' in $$new_props) $$invalidate(6, exited = $$new_props.exited);
    		if ('extended' in $$new_props) $$invalidate(7, extended = $$new_props.extended);
    		if ('touch' in $$new_props) $$invalidate(8, touch = $$new_props.touch);
    		if ('href' in $$new_props) $$invalidate(9, href = $$new_props.href);
    		if ('component' in $$new_props) $$invalidate(10, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		Ripple,
    		A,
    		Button,
    		forwardEvents,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		mini,
    		exited,
    		extended,
    		touch,
    		href,
    		element,
    		internalClasses,
    		internalStyles,
    		component,
    		addClass,
    		removeClass,
    		addStyle,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('mini' in $$props) $$invalidate(5, mini = $$new_props.mini);
    		if ('exited' in $$props) $$invalidate(6, exited = $$new_props.exited);
    		if ('extended' in $$props) $$invalidate(7, extended = $$new_props.extended);
    		if ('touch' in $$props) $$invalidate(8, touch = $$new_props.touch);
    		if ('href' in $$props) $$invalidate(9, href = $$new_props.href);
    		if ('element' in $$props) $$invalidate(11, element = $$new_props.element);
    		if ('internalClasses' in $$props) $$invalidate(12, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(13, internalStyles = $$new_props.internalStyles);
    		if ('component' in $$props) $$invalidate(10, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		mini,
    		exited,
    		extended,
    		touch,
    		href,
    		component,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class Fab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			ripple: 3,
    			color: 4,
    			mini: 5,
    			exited: 6,
    			extended: 7,
    			touch: 8,
    			href: 9,
    			component: 10,
    			getElement: 19
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fab",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get use() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mini() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mini(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exited() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exited(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extended() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extended(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Fab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[19];
    	}

    	set getElement(value) {
    		throw new Error("<Fab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Frame.svelte generated by Svelte v3.41.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\components\\Frame.svelte";

    // (169:0) {#if frame.top}
    function create_if_block$1(ctx) {
    	let div0;
    	let button;
    	let div0_class_value;
    	let div0_style_value;
    	let t1;
    	let div1;
    	let div1_class_value;
    	let div1_style_value;
    	let t2;
    	let div2;
    	let div2_class_value;
    	let div2_style_value;
    	let t3;
    	let div3;
    	let t4;
    	let div3_class_value;
    	let div3_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Delete";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			t4 = text("Resize");
    			attr_dev(button, "class", "svelte-178caft");
    			add_location(button, file$1, 174, 0, 6739);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-tleft`) + " svelte-178caft"));
    			attr_dev(div0, "draggable", "true");
    			attr_dev(div0, "style", div0_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'tleft'));
    			add_location(div0, file$1, 170, 0, 6558);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-tright`) + " svelte-178caft"));
    			attr_dev(div1, "draggable", "true");
    			attr_dev(div1, "style", div1_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'tright'));
    			add_location(div1, file$1, 177, 0, 6774);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-bleft`) + " svelte-178caft"));
    			attr_dev(div2, "draggable", "true");
    			attr_dev(div2, "style", div2_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'bleft'));
    			add_location(div2, file$1, 183, 0, 7022);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-bright`) + " svelte-178caft"));
    			attr_dev(div3, "style", div3_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'bright'));
    			add_location(div3, file$1, 192, 2, 7422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "dragstart", /*dragstart_handler_1*/ ctx[11], false, false, false),
    					listen_dev(div1, "dragstart", /*dragstart_handler_2*/ ctx[12], false, false, false),
    					listen_dev(div2, "dragstart", /*dragstart_handler_3*/ ctx[13], false, false, false),
    					listen_dev(div2, "dragover", prevent_default(/*dragover_handler_1*/ ctx[14]), false, true, false),
    					listen_dev(div3, "mousedown", /*mousedown_handler*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*addedClass*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-tleft`) + " svelte-178caft"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*frame*/ 1 && div0_style_value !== (div0_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'tleft'))) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*addedClass*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-tright`) + " svelte-178caft"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*frame*/ 1 && div1_style_value !== (div1_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'tright'))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (dirty & /*addedClass*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-bleft`) + " svelte-178caft"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*frame*/ 1 && div2_style_value !== (div2_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'bleft'))) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*addedClass*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(`${/*addedClass*/ ctx[1]} handle handle-bright`) + " svelte-178caft"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (dirty & /*frame*/ 1 && div3_style_value !== (div3_style_value = /*calculateStyle*/ ctx[7](/*frame*/ ctx[0], 'bright'))) {
    				attr_dev(div3, "style", div3_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(169:0) {#if frame.top}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let div_class_value;
    	let div_style_value;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*frame*/ ctx[0].top && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`frame ${/*addedClass*/ ctx[1]}`) + " svelte-178caft"));
    			attr_dev(div, "draggable", "true");
    			attr_dev(div, "style", div_style_value = /*frame*/ ctx[0].style);
    			add_location(div, file$1, 158, 0, 6298);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "dragover", /*dragover_handler*/ ctx[9], false, false, false),
    					listen_dev(div, "dragstart", /*dragstart_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*addedClass*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(`frame ${/*addedClass*/ ctx[1]}`) + " svelte-178caft"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*frame*/ 1 && div_style_value !== (div_style_value = /*frame*/ ctx[0].style)) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (/*frame*/ ctx[0].top) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function moveHandles$1(frame) {
    	frame.topLeftHandle.x = frame.x;
    	frame.topLeftHandle.y = frame.y;
    	frame.topRightHandle.x = frame.x + frame.width - frame.topRightHandle.width;
    	frame.topRightHandle.y = frame.y;
    	frame.bottomLeftHandle.x = frame.x;
    	frame.bottomLeftHandle.y = frame.y + frame.height - frame.bottomLeftHandle.height;
    	frame.bottomRightHandle.x = frame.x + frame.width - frame.bottomRightHandle.width;
    	frame.bottomRightHandle.y = frame.y + frame.height - frame.bottomRightHandle.height;
    	return frame;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Frame', slots, []);
    	let { frame } = $$props;
    	let { addedClass = '' } = $$props;
    	let coords = { x: 0, y: 0 };
    	let offset = [0, 0];
    	let topCorner = [0, 0];
    	let resizable = false;
    	let styleConstant = ` background-image: url('${frame.url}');`;
    	let dimensionalConstant = ` width: ${frame.width}px; height: ${frame.height}px;`;

    	// frame.style = frame.style + styleConstant + dimensionalConstant
    	frame.style = frame.style + styleConstant;

    	const handleDragStartMove = event => {
    		event.dataTransfer.setData('frame id', frame.id);
    		event.dataTransfer.dropEffect = 'move';
    		coords.x = event.clientX;
    		coords.y = event.clientY;
    		topCorner = [frame.x, frame.y]; //top left
    		$$invalidate(2, offset = [coords.x - topCorner[0], coords.y - topCorner[1]]);

    		// console.log(coords, frame.x, frame.y, offset, topCorner)
    		return offset;
    	};

    	const handleDragMove = event => {
    		// console.log('dragging')
    		// console.log(event.target)
    		event.dataTransfer.getData('frame id');

    		coords.x = event.pageX;
    		coords.y = event.pageY;

    		// console.log(coords, [event.clientX, event.clientY, event.pageX, event.pageY], frame.x, frame.y, offset)
    		topCorner = [frame.x, frame.y]; //top left

    		// frame.x = coords.x - offset[0]
    		// frame.y = coords.y - offset[1]
    		$$invalidate(0, frame.x = event.clientX - offset[0], frame);

    		$$invalidate(0, frame.y = event.clientY - offset[1], frame);

    		// frame.x = event.movementX
    		// frame.y = event.movementY
    		// console.log(frame.x, frame.y)
    		$$invalidate(0, frame.style = `width: ${frame.width}px; height: ${frame.height}px; position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant, frame);

    		// console.log(id)
    		// console.log(frame.style)
    		$$invalidate(0, frame = moveHandles$1(frame));

    		return false;
    	};

    	const handleDragStartResize = (event, edge) => {
    		event.dataTransfer.setData('frame id', frame.id);

    		// event.dataTransfer.dropEffect = 'move'
    		coords.x = event.clientX;

    		coords.y = event.clientY;
    		topCorner = [frame.x, frame.y];
    		$$invalidate(2, offset = [coords.x - frame.x, coords.y - frame.y]);
    		return offset; // shouldn't change on drag
    	};

    	const handleDragResize = (event, edge) => {
    		event = event || window.event;
    		console.log(event);
    		coords.x = event.movementX;
    		coords.y = event.movementY;

    		// let id = event.dataTransfer.getData('frame id')
    		// let corner = {x: frame.x, y: frame.y} //top left
    		// console.log(edge)
    		// console.log(coords)
    		switch (edge) {
    			case 'bright':
    				$$invalidate(0, frame.width = frame.width + coords.x, frame);
    				$$invalidate(0, frame.height = frame.height + coords.y, frame);
    				// frame.width += event.offsetX
    				// let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
    				// frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant
    				console.log(frame.width, frame.height);
    				break;
    			default:
    				return;
    		}

    		$$invalidate(0, frame = moveHandles$1(frame));
    	}; // frame.style = calculateStyle(frame)

    	const handleDragResizeDrop = event => {
    		let dimensionalConstant = ` width: ${frame.width}px; height: ${frame.height}px;`;
    		$$invalidate(0, frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant, frame);
    	}; // console.log(frame.style)

    	const calculateStyle = (frame, corner) => {
    		let style = "";
    		let addedStyle;
    		let width = frame.topRightHandle.x + frame.topRightHandle.width - frame.topLeftHandle.x;
    		let height = frame.bottomLeftHandle.y + frame.bottomLeftHandle.height - frame.topLeftHandle.y;

    		if (corner) {
    			switch (corner) {
    				case 'tleft':
    					width = frame.topLeftHandle.width;
    					height = frame.topLeftHandle.height;
    					addedStyle = ` top: ${frame.topLeftHandle.y}px; left: ${frame.topLeftHandle.x}px;`;
    					break;
    				case 'tright':
    					width = frame.topRightHandle.width;
    					height = frame.topRightHandle.height;
    					addedStyle = ` top: ${frame.topRightHandle.y}px; left: ${frame.topRightHandle.x}px;`;
    					break;
    				case 'bleft':
    					width = frame.bottomLeftHandle.width;
    					height = frame.bottomLeftHandle.height;
    					addedStyle = ` top: ${frame.bottomLeftHandle.y}px; left: ${frame.bottomLeftHandle.x}px;`;
    					break;
    				case 'bright':
    					width = frame.bottomRightHandle.width;
    					height = frame.bottomRightHandle.height;
    					addedStyle = ` top: ${frame.bottomRightHandle.y}px; left: ${frame.bottomRightHandle.x}px;`;
    					break;
    				default:
    					return;
    			}
    		}

    		style = `width: ${width}px; height: ${height}px; position: fixed;`;

    		if (!corner) {
    			style = style + ` background-image: url('${frame.url}'); top: ${frame.y}px; left: ${frame.x}px;`;
    		}

    		if (corner) {
    			style = style + addedStyle;
    		}

    		return style;
    	};

    	/*
    https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
    */
    	const dispatch = createEventDispatcher();

    	function forward(frame, event, edge) {
    		console.log('send');
    		dispatch('message', { frame, event, edge });
    	}

    	const setActive = () => {
    		console.log('well');
    		resizable = true;
    	};

    	const setInactive = () => {
    		console.log('nevermind');
    		resizable = false;
    	};

    	const writable_props = ['frame', 'addedClass'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Frame> was created with unknown prop '${key}'`);
    	});

    	const dragover_handler = event => handleDragMove(event);

    	const dragstart_handler = event => {
    		// console.log('dragging frame')
    		$$invalidate(2, offset = handleDragStartMove(event));
    	};

    	const dragstart_handler_1 = event => $$invalidate(2, offset = handleDragStartResize(event));
    	const dragstart_handler_2 = event => $$invalidate(2, offset = handleDragStartResize(event));
    	const dragstart_handler_3 = event => $$invalidate(2, offset = handleDragStartResize(event));
    	const dragover_handler_1 = event => handleDragResize(event, 'bleft');

    	const mousedown_handler = event => {
    		forward(frame, event, 'bright');
    	}; // setActive()

    	$$self.$$set = $$props => {
    		if ('frame' in $$props) $$invalidate(0, frame = $$props.frame);
    		if ('addedClass' in $$props) $$invalidate(1, addedClass = $$props.addedClass);
    	};

    	$$self.$capture_state = () => ({
    		Fab,
    		createEventDispatcher,
    		frame,
    		addedClass,
    		coords,
    		offset,
    		topCorner,
    		resizable,
    		styleConstant,
    		dimensionalConstant,
    		handleDragStartMove,
    		handleDragMove,
    		handleDragStartResize,
    		handleDragResize,
    		handleDragResizeDrop,
    		calculateStyle,
    		moveHandles: moveHandles$1,
    		dispatch,
    		forward,
    		setActive,
    		setInactive
    	});

    	$$self.$inject_state = $$props => {
    		if ('frame' in $$props) $$invalidate(0, frame = $$props.frame);
    		if ('addedClass' in $$props) $$invalidate(1, addedClass = $$props.addedClass);
    		if ('coords' in $$props) coords = $$props.coords;
    		if ('offset' in $$props) $$invalidate(2, offset = $$props.offset);
    		if ('topCorner' in $$props) topCorner = $$props.topCorner;
    		if ('resizable' in $$props) resizable = $$props.resizable;
    		if ('styleConstant' in $$props) styleConstant = $$props.styleConstant;
    		if ('dimensionalConstant' in $$props) dimensionalConstant = $$props.dimensionalConstant;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		frame,
    		addedClass,
    		offset,
    		handleDragStartMove,
    		handleDragMove,
    		handleDragStartResize,
    		handleDragResize,
    		calculateStyle,
    		forward,
    		dragover_handler,
    		dragstart_handler,
    		dragstart_handler_1,
    		dragstart_handler_2,
    		dragstart_handler_3,
    		dragover_handler_1,
    		mousedown_handler
    	];
    }

    class Frame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { frame: 0, addedClass: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Frame",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*frame*/ ctx[0] === undefined && !('frame' in props)) {
    			console_1$1.warn("<Frame> was created without expected prop 'frame'");
    		}
    	}

    	get frame() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set frame(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addedClass() {
    		throw new Error("<Frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addedClass(value) {
    		throw new Error("<Frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let appStorage = window.localStorage;
    function saveToLocal(prop, value) {
        appStorage.setItem(prop, JSON.stringify(value));
        // console.log(appStorage.getItem(prop))
    }
    function loadFromLocal(prop, value) {
        let fetched = null;
        try {
            fetched = JSON.parse(appStorage.getItem(prop));
            if (fetched == "") {
                throw new Error("Smile empty soul");
            }
        }
        catch (e) {
            console.warn(e);
            fetched = value;
        }
        finally {
            return fetched;
        }
    }
    function autosave(frameList) {
        // console.log('saving. . .')
        saveToLocal('frameList', frameList);
    }

    /* src\App.svelte generated by Svelte v3.41.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	return child_ctx;
    }

    // (269:3) {#if frameList.length !== 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*frameList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*frameList, reorderLayers, currentFrame, currentEdge*/ 525) {
    				each_value = /*frameList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(269:3) {#if frameList.length !== 0}",
    		ctx
    	});

    	return block;
    }

    // (270:3) {#each frameList as frame}
    function create_each_block(ctx) {
    	let div;
    	let frame;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[12](/*frame*/ ctx[31]);
    	}

    	frame = new Frame({
    			props: {
    				addedClass: /*frame*/ ctx[31].top == true ? 'zindexMax' : '',
    				frame: /*frame*/ ctx[31]
    			},
    			$$inline: true
    		});

    	frame.$on("click", click_handler);
    	frame.$on("message", /*message_handler*/ ctx[13]);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[14](/*frame*/ ctx[31]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(frame.$$.fragment);
    			t = space();
    			add_location(div, file, 272, 4, 9629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(frame, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const frame_changes = {};
    			if (dirty[0] & /*frameList*/ 1) frame_changes.addedClass = /*frame*/ ctx[31].top == true ? 'zindexMax' : '';
    			if (dirty[0] & /*frameList*/ 1) frame_changes.frame = /*frame*/ ctx[31];
    			frame.$set(frame_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(frame.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(frame.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(frame);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(270:3) {#each frameList as frame}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*frameList*/ ctx[0].length !== 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "id", "dropzone");
    			attr_dev(div, "class", "svelte-woq6ej");
    			add_location(div, file, 247, 3, 8875);
    			attr_dev(main, "class", "svelte-woq6ej");
    			add_location(main, file, 231, 3, 8274);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keyup", /*keyup_handler*/ ctx[11], false, false, false),
    					listen_dev(div, "mouseup", /*mouseup_handler*/ ctx[15], false, false, false),
    					listen_dev(div, "mousedown", /*mousedown_handler*/ ctx[16], false, false, false),
    					listen_dev(div, "dragover", dragover_handler, false, false, false),
    					listen_dev(div, "drop", prevent_default(/*drop_handler*/ ctx[17]), false, true, false),
    					listen_dev(div, "paste", /*paste_handler*/ ctx[18], false, false, false),
    					listen_dev(div, "mousemove", /*mousemove_handler*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*frameList*/ ctx[0].length !== 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*frameList*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function moveHandles(frame) {
    	frame.topLeftHandle.x = frame.x;
    	frame.topLeftHandle.y = frame.y;
    	frame.topRightHandle.x = frame.x + frame.width - frame.topRightHandle.width;
    	frame.topRightHandle.y = frame.y;
    	frame.bottomLeftHandle.x = frame.x;
    	frame.bottomLeftHandle.y = frame.y + frame.height - frame.bottomLeftHandle.height;
    	frame.bottomRightHandle.x = frame.x + frame.width - frame.bottomRightHandle.width;
    	frame.bottomRightHandle.y = frame.y + frame.height - frame.bottomRightHandle.height;
    	return frame;
    }

    const dragover_handler = event => {
    	// console.log(event.movementX)
    	// resize(event, currentFrame, currentEdge)
    	return false;
    };

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let frameList = [];
    	let id = 0;
    	let coords = { x: 0, y: 0 };
    	let offset = [];
    	let currentFrame;
    	let currentEdge;
    	let addedClass;
    	let defaultHandle = { width: 20, height: 20, x: 0, y: 0 };
    	frameList = loadFromLocal('frameList', frameList);
    	console.log(frameList);

    	if (frameList.length == 0) {
    		let init = buildFrame("https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg");
    		frameList.push(init);
    	}

    	setInterval(
    		() => {
    			autosave(frameList);
    		},
    		4000
    	);

    	const handleDragStart = (event, frameid) => {
    		// console.log(frameid)
    		event.dataTransfer.setData("frame id", frameid);

    		event.dataTransfer.dropEffect = "move";
    		$$invalidate(1, coords.x = event.clientX, coords);
    		$$invalidate(1, coords.y = event.clientY, coords);
    		offset = [coords.x - frameList[frameid].x, coords.y - frameList[frameid].y];
    		return offset; // shouldn't change on drag
    	};

    	const dragOver = event => {
    		$$invalidate(1, coords.x = event.clientX, coords);
    		$$invalidate(1, coords.y = event.clientY, coords);
    		let id = event.dataTransfer.getData("frame id");

    		// console.log(id)
    		[frameList[id].x, frameList[id].y]; //top left

    		$$invalidate(0, frameList[id].x = coords.x - offset[0], frameList);
    		$$invalidate(0, frameList[id].y = coords.y - offset[1], frameList);
    		$$invalidate(0, frameList[id].style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px;`, frameList);

    		// console.log(frameList[id].style)
    		// console.log(coords, offset, corner)
    		return false;
    	};

    	/*
    https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
    + [0,0]

    + [4,3]
    x [6,4] -> [2,1] ([0,0])
    + [3,3]

    + [7,6]
    x [9,5] -> [2,1] ([0,0])
    */
    	const drop = (event, coords) => {
    		if (!event.dataTransfer.getData("frame id")) {
    			let data = event.dataTransfer.getData("text");

    			// console.log(event)
    			// console.log('drop')
    			let newFrame = buildFrame(data);

    			newFrame.x = event.clientX;
    			newFrame.y = event.clientY;
    			newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;

    			data
    			? $$invalidate(0, frameList = [...frameList, newFrame])
    			: null;
    		} // console.log(frameList)
    		// console.log(newFrame.style)

    		if (event.dataTransfer.dropEffect == "move") {
    			event.dataTransfer.getData("frame id");
    		} // frameList[id].x = coords.x - frameList[id].x
    		// frameList[id].y = coords.y - frameList[id].y
    	}; // console.log(event.dataTransfer.getData('frame id'))
    	// console.log(coords)

    	const paste = event => {
    		var _a, _b;

    		let image = (_a = event === null || event === void 0
    		? void 0
    		: event.clipboardData) === null || _a === void 0
    		? void 0
    		: _a.items[0].getAsFile();

    		let data = (_b = event === null || event === void 0
    		? void 0
    		: event.clipboardData) === null || _b === void 0
    		? void 0
    		: _b.getData("text");

    		if (image) {
    			data = URL.createObjectURL(image);
    			console.log(image);
    			console.log(data);
    		}

    		console.log(event);
    		console.log("paste");
    		let newFrame = buildFrame(data);
    		newFrame.x = 0;
    		newFrame.y = 0;
    		newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;

    		data
    		? $$invalidate(0, frameList = [...frameList, newFrame])
    		: null;

    		console.log(frameList);
    		console.log(newFrame.style);
    	};

    	function buildFrame(data) {
    		let frame = {
    			url: data,
    			width: 400,
    			height: 400,
    			x: 0,
    			y: 0,
    			style: ``,
    			id,
    			topLeftHandle: defaultHandle,
    			topRightHandle: Object.assign(Object.assign({}, defaultHandle), { x: 380 }),
    			bottomRightHandle: Object.assign(Object.assign({}, defaultHandle), { x: 380, y: 380 }),
    			bottomLeftHandle: Object.assign(Object.assign({}, defaultHandle), { y: 380 }),
    			top: true
    		};

    		id = id + 1;
    		$$invalidate(0, frameList = reorderLayers(frame.id));

    		// console.log(frame);
    		return frame;
    	}

    	let resizable = false;

    	const setActive = () => {
    		// console.log("well");
    		resizable = true;
    	};

    	const setInactive = () => {
    		// console.log("nevermind");
    		resizable = false;

    		$$invalidate(2, currentFrame = null);
    	};

    	const dispatch = createEventDispatcher();

    	const forward = message => {
    		dispatch(message);
    	};

    	const calculateStyle = (frame, corner) => {
    		let style = "";
    		let addedStyle;

    		// let width = (frame.topRightHandle.x + frame.topRightHandle.width) - frame.topLeftHandle.x
    		// let height = (frame.bottomRightHandle.y + frame.bottomRightHandle.height) - frame.topLeftHandle.y
    		let width = frame.width;

    		let height = frame.height;

    		if (corner) {
    			switch (corner) {
    				case 'tleft':
    					width = frame.topLeftHandle.width;
    					height = frame.topLeftHandle.height;
    					addedStyle = ` top: ${frame.topLeftHandle.y}px; left: ${frame.topLeftHandle.x}px;`;
    					break;
    				case 'tright':
    					width = frame.topRightHandle.width;
    					height = frame.topRightHandle.height;
    					addedStyle = ` top: ${frame.topRightHandle.y}px; left: ${frame.topRightHandle.x}px;`;
    					break;
    				case 'bleft':
    					width = frame.bottomLeftHandle.width;
    					height = frame.bottomLeftHandle.height;
    					addedStyle = ` top: ${frame.bottomLeftHandle.y}px; left: ${frame.bottomLeftHandle.x}px;`;
    					break;
    				case 'bright':
    					width = frame.bottomRightHandle.width;
    					height = frame.bottomRightHandle.height;
    					addedStyle = ` top: ${frame.bottomRightHandle.y}px; left: ${frame.bottomRightHandle.x}px;`;
    					break;
    				default:
    					return;
    			}
    		}

    		style = `width: ${width}px; height: ${height}px; position: fixed;`;

    		if (!corner) {
    			style = style + ` background-image: url('${frame.url}'); top: ${frame.y}px; left: ${frame.x}px;`;
    		}

    		if (corner) {
    			style = style + addedStyle;
    		}

    		return style;
    	};

    	const trackMouse = (event, frameId, edge) => {
    		let frame = frameList[frameId];

    		if (resizable) {
    			// if (event.resize){
    			$$invalidate(1, coords.x = event.movementX, coords);

    			$$invalidate(1, coords.y = event.movementY, coords);

    			// if (frameList[frameId]) {
    			// console.log(frameId);
    			frame.width += coords.x;

    			frame.height += coords.y;
    			frame.bottomRightHandle.x += coords.x;
    			frame.bottomRightHandle.y += coords.y;

    			// console.log(frame.width)
    			// console.log(frameList[frameId].width)
    			frame = moveHandles(frame);

    			frame.style = calculateStyle(frame);
    		} // console.log(frame.style)
    		// }

    		// }
    		return frame;
    	};

    	function reorderLayers(frameid) {
    		let newList = frameList.map(frame => {
    			if (frame.id == frameid) {
    				frame = Object.assign(Object.assign({}, frame), { top: true });
    			} else {
    				frame = Object.assign(Object.assign({}, frame), { top: false });
    			}

    			return frame;
    		});

    		return newList;
    	}

    	function handleKeypress(event) {
    		switch (event.key) {
    			case 'Delete':
    			case 'Backspace':
    				$$invalidate(0, frameList = frameList.filter(frame => frame.top == false));
    				break;
    		}
    	} // console.log(event)

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const keyup_handler = event => handleKeypress(event);

    	const click_handler = frame => {
    		$$invalidate(0, frameList = reorderLayers(frame.id));
    	};

    	const message_handler = message => {
    		$$invalidate(2, currentFrame = message);

    		// console.log("ayy");
    		$$invalidate(2, currentFrame = currentFrame?.detail?.frame.id);

    		$$invalidate(3, currentEdge = message);
    		$$invalidate(3, currentEdge = currentEdge?.detail?.edge);
    		console.log(currentEdge);
    	};

    	const click_handler_1 = frame => {
    		$$invalidate(0, frameList = reorderLayers(frame.id));
    	};

    	const mouseup_handler = event => setInactive();

    	const mousedown_handler = event => {
    		setActive();
    	}; // console.log(frameList)

    	const drop_handler = event => drop(event, coords);
    	const paste_handler = event => paste(event);

    	const mousemove_handler = event => {
    		frameList[currentFrame]
    		? $$invalidate(0, frameList[currentFrame] = trackMouse(event, currentFrame), frameList)
    		: null;
    	};

    	$$self.$capture_state = () => ({
    		Frame,
    		createEventDispatcher,
    		autosave,
    		loadFromLocal,
    		frameList,
    		id,
    		coords,
    		offset,
    		currentFrame,
    		currentEdge,
    		addedClass,
    		defaultHandle,
    		handleDragStart,
    		dragOver,
    		drop,
    		paste,
    		buildFrame,
    		resizable,
    		setActive,
    		setInactive,
    		dispatch,
    		forward,
    		moveHandles,
    		calculateStyle,
    		trackMouse,
    		reorderLayers,
    		handleKeypress
    	});

    	$$self.$inject_state = $$props => {
    		if ('frameList' in $$props) $$invalidate(0, frameList = $$props.frameList);
    		if ('id' in $$props) id = $$props.id;
    		if ('coords' in $$props) $$invalidate(1, coords = $$props.coords);
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('currentFrame' in $$props) $$invalidate(2, currentFrame = $$props.currentFrame);
    		if ('currentEdge' in $$props) $$invalidate(3, currentEdge = $$props.currentEdge);
    		if ('addedClass' in $$props) addedClass = $$props.addedClass;
    		if ('defaultHandle' in $$props) defaultHandle = $$props.defaultHandle;
    		if ('resizable' in $$props) resizable = $$props.resizable;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		frameList,
    		coords,
    		currentFrame,
    		currentEdge,
    		drop,
    		paste,
    		setActive,
    		setInactive,
    		trackMouse,
    		reorderLayers,
    		handleKeypress,
    		keyup_handler,
    		click_handler,
    		message_handler,
    		click_handler_1,
    		mouseup_handler,
    		mousedown_handler,
    		drop_handler,
    		paste_handler,
    		mousemove_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        // props: {
        // 	name: 'world'
        // }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
