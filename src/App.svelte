<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { autosave, loadFromLocal } from './components/ts/autosave'
	import { buildFrame, reorderLayers } from './components/ts/helpers'
	import Frame from "./components/Frame.svelte";
	import Input from './components/Input.svelte'
	
	let frameList:FrameT[]
	
	let id = 0;
	let coords = { x: 0, y: 0 };
	let offset = [];
	let currentFrame;
	let currentEdge;
	
	let addedClass
	
	
	frameList = loadFromLocal('frameList', frameList)
	console.log(frameList)
	
	if (frameList === null || frameList === undefined){
		frameList = new Array()
		
		let init = buildFrame(
		"https://c.pxhere.com/images/8c/33/1bb3e98042854d9eee207eb9facc-1622223.jpg!d"
		, frameList);
		
		frameList.push(init);
	}
	
	setInterval(() => {
		autosave(frameList)
	},4000)
	
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
	
	const drop = (event, coords) => {
		if (!event.dataTransfer.getData("frame id")) {
			let data = event.dataTransfer.getData("text");
			let newFrame = buildFrame(data, frameList);
			newFrame.x = event.clientX;
			newFrame.y = event.clientY;
			newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
			data ? (frameList = [...frameList, newFrame]) : null;
			frameList = reorderLayers(newFrame.id, frameList)
		}
		if (event.dataTransfer.dropEffect == "move") {
			let id = event.dataTransfer.getData("frame id");
		}
	};
	
	const paste = (event) => {
		let image = event?.clipboardData?.items[0].getAsFile();
		let data = event?.clipboardData?.getData("text");
		if (image) {
			data = URL.createObjectURL(image);
		}
		let newFrame = buildFrame(data, frameList);
		newFrame.x = 0;
		newFrame.y = 0;
		newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
		data ? (frameList = [...frameList, newFrame]) : null;
		frameList = reorderLayers(newFrame.id, frameList)
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
	
	function moveHandles(frame: FrameT): FrameT {
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
	
	const calculateStyle = (frame:FrameT, corner?:string):string => {
		let style:string = ""
		let addedStyle:string
		
		let width = frame.width
		let height = frame.height
		
		if (corner) {
			switch (corner) {
				case 'tleft':
				width = frame.topLeftHandle.width
				height = frame.topLeftHandle.height
				addedStyle = ` top: ${frame.topLeftHandle.y}px; left: ${frame.topLeftHandle.x}px;`
				break
				case 'tright':
				width = frame.topRightHandle.width
				height = frame.topRightHandle.height
				addedStyle = ` top: ${frame.topRightHandle.y}px; left: ${frame.topRightHandle.x}px;`
				break
				case 'bleft':
				width = frame.bottomLeftHandle.width
				height = frame.bottomLeftHandle.height
				addedStyle = ` top: ${frame.bottomLeftHandle.y}px; left: ${frame.bottomLeftHandle.x}px;`
				break
				case 'bright':
				width = frame.bottomRightHandle.width
				height = frame.bottomRightHandle.height
				addedStyle = ` top: ${frame.bottomRightHandle.y}px; left: ${frame.bottomRightHandle.x}px;`
				break
				default:
				return
			}
		}
		
		style = `width: ${width}px; height: ${height}px; position: fixed;`
		
		if (!corner) {
			style = style + ` background-image: url('${frame.url}'); top: ${frame.y}px; left: ${frame.x}px;` 
		}
		if (corner) {
			style = style + addedStyle
		}
		return style
	}
	
	const trackMouse = (event, frameId, edge):FrameT => {
		let frame = frameList[frameId]
		if (resizable) {
			coords.x = event.movementX;
			coords.y = event.movementY;
			frame.width += coords.x
			frame.height += coords.y
			frame.bottomRightHandle.x += coords.x
			frame.bottomRightHandle.y += coords.y
			frame = moveHandles(frame)
			frame.style = calculateStyle(frame)
		}
		return frame
	};
	
	function handleKeypress(event){
		switch (event.key) {
			case 'Delete':
			case 'Backspace':
			frameList = frameList.filter(frame => frame.top == false)
			break
			default:
			break
		}
	}
</script>



<svelte:window
on:keyup="{(event) => handleKeypress(event)}"
/>
<main
>



<Input bind:frameList></Input>

<div
id="dropzone"

on:mouseup="{event => setInactive()}"
on:mousedown="{event => {
	setActive()
}}"
on:dragover={(event) => {
	return false;
}}
on:drop|preventDefault="{(event) => drop(event, coords)}"
on:paste="{(event) => paste(event)}"
on:mousemove="{(event) => {
	frameList[currentFrame] ? frameList[currentFrame] = trackMouse(event, currentFrame, currentEdge) : null
}}"
>

{#if frameList.length > 0}
{#each frameList as frame}
<div
on:click="{() => {frameList = reorderLayers(frame.id, frameList)}}"
>
<Frame
bind:frameList
addedClass={frame.top == true? 'zindexMax' : ''}
on:click="{() => {frameList = reorderLayers(frame.id, frameList)}}"
on:message={(message) => {
	currentFrame = message;
	currentFrame = currentFrame?.detail?.frame.id;
	currentEdge = message;
	currentEdge = currentEdge?.detail?.edge;
}}
{frame}
/>
</div>
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
