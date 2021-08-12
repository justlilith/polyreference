<script lang="ts">
<<<<<<< HEAD
	import Frame from "./components/Frame.svelte";
	import { createEventDispatcher } from "svelte";
	import { autosave, loadFromLocal } from './components/ts/autosave'
	
=======
	import Moveable from 'svelte-moveable'
	import Frame from './components/Frame.svelte'
>>>>>>> main
	export let name: string;
	
	let frameList: Array<FrameT> = [];
		
		let id = 0;
		let coords = { x: 0, y: 0 };
		let offset = [];
		let currentFrame;
		let currentEdge;
		
		let addedClass
		
		let defaultHandle = { width: 20, height: 20, x: 0, y: 0 };
		
		let init = buildFrame(
		"https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg"
		);
		
		frameList.push(init);
		
		frameList = loadFromLocal('frameList', frameList)
		
		setInterval(() => {
			autosave(frameList)
		},1000)
		
<<<<<<< HEAD
=======
		let id = 0
		let coords = { x:0, y:0}
		let offset = []
		let currentFrame
		let active = {
			id: 0
		}
		
		let init = buildFrame('https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg')
		
		frameList.push(init)
>>>>>>> main
		
		const handleDragStart = (event, frameid) => {
			// console.log(frameid)
			event.dataTransfer.setData("frame id", frameid);
			event.dataTransfer.dropEffect = "move";
			coords.x = event.clientX;
			coords.y = event.clientY;
			offset = [coords.x - frameList[frameid].x, coords.y - frameList[frameid].y];
			return offset; // shouldn't change on drag
		};
		
<<<<<<< HEAD
		const dragOver = (event) => {
			coords.x = event.clientX;
			coords.y = event.clientY;
			let id = event.dataTransfer.getData("frame id");
			// console.log(id)
			let corner = [frameList[id].x, frameList[id].y]; //top left
			frameList[id].x = coords.x - offset[0];
			frameList[id].y = coords.y - offset[1];
			frameList[
			id
			].style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px;`;
			// console.log(frameList[id].style)
			// console.log(coords, offset, corner)
			return false;
		};
=======
		const dragover = (event) => {
			coords.x = event.clientX
			coords.y = event.clientY
			let id = event.dataTransfer.getData('frame id')
			let corner = [frameList[id].x, frameList[id].y] //top left
			// frameList[id].x = coords.x - offset[0]
			// frameList[id].y = coords.y - offset[1]
			frameList[id].style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px;`
			console.log(coords, offset, corner)
			return false
		}
