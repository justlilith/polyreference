<script lang="ts">
	import Frame from './components/Frame.svelte'
	export let name: string;

	let frameList:Array<FrameT> = []

		let coords = { x:0, y:0}

	const drag = (event) => {
		coords.x = event.clientX
    coords.y = event.clientY
		// console.log(coords)
		return false
	}


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
			newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px`
			data ? frameList = [...frameList, newFrame] : null
			console.log(frameList)
			console.log(newFrame.style)
		}
		if (event.dataTransfer.dropEffect == 'move') {
			let id = event.dataTransfer.getData('frame id')
			frameList[id].style = `position:fixed; left:${coords.x}px; top:${coords.y}px`
			console.log(event.dataTransfer.getData('frame id'))
			console.log(coords)
		}
	}

	const paste = (event) => {
			let data = event.clipboardData.getData('text')
			console.log(event)
			console.log('paste')
			let newFrame = buildFrame(data)
			newFrame.x = 0
			newFrame.y = 0
			newFrame.style=`position:fixed; left:${newFrame.x}px; top:${newFrame.y}px`
			data ? frameList = [...frameList, newFrame] : null
			console.log(frameList)
			console.log(newFrame.style)
	}

	let id = 0
	const buildFrame = (data):FrameT => {
		let frame =
		{ url: data
		, width: 100
		,	height: 100
		, x: 0
		, y: 0
		, style: ''
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
		<Frame frame={frame}></Frame>
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