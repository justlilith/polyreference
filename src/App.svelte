<script lang="ts">
	import Moveable from 'svelte-moveable'
	import Frame from './components/Frame.svelte'
	export let name: string;
	
	let frameList:Array<FrameT> = []
		
		let id = 0
		let coords = { x:0, y:0}
		let offset = []
		let currentFrame
		
		let init = buildFrame('https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg')
		
		frameList.push(init)
		
		const handleDragStart = (event, frameid) => {
			console.log(frameid)
			event.dataTransfer.setData('frame id', frameid)
			event.dataTransfer.dropEffect = 'move'
			coords.x = event.clientX
			coords.y = event.clientY
			offset = [coords.x - frameList[frameid].x, coords.y - frameList[frameid].y]
			return offset // shouldn't change on drag
		}
		
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
		/*
		https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
		+ [0,0]
		
		+ [4,3]
		x [6,4] -> [2,1] ([0,0])
		+ [3,3]
		
		+ [7,6]
		x [9,5] -> [2,1] ([0,0])
		*/
		
		const trackMouse = (event) => {
			coords.x = event.clientX
			coords.y = event.clientY
		}
		
		const drop = (event, coords) => {
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
			}
			if (event.dataTransfer.dropEffect == 'move') {
				let id = event.dataTransfer.getData('frame id')
				// frameList[id].x = coords.x - frameList[id].x
				// frameList[id].y = coords.y - frameList[id].y
				frameList[id].style = `left:${frameList[id].x}px; top:${frameList[id].y}px; background-image: url('${frameList[id].url}')`
				console.log(event.dataTransfer.getData('frame id'))
				console.log(coords)
			}
		}
		
		const paste = (event) => {
			let image = event?.clipboardData?.items[0].getAsFile()
			let data = event?.clipboardData?.getData('text')
			if (image) {
				data = URL.createObjectURL(image)
				console.log(image)
				console.log(data)
			}
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
			}
			
			id = id + 1
			
			console.log(frame)
			return frame
		}
		
		let target:Array<HTMLDivElement>=[]
		let frameOptions = {
			translate:[0,0]
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
		<div class='target' bind:this={target[frame.id]}>
			<!-- <div> -->
				<Frame frame={frame}></Frame>
		</div>
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
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>