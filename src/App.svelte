<script lang="ts">
	import Frame from "./components/Frame.svelte";
	import { createEventDispatcher } from "svelte";
	import { autosave, loadFromLocal } from './components/ts/autosave'
	
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
		},4000)
		
		
		const handleDragStart = (event, frameid) => {
			// console.log(frameid)
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
				data ? (frameList = [...frameList, newFrame]) : null;
				// console.log(frameList)
				// console.log(newFrame.style)
			}
			if (event.dataTransfer.dropEffect == "move") {
				let id = event.dataTransfer.getData("frame id");
				// frameList[id].x = coords.x - frameList[id].x
				// frameList[id].y = coords.y - frameList[id].y
				// console.log(event.dataTransfer.getData('frame id'))
				// console.log(coords)
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
	