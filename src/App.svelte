<script lang="ts">
	export let name: string;

	let frameList:Array<FrameT> = []

	const drag = (event) => {
		let data = event.dataTransfer.getData('text')
		console.log(data)
		return false
	}
	const drop = (event) => {
		let data = event.dataTransfer.getData('URL')
		console.log(event)
		console.log('drop')
		data ? frameList.push(buildFrame(data)) : null
		console.log(frameList)
	}

	const paste = (event) => {
		let data = event.clipboardData.dataTransfer
		console.log(event)
		console.log('paste')
		data ? frameList.push(data) : null
		console.log(frameList)
	}

	const buildFrame = (data) => {
		let frame =
		{ url: data
		, width: 100
		,	height: 100
		, x: 0
		, y: 0
	}
	return frame
	}
</script>

<main>
	<h1>welcome to polyreference, {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<div id='dropzone'
	on:dragover|preventDefault={event => drag(event)}
	on:drop|preventDefault={event => drop(event)}
	on:paste={event => paste(event)}
	>
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
		width:100%;
		height:100%;
		position:absolute;
		border:thin solid cyan;
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