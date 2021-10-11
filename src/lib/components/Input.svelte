<script lang='ts'>
	import { buildFrame, reorderLayers } from '$lib/ts/helpers'
	import * as State from '$lib/ts/state'
	import type { User } from '@supabase/gotrue-js';
	
	export let frameList:FrameT[]
	export let userData:User
	
	let inputContent:string = ''
	
	const keypressCheck = async (event) => {
		// console.log(event)
		if (event.key.toLowerCase() == 'enter') {
			let newFrame = await buildFrame({userData, url: inputContent, frameList})
			frameList = [...frameList, newFrame]
			frameList = reorderLayers(newFrame.id, frameList)
			State.append(frameList)
			inputContent = ''
		}
		
	}
</script>

<section id='inputArea' on:click|preventDefault>
	<input id='textInput'
	placeholder="Enter image URL"
	aria-placeholder="Enter image URL"
	bind:value={inputContent}
	on:keypress='{keypressCheck.bind(inputContent)}'>
	<div id='submit'>
		<button
		on:mousedown={(event)=> {
			event.preventDefault()
			keypressCheck({key: 'enter'})
		}}
		>
		<span class="material-icons">add</span>
		<span class="button-text">Add Image</span>
	</button>
</div>
</section>

<style lang='scss'>
	#inputArea {
		background-color: black;
		padding:1em;
		// width: 100%;
		// height: 2em;
		// background-color: theme.$primary;
		display:grid;
		// grid-template-columns: repeat(30px);
		grid-template-rows: auto;
		grid-template-columns: repeat(12, 1fr);
		grid-gap:1em;
		// grid-auto-columns: min-content;
		z-index: 100;
		position:absolute;
		top:0;
	}
	#textInput {
		grid-column: 1 / span 6;
		background:black;
		color:White;
		border: thin solid cyan;
	}
	#submit {
		// background-color: #fff;
		min-width:200px;
		color:purple;
		grid-column: 7;
		border:none;
		text-decoration: none;
		width:100%;
	}
	button {
		vertical-align: middle;
		text-transform: uppercase;
	}
	.button-text {
		vertical-align: middle;
	}
	
	:global(.mdc-button--outlined:not(:disabled)) {
		color:cyan;
	}
</style>