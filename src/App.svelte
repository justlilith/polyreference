<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { autosave, loadFromLocal } from './components/ts/autosave'
	import * as Helpers from './components/ts/helpers'
	import Frame from "./components/Frame.svelte";
	import Input from './components/Input.svelte'
	
	let frameList:FrameT[]
	
	let id = 0;
	let coords = { x: 0, y: 0 };
	let offset = [];
	let currentFrame;
	let currentEdge;
	
	frameList = loadFromLocal('frameList', frameList)
	console.log(frameList)
	
	if (frameList === null || frameList === undefined){
		frameList = new Array()
		
		let init = Helpers.buildFrame(
		"https://c.pxhere.com/images/8c/33/1bb3e98042854d9eee207eb9facc-1622223.jpg!d"
		, frameList)
		.then(frame => {
			
			frame.x = 50
			frame.y = 100
			frameList = [...frameList, frame]
			frameList = Helpers.reorderLayers(frame.id, frameList)
			console.log(frameList.filter(frame => frame.id == frame.id))
		})
	}
	
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
		frameList[
		id
		].style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px;`;
		return false;
	};
	
	const drop = async (event, coords) => {
		console.log('dropped')
		event.preventDefault()
		if (event.dataTransfer.items) {
			console.log('swell')
			let file = event.dataTransfer.items[0].getAsFile()
			if (file.type.includes('image')) {
				let data = URL.createObjectURL(file);
				let newFrame = await Helpers.buildFrame(data, frameList);
				newFrame.x = 50;
				newFrame.y = 100;
				newFrame.style = Helpers.calculateStyle(newFrame)
				newFrame = Helpers.moveHandles(newFrame)
				frameList = [...frameList, newFrame]
				// console.log(data)
			}
			// console.log(file)
		}
		if (!event.dataTransfer.getData("frame id")) {
			let data = event.dataTransfer.getData("text");
			let newFrame = await Helpers.buildFrame(data, frameList);
			newFrame.x = event.clientX;
			newFrame.y = event.clientY;
			newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
			data ? (frameList = [...frameList, newFrame]) : null;
			frameList = Helpers.reorderLayers(newFrame.id, frameList)
		}
		if (event.dataTransfer.dropEffect == "move") {
			let id = event.dataTransfer.getData("frame id");
		}
		// if (event.dataTransfer.
	};
	
	const paste = async (event) => {
		let image = event?.clipboardData?.items[0].getAsFile();
		let data = event?.clipboardData?.getData("text");
		if (image) {
			data = URL.createObjectURL(image);
		}
		let newFrame = await Helpers.buildFrame(data, frameList);
		newFrame.x = 50;
		newFrame.y = 100;
		newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
		
		let newImage = new Image()
		newImage.src = data
		newImage.onload = () => {
			console.log(newImage.naturalHeight, newImage.naturalWidth)
			newFrame.height = newImage.naturalHeight
			newFrame.width = newImage.naturalWidth
			newFrame = Helpers.fitToScreen(newFrame)
			newFrame.style = Helpers.calculateStyle(newFrame)
			Helpers.moveHandles(newFrame)
			
			data ? (frameList = [...frameList, newFrame]) : null;
			frameList = Helpers.reorderLayers(newFrame.id, frameList)
			console.log(frameList.filter(frame => frame.id == newFrame.id))
		}
	};
	
	let resizable: boolean = false;
	
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
</script>



<svelte:window
on:keydown="{(event) => frameList = Helpers.handleKeypress(event, frameList)}"
/>
<main
>



<Input bind:frameList></Input>

<div
id="dropzone"

on:mouseup="{event => {
	setInactive()
	autosave(frameList)
}}"
on:mousedown="{event => {
	let target = event.target
	if (target?.id=='dropzone') {
		frameList = Helpers.clearActiveFrame(frameList)
	} else {
		setActive()
	}
}}"
on:dragover|stopPropagation|preventDefault={(event) => {
	// console.log('dragon')
	return false;
}}
on:drop|stopPropagation|preventDefault="{(event) => drop(event, coords)}"
on:paste="{(event) => paste(event)}"
on:mousemove="{(event) => {
	if (frameList[currentFrame]) {
		if (resizable == true) {
			frameList[currentFrame] = Helpers.trackMouse(event, currentFrame, frameList, currentEdge)
		}
	}
}}"
>

{#if frameList.length > 0}
{#each frameList as frame}
{#if frame == null}
<!--  -->
{frameList = Helpers.purgeFrames(frameList)}
{:else}
<div
on:click="{() => {
	frame = Helpers.moveHandles(frame)
	frameList = Helpers.reorderLayers(frame.id, frameList)
}}"
>
<Frame
bind:frameList
addedClass="{`${frame?.top == true ? 'zindexMax' : ''} ${frame?.active == true ? 'active' : ''}`}"
on:click="{() => {frameList = Helpers.reorderLayers(frame.id, frameList)}}"
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
{/if}

</div>
</main>



<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}
	
	#dropzone {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: hsl(200, 10%, 10%);
	}
	
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