>>>>>>> main
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
<<<<<<< HEAD
			if (!event.dataTransfer.getData("frame id")) {
				let data = event.dataTransfer.getData("text");
				// console.log(event)
				// console.log('drop')
				let newFrame = buildFrame(data);
				newFrame.x = event.clientX;
				newFrame.y = event.clientY;
				newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
				data ? (frameList = [...frameList, newFrame]) : null;
				// console.log(frameList)
				// console.log(newFrame.style)
=======
			if (!event.dataTransfer.getData('frame id')){
				let data = event.dataTransfer.getData('text')
				console.log(event)
				console.log('drop')
				let newFrame = buildFrame(data)
				newFrame.x = event.clientX
				newFrame.y = event.clientY
				newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`
				data ? frameList = [...frameList, newFrame] : null
				console.log(frameList)
				console.log(newFrame.style)
>>>>>>> main
			}
			if (event.dataTransfer.dropEffect == "move") {
				let id = event.dataTransfer.getData("frame id");
				// frameList[id].x = coords.x - frameList[id].x
				// frameList[id].y = coords.y - frameList[id].y
<<<<<<< HEAD
				// console.log(event.dataTransfer.getData('frame id'))
				// console.log(coords)
=======
				frameList[id].style = `left:${frameList[id].x}px; top:${frameList[id].y}px; background-image: url('${frameList[id].url}')`
				console.log(event.dataTransfer.getData('frame id'))
				console.log(coords)
>>>>>>> main
			}
		};
		
		const paste = (event) => {
			let image = event?.clipboardData?.items[0].getAsFile();
			let data = event?.clipboardData?.getData("text");
			if (image) {
				data = URL.createObjectURL(image);
				console.log(image);
				console.log(data);
			}
<<<<<<< HEAD
			console.log(event);
			console.log("paste");
			let newFrame = buildFrame(data);
			newFrame.x = 0;
			newFrame.y = 0;
			newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
			data ? (frameList = [...frameList, newFrame]) : null;
			console.log(frameList);
			console.log(newFrame.style);
		};
		
		function buildFrame(data): FrameT {
			let frame = {
				url: data,
				width: 400,
				height: 400,
				x: 0,
				y: 0,
				style: ``,
				id: id,
				topLeftHandle: defaultHandle,
				topRightHandle: { ...defaultHandle, x: 380 },
				bottomRightHandle: { ...defaultHandle, x: 380, y: 380 },
				bottomLeftHandle: { ...defaultHandle, y: 380 },
				top: true
			};
			
			id = id + 1;
			
			frameList = reorderLayers(frame.id)
			
			// console.log(frame);
			return frame;
		}
		
		let resizable: boolean = false;
		
		const setActive = () => {
			// console.log("well");
			resizable = true;
		};
		const setInactive = () => {
			// console.log("nevermind");
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
			// let width = (frame.topRightHandle.x + frame.topRightHandle.width) - frame.topLeftHandle.x
			// let height = (frame.bottomRightHandle.y + frame.bottomRightHandle.height) - frame.topLeftHandle.y
			
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
=======
			console.log(event)
			console.log('paste')
			let newFrame = buildFrame(data)
			newFrame.x = 0
			newFrame.y = 0
			newFrame.style=`left:${newFrame.x}px; top:${newFrame.y}px;`
			data ? frameList = [...frameList, newFrame] : null
			console.log(frameList)
			console.log(newFrame.style)
		}
		
		function buildFrame (data):FrameT {
			let frame =
			{ url: data
				, width: 500
				,	height: 500
				, x: 0
				, y: 0
				, style: ``
				, id: id
				, active: false
				, zindex: ''
>>>>>>> main
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
		
<<<<<<< HEAD
		const trackMouse = (event, frameId, edge):FrameT => {
			let frame = frameList[frameId]
			if (resizable) {
				// if (event.resize){
					coords.x = event.movementX;
					coords.y = event.movementY;
					// if (frameList[frameId]) {
						// console.log(frameId);
						frame.width += coords.x
						frame.height += coords.y
						frame.bottomRightHandle.x += coords.x
						frame.bottomRightHandle.y += coords.y
						// console.log(frame.width)
						// console.log(frameList[frameId].width)
						frame = moveHandles(frame)
						frame.style = calculateStyle(frame)
						// console.log(frame.style)
						// }
						// }
					}
					return frame
				};
				
				function reorderLayers (frameid):Array<FrameT> {
					let newList = frameList.map(frame => {
						if (frame.id == frameid) {
							frame = {...frame, top: true}
						} else {
							frame = {...frame, top: false}
						}
						return frame
					})
					return newList
				}
				
				function handleKeypress(event){
					switch (event.key) {
						case 'Delete':
						case 'Backspace':
							frameList = frameList.filter(frame => frame.top == false)
							break
						default:
							break
					}
					// console.log(event)
				}
			</script>
			
			<svelte:window
			on:keyup="{(event) => handleKeypress(event)}"
			/>
			<main
			>
			<!-- <h1>welcome to polyreference, {name}!</h1> -->
			<!-- <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> -->
			<!-- on:dragover|preventDefault={event => dragOver(event)} -->
			<!-- on:mousemove="{event => resize(event, frame, 'bright')}" -->
			<!-- on:message="{message => {
				currentFrame = message
				currentEdge = message
				currentEdge = currentEdge?.detail?.edge
				console.log(message)
				console.log('passthrough')
				// currentFrame = currentFrame?.detail?.frame.id
			}}" -->
			
			
			<div
			id="dropzone"
			
			on:mouseup="{event => setInactive()}"
			on:mousedown="{event => {
				setActive()
				// console.log(frameList)
			}}"
			on:dragover={(event) => {
				// console.log(event.movementX)
				// resize(event, currentFrame, currentEdge)
				return false;
			}}
			on:drop|preventDefault="{(event) => drop(event, coords)}"
			on:paste="{(event) => paste(event)}"
			on:mousemove="{(event) => {
				frameList[currentFrame] ? frameList[currentFrame] = trackMouse(event, currentFrame, currentEdge) : null
			}}"
			>
			
			
			{#if frameList.length !== 0}
			{#each frameList as frame}
			<!-- <div on:dragstart={event => offset = handleDragStart(event, frame.id)}> -->
				<!-- style={frame.style} -->
				<div
				on:click="{() => {frameList = reorderLayers(frame.id)}}"
				>
				<Frame
				addedClass={frame.top == true? 'zindexMax' : ''}
				on:click="{() => {frameList = reorderLayers(frame.id)}}"
				on:message={(message) => {
					currentFrame = message;
					// console.log("ayy");
					currentFrame = currentFrame?.detail?.frame.id;
					currentEdge = message;
					currentEdge = currentEdge?.detail?.edge;
					console.log(currentEdge);
				}}
				{frame}
				/>
			</div>
			{/each}
			{/if}
		</div>
	</main>
	
	<style>
=======
		let target:Array<HTMLDivElement>=[]
		let frameOptions = {
			translate:[0,0]
		}

		const makeActive = (frame:FrameT) => {
			frameList = frameList.map(el => {
				if (el.id == frame.id) {
					el.zindex = 'top'
				}
				else {
					el.zindex = ''
				}
				return el
			})
			
			active = {
				id: frame.id
			}
			return active
		}
	</script>
	
	<main>
		<!-- <h1>welcome to polyreference, {name}!</h1> -->
		<!-- <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> -->
		<div id='dropzone'
		on:drop|preventDefault={event => drop(event, coords)}
		on:paste={event => paste(event)}
		>
		<!-- on:mousemove={event => trackMouse(event)} -->
		{#if frameList.length !== 0}
		{#each frameList as frame}
		<div class='frame {frame.zindex}' on:click={e => {active = makeActive(frame)}} bind:this={target[frame.id]}>
			<!-- <div> -->
				<Frame frame={frame}></Frame>
		</div>
		{#if frame.id == active.id}
		<Moveable
		target={target[frame.id]}
    resizable={true}
		draggable={true}
    keepRatio={true}
    throttleResize={0}
    renderDirections={["nw","n","ne","w","e","sw","s","se"]}
    edge={false}
    zoom={1}
    origin={false}
    padding={{"left":0,"top":0,"right":0,"bottom":0}}
		on:dragStart={({ detail: e })=> {
			e.set(frameOptions.translate)
		}}
		on:drag={({ detail: e })=> {
			frameOptions.translate = e.beforeTranslate;
			e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
		}}
		on:resizeStart={({ detail: e }) => {
			e.setOrigin(["%", "%"]);
			e.dragStart && e.dragStart.set(frameOptions.translate);
		}}
		on:resize={({ detail: e }) => {
			const beforeTranslate = e.drag.beforeTranslate;
			
			frameOptions.translate = beforeTranslate;
			e.target.style.width = `${e.width}px`;
			e.target.style.height = `${e.height}px`;
			e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
		}}
		/>
		{/if}
		{/each}
		{/if}
	</div>
</main>

<style>
	main {
		text-align: center;
		/* padding: 1em; */
		max-width: 240px;
		margin: 0 auto;
	}

	.target {
		width: 500px;
    height: 500px;
	}
	
	#dropzone {
		width: 100%;
		height: 100%;
		position: absolute;
		/* z-index: -9; */
		/* border: thin solid cyan; */
		/* border-style: inset; */
		background-color: hsl(200,10%,10%);
	}
	
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.frame {
		height:20vh;
		width:20vw;
		position:absolute;
		top:0px;
		left:0px;
	}

	.top {
		z-index: 10;
		/* position: relative; */
	}
	
	@media (min-width: 640px) {
>>>>>>> main
		main {
			text-align: center;
			/* padding: 1em; */
			max-width: 240px;
			margin: 0 auto;
		}
		
		#dropzone {
			width: 100%;
			height: 100%;
			position: absolute;
			/* z-index: -9; */
			/* border: thin solid cyan; */
			/* border-style: inset; */
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
	