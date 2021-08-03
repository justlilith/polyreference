<script lang="ts">
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
		
		const drag = (event) => {
			coords.x = event.clientX
			coords.y = event.clientY
			let id = event.dataTransfer.getData('frame id')
			let corner = [frameList[id].x, frameList[id].y] //top left
			frameList[id].x = coords.x - offset[0]
			frameList[id].y = coords.y - offset[1]
			frameList[id].style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px; background-image: url('${frameList[id].url}')`
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
				newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px; background-image: url('${data}')`
				data ? frameList = [...frameList, newFrame] : null
				console.log(frameList)
				console.log(newFrame.style)
			}
			if (event.dataTransfer.dropEffect == 'move') {
				let id = event.dataTransfer.getData('frame id')
				// frameList[id].x = coords.x - frameList[id].x
				// frameList[id].y = coords.y - frameList[id].y
				frameList[id].style = `position:fixed; left:${frameList[id].x}px; top:${frameList[id].y}px; background-image: url('${frameList[id].url}')`
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
			newFrame.style=`position:fixed; left:${newFrame.x}px; top:${newFrame.y}px; background-image: url('${newFrame.url}')`
			data ? frameList = [...frameList, newFrame] : null
			console.log(frameList)
			console.log(newFrame.style)
		}
		
		function buildFrame (data):FrameT {
			let frame =
			{ url: data
				, width: 100
				,	height: 100
				, x: 0
				, y: 0
				, style: ``
				, id: id
			}
			
			id = id + 1
			
			console.log(frame)
			return frame
		}
	</script>
	
	<main>
		<!-- <h1>welcome to polyreference, {name}!</h1> -->
		<!-- <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> -->
		<div id='dropzone'
		on:dragover|preventDefault={event => drag(event)}
		on:drop|preventDefault={event => drop(event, coords)}
		on:paste={event => paste(event)}
		>
		<!-- on:mousemove={event => trackMouse(event)} -->
		{#if frameList.length !== 0}
		{#each frameList as frame}
		<div on:dragstart={event => offset = handleDragStart(event, frame.id)}>
			<Frame frame={frame}></Frame>

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
		background-color: darkslategray;
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