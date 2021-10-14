<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte'
	import { loop_guard } from 'svelte/internal';
	import { get } from 'svelte/store'
	
	import Frame from '$lib/components/Frame.svelte'
	import Input from '$lib/components/Input.svelte'
	import AuthMenu from '$lib/components/AuthMenu.svelte'
	import Statusbar from '$lib/components/Statusbar.svelte'
	import send from '$lib/components/Crier.svelte'
	
	import { autosave, loadFromLocal } from '$lib/ts/autosave'
	import * as Storage from '$lib/ts/storage'
	import * as Helpers from '$lib/ts/helpers'
	import * as State from '$lib/ts/state'
	import * as Auth from '$lib/ts/auth'
	import type { Session, User } from '@supabase/gotrue-js';
	
	
	let frameList:FrameT[]
	let oldFrameList:FrameT[]
	let states:StateT[] = []
	
	let id = 0
	let coords = { x: 0, y: 0 }
	let offset = []
	let currentFrame = null
	let currentEdge:string = ""
	let appStorage:Storage
	
	let loggedIn = false
	let userData: User = null
	let sessionData: Session = null
	let firstRun = true
	
	onMount( async () => {
		Auth.authStore.subscribe(async (update) => {
			loggedIn = update.loggedIn
			userData = update.userData
			sessionData = update.sessionData
			if (loggedIn) {
				console.log('did fetch')
				const { fetchedFrameList, error } = await Storage.fetchFrames(update.userData)
				if (!error) {
					if (fetchedFrameList.length != 0) {
						State.append(fetchedFrameList)
					}
				} else {
					console.log(error)
				}
			}
		})
		
		State.StateStore.subscribe(async (currentState)=> {
			if (currentState) {
				frameList = currentState.framesSnapshot
				frameList = frameList.map(frame => {
					frame = Helpers.moveHandles(frame)
					return {...frame, style: Helpers.calculateStyle(frame)}
				})
				console.log(frameList)
				if (loggedIn) {
					await Storage.uploadFrames(Auth.userData, frameList)
				}
			} else {
				frameList = []
			}
		})
		
		loggedIn = await Auth.authCheck()
		firstRun = false
		
		appStorage = window.localStorage
		
		if (loggedIn == false) {
			frameList = loadFromLocal(appStorage, 'frameList', frameList) as FrameT[]
			console.log(frameList)
			frameList ? oldFrameList = Helpers.deepCopy(frameList) : oldFrameList = []
		}
		
		if (loggedIn == false && frameList === null || frameList === undefined || frameList?.length == 0){
			frameList = new Array()
			
			Helpers.buildFrame({
				userData
				, url: "https://c.pxhere.com/images/8c/33/1bb3e98042854d9eee207eb9facc-1622223.jpg!d"
				, frameList})
				.then(newFrame => {
					
					newFrame.x = 50
					newFrame.y = 100
					newFrame.style = Helpers.calculateStyle(newFrame)
					newFrame = Helpers.moveHandles(newFrame)
					frameList.push(newFrame)
					frameList = Helpers.reorderLayers(newFrame.id, frameList)
					State.append(frameList)
					// Storage.uploadFrames(Auth.userData, frameList)
					// console.log(frameList.filter(frame => frame.id == frame.id))
				})
			}
			
			State.append(frameList)
			
			
			
			states =
			[
			{ currentTrans: ''
			, currentState:	State.calculate(states, 0, frameList)
			, framesSnapshot: frameList
		}
		]
	})
	
	
	const handleDragStart = (event, frameid) => {
		event.dataTransfer.setData("frame id", frameid);
		event.dataTransfer.dropEffect = "move";
		coords.x = event.clientX;
		coords.y = event.clientY;
		offset = [coords.x - frameList[frameid].x, coords.y - frameList[frameid].y];
		return offset; // shouldn't change on drag
	};
	
	const dragOver = (event) => {
		coords.x = event.clientX;
		coords.y = event.clientY;
		let id = event.dataTransfer.getData("frame id");
		let corner = [frameList[id].x, frameList[id].y]; //top left
		frameList[id].x = coords.x - offset[0];
		frameList[id].y = coords.y - offset[1];
		frameList[id]
		.style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px;`;
		return false;
	};
	
	const drop = async (event, coords) => {
		console.log('dropped')
		event.preventDefault()
		if (event.dataTransfer.items) {
			// console.log('swell')
			let file = event.dataTransfer.items[0].getAsFile()
			if (file && file.type.includes('image')) {
				let data = URL.createObjectURL(file);
				let newFrame = await Helpers.buildFrame({url:data, userData, frameList});
				newFrame.x = 50;
				newFrame.y = 100;
				newFrame.style = Helpers.calculateStyle(newFrame)
				newFrame = Helpers.moveHandles(newFrame)
				// State.append([...frameList, newFrame])
				frameList = [...frameList, newFrame]
				State.append(frameList)
				// console.log(data)
			}
			// console.log(file)
		}
		if (!event.dataTransfer.getData("frame id")) {
			let data = event.dataTransfer.getData("text");
			let newFrame = await Helpers.buildFrame({url:data, userData, frameList});
			newFrame.x = event.clientX;
			newFrame.y = event.clientY;
			newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
			let newFrameList = frameList
			data ? (newFrameList = [...newFrameList, newFrame]) : null;
			newFrameList = Helpers.reorderLayers(newFrame.id, newFrameList)
			frameList = newFrameList
			// State.append(newFrameList)
			State.append(frameList)
		}
		if (event.dataTransfer.dropEffect == "move") {
			console.log('moved')
			let id = event.dataTransfer.getData("frame id");
			State.append(frameList)
		}
		// if (event.dataTransfer.
	}
	
	let resizable: boolean = false;
	
	let pannable: boolean = false;
	let dropzone
	let startingScale: number = 1
	
	const setActive = () => {
		resizable = true;
	};
	const setInactive = () => {
		resizable = false;
		currentFrame = null
	};
	
	const dispatch = createEventDispatcher();
	
	const forward = (message) => {
		dispatch(message);
	};
	
	let keysLockedOut = false
	
</script>



<svelte:window
on:keydown="{(event) => {
	if (loggedIn == false) {
		userData = null
	}
	if (keysLockedOut == false) {
		Helpers.handleKeypress({userData, event, frameList})
	}
}}"
/>



<main>
	
	<Input bind:keysLockedOut bind:frameList bind:userData></Input>
	
	<AuthMenu bind:keysLockedOut></AuthMenu>
	
	<div
	id="dropzone"
	on:click='{()=>{keysLockedOut = false}}'
	bind:this={dropzone}
	on:dragover|stopPropagation|preventDefault={(event) => {
		// console.log('dragon')
		return false;
	}}
	on:drop|stopPropagation|preventDefault="{(event) => drop(event, coords)}"
	on:paste="{async (event) => {
		try {
			await Helpers.paste({userData, frameList, event, appStorage, loggedIn})
		} catch (e) {
			console.log(e)
		}
		// console.log({userData, frameList, event, appStorage, loggedIn})
		// console.log(event.clipboardData.items[0].getAsFile())
		// console.log(event.clipboardData.getData("text"))
		// console.log()
	}}"
	
	on:touchstart="{(event) => {
		event.preventDefault()
		if (event.targetTouches.length > 1) {
			try {
				let pointer1 = event.targetTouches[0]
				let pointer2 = event.targetTouches[1]
				
				let width = Math.abs(pointer1.clientX - pointer2.clientX)
				let height = Math.abs(pointer1.clientY - pointer2.clientY)
				startingScale = Math.sqrt(width ** 2 + height ** 2)
				oldFrameList = Helpers.deepCopy(frameList)
			} catch (e) {
				console.log(e)
			}
		}
	}}"
	on:touchmove="{(event) => {
		// console.log(startingScale, "oh wow")
		// event.preventDefault()
		
		if (event.targetTouches.length == 2) {
			// console.log(event);
			frameList = Helpers.touchZoomHandler(Helpers.deepCopy(oldFrameList), event, startingScale);
			// console.log(startingScale, "okay")
			// State.append(frameList)
			// console.log(dropzone.style)
			// dropzone.style =
			// `transform: scale(${transOptions.transfomScale});
			// transform-origin: ${transOptions.center[0]}px ${transOptions.center[1]}px;`
		}
		if (pannable && event?.changedTouches?.length == 1) {
			frameList = frameList.map(frame => {
				frame = Helpers.moveFrame(event, frame, frame.offset)
				return frame
			})
		}
	}}"
	on:pointerdown="{(event) => {
		// console.log(event)
		// let target = event.target
		// let targetId = event.currentTarget.id
		let targetId = event.target["id"]
		// console.log(targetId)
		// if (target?.id == 'dropzone') {
			if (targetId == 'dropzone') {
				if ((event.pointerType == 'touch' && event.isPrimary) || event.pointerType == 'mouse') { 
					frameList = Helpers.clearActiveFrame(frameList)
				}
				if (event.pointerType == 'touch') { 
					if (event.isPrimary) {
						pannable = true
					} else {
						pannable = false
					}
				}
				if (event.pointerType == 'mouse') {
					pannable = true
				}
				frameList = frameList.map(frame => {
					frame.offset = [
					event.clientX - frame.x
					, event.clientY - frame.y
					]
					return frame
				})
				// console.log(offset)
			} else {
				setActive()
			}
		}}"
		on:pointermove="{(event) => {
			if (resizable == true) {
				if (frameList[currentFrame]) {
					frameList[currentFrame] = Helpers.trackMouse(event, currentFrame, frameList)
				}
			}
			if (pannable && event?.pointerType === 'mouse') {
				frameList = frameList.map(frame => {
					frame = Helpers.moveFrame(event, frame, frame.offset)
					return frame
				})
			}
		}}"
		on:pointerup="{event => {
			setInactive()
			pannable = false
			// frameList = newFrameList
			State.append(frameList)
			// console.log('what')
			autosave({userData: userData, frameList:frameList})
		}}"
		>
		
		{#if frameList?.length > 0}
		{#each frameList as frame}
		{#if frame == null}
		<!--  -->
		{frameList = Helpers.purgeFrames(frameList)}
		{:else}
		<div
		on:pointerdown="{(event) => {
			if ((event.pointerType == 'touch' && event.isPrimary) || event.pointerType == 'mouse') { 
				frame = Helpers.moveHandles(frame)
				frameList = Helpers.reorderLayers(frame.id, frameList)
			}
			// State.append(frameList)
		}}"
		>
		<Frame
		bind:frameList
		bind:userData
		addedClass="{`${frame?.top == true ? 'zindexMax' : ''} ${frame?.active == true ? 'active' : ''}`}"
		on:message={(message) => {
			let currentMessage = message;
			currentFrame = currentMessage?.detail?.frame.id;
			currentEdge = currentMessage?.detail?.edge;
		}}
		{frame}
		/>
	</div>
	{/if}
	{/each}
	{:else}
	{#if firstRun}
	<div><h1>Loading...</h1></div>
	{/if}
	{/if}
	
</div>

<Statusbar></Statusbar>

</main>



<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0;
	}
	
	#dropzone {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: hsl(200, 10%, 10%);
		/* overflow:scroll */
	}
	
	h1 {
		color: cyan;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		padding:10%;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
