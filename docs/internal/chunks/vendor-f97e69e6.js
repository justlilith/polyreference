function t(){}function n(t,n){for(const e in n)t[e]=n[e];return t}function e(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(e)}function i(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function a(t,n,e,o){if(t){const r=l(t,n,e,o);return t[0](r)}}function l(t,e,o,r){return t[1]&&r?n(o.ctx.slice(),t[1](r(e))):o.ctx}function s(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(void 0===n.dirty)return r;if("object"==typeof r){const t=[],e=Math.max(n.dirty.length,r.length);for(let o=0;o<e;o+=1)t[o]=n.dirty[o]|r[o];return t}return n.dirty|r}return n.dirty}function u(t,n,e,o,r,i){if(r){const c=l(n,e,o,i);t.p(c,r)}}function f(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let t=0;t<e;t++)n[t]=-1;return n}return-1}function d(t){return null==t?"":t}let h,_=!1;function p(t,n,e,o){for(;t<n;){const r=t+(n-t>>1);e(r)<=o?t=r+1:n=r}return t}function m(t,n){if(_){for(!function(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if("HEAD"===t.nodeName){const t=[];for(let e=0;e<n.length;e++){const o=n[e];void 0!==o.claim_order&&t.push(o)}n=t}const e=new Int32Array(n.length+1),o=new Int32Array(n.length);e[0]=-1;let r=0;for(let l=0;l<n.length;l++){const t=n[l].claim_order,i=(r>0&&n[e[r]].claim_order<=t?r+1:p(1,r,(t=>n[e[t]].claim_order),t))-1;o[l]=e[i]+1;const c=i+1;e[c]=l,r=Math.max(c,r)}const i=[],c=[];let a=n.length-1;for(let l=e[r]+1;0!=l;l=o[l-1]){for(i.push(n[l-1]);a>=l;a--)c.push(n[a]);a--}for(;a>=0;a--)c.push(n[a]);i.reverse(),c.sort(((t,n)=>t.claim_order-n.claim_order));for(let l=0,s=0;l<c.length;l++){for(;s<i.length&&c[l].claim_order>=i[s].claim_order;)s++;const n=s<i.length?i[s]:null;t.insertBefore(c[l],n)}}(t),(void 0===t.actual_end_child||null!==t.actual_end_child&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);null!==t.actual_end_child&&void 0===t.actual_end_child.claim_order;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?void 0===n.claim_order&&n.parentNode===t||t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else n.parentNode===t&&null===n.nextSibling||t.appendChild(n)}function g(t,n,e){_&&!e?m(t,n):n.parentNode===t&&n.nextSibling==e||t.insertBefore(n,e||null)}function $(t){t.parentNode.removeChild(t)}function b(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function x(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function v(){return y(" ")}function E(){return y("")}function w(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function k(t){return function(n){return n.preventDefault(),t.call(this,n)}}function N(t){return function(n){return n.stopPropagation(),t.call(this,n)}}function A(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function S(t){return Array.from(t.childNodes)}function T(t,n,e,o,r=!1){!function(t){void 0===t.claim_info&&(t.claim_info={last_index:0,total_claimed:0})}(t);const i=(()=>{for(let o=t.claim_info.last_index;o<t.length;o++){const i=t[o];if(n(i)){const n=e(i);return void 0===n?t.splice(o,1):t[o]=n,r||(t.claim_info.last_index=o),i}}for(let o=t.claim_info.last_index-1;o>=0;o--){const i=t[o];if(n(i)){const n=e(i);return void 0===n?t.splice(o,1):t[o]=n,r?void 0===n&&t.claim_info.last_index--:t.claim_info.last_index=o,i}}return o()})();return i.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,i}function j(t,n,e){return function(t,n,e,o){return T(t,(t=>t.nodeName===n),(t=>{const n=[];for(let o=0;o<t.attributes.length;o++){const r=t.attributes[o];e[r.name]||n.push(r.name)}n.forEach((n=>t.removeAttribute(n)))}),(()=>o(n)))}(t,n,e,x)}function C(t,n){return T(t,(t=>3===t.nodeType),(t=>{const e=""+n;if(t.data.startsWith(e)){if(t.data.length!==e.length)return t.splitText(e.length)}else t.data=e}),(()=>y(n)),!0)}function z(t){return C(t," ")}function B(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function M(t,n){t.value=null==n?"":n}function O(t){h=t}function D(){if(!h)throw new Error("Function called outside component initialization");return h}function I(t){D().$$.on_mount.push(t)}function L(t){D().$$.after_update.push(t)}function P(){const t=D();return(n,e)=>{const o=t.$$.callbacks[n];if(o){const r=function(t,n,e=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,e,!1,n),o}(n,e);o.slice().forEach((n=>{n.call(t,r)}))}}}function q(t,n){D().$$.context.set(t,n)}function F(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach((t=>t.call(this,n)))}const H=[],W=[],G=[],J=[],K=Promise.resolve();let Q=!1;function R(t){G.push(t)}function U(t){J.push(t)}let V=!1;const X=new Set;function Y(){if(!V){V=!0;do{for(let t=0;t<H.length;t+=1){const n=H[t];O(n),Z(n.$$)}for(O(null),H.length=0;W.length;)W.pop()();for(let t=0;t<G.length;t+=1){const n=G[t];X.has(n)||(X.add(n),n())}G.length=0}while(H.length);for(;J.length;)J.pop()();Q=!1,V=!1,X.clear()}}function Z(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(R)}}const tt=new Set;let nt;function et(){nt={r:0,c:[],p:nt}}function ot(){nt.r||r(nt.c),nt=nt.p}function rt(t,n){t&&t.i&&(tt.delete(t),t.i(n))}function it(t,n,e,o){if(t&&t.o){if(tt.has(t))return;tt.add(t),nt.c.push((()=>{tt.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}const ct="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function at(t,n){const e={},o={},r={$$scope:1};let i=t.length;for(;i--;){const c=t[i],a=n[i];if(a){for(const t in c)t in a||(o[t]=1);for(const t in a)r[t]||(e[t]=a[t],r[t]=1);t[i]=a}else for(const t in c)r[t]=1}for(const c in o)c in e||(e[c]=void 0);return e}function lt(t){return"object"==typeof t&&null!==t?t:{}}function st(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function ut(t){t&&t.c()}function ft(t,n){t&&t.l(n)}function dt(t,n,o,c){const{fragment:a,on_mount:l,on_destroy:s,after_update:u}=t.$$;a&&a.m(n,o),c||R((()=>{const n=l.map(e).filter(i);s?s.push(...n):r(n),t.$$.on_mount=[]})),u.forEach(R)}function ht(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function _t(t,n){-1===t.$$.dirty[0]&&(H.push(t),Q||(Q=!0,K.then(Y)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function pt(n,e,i,c,a,l,s,u=[-1]){const f=h;O(n);const d=n.$$={fragment:null,ctx:null,props:l,update:t,not_equal:a,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:e.context||[]),callbacks:o(),dirty:u,skip_bound:!1,root:e.target||f.$$.root};s&&s(d.root);let p=!1;if(d.ctx=i?i(n,e.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return d.ctx&&a(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),p&&_t(n,t)),e})):[],d.update(),p=!0,r(d.before_update),d.fragment=!!c&&c(d.ctx),e.target){if(e.hydrate){_=!0;const t=S(e.target);d.fragment&&d.fragment.l(t),t.forEach($)}else d.fragment&&d.fragment.c();e.intro&&rt(n.$$.fragment),dt(n,e.target,e.anchor,e.customElement),_=!1,Y()}O(f)}class mt{$destroy(){ht(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const gt=[];function $t(n,e=t){let o;const r=new Set;function i(t){if(c(n,t)&&(n=t,o)){const t=!gt.length;for(const e of r)e[1](),gt.push(e,n);if(t){for(let t=0;t<gt.length;t+=2)gt[t][0](gt[t+1]);gt.length=0}}}return{set:i,update:function(t){i(t(n))},subscribe:function(c,a=t){const l=[c,a];return r.add(l),1===r.size&&(o=e(i)||t),c(n),()=>{r.delete(l),0===r.size&&(o(),o=null)}}}}export{I as A,n as B,$t as C,a as D,u as E,f as F,s as G,m as H,t as I,d as J,w as K,k as L,r as M,P as N,M as O,i as P,F as Q,W as R,mt as S,st as T,b as U,N as V,U as W,ct as X,S as a,A as b,j as c,$ as d,x as e,g as f,C as g,B as h,pt as i,ut as j,v as k,E as l,ft as m,z as n,dt as o,at as p,lt as q,et as r,c as s,y as t,it as u,ht as v,ot as w,rt as x,q as y,L as z};