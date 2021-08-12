<script lang='ts'>
	import Button, { Label } from '@smui/button'
	import { Icon } from '@smui/common'
  import { buildFrame, reorderLayers } from './ts/helpers'
  
  export let frameList:FrameT[]

  let inputContent:string = ''
  
  const keypressCheck = (event) => {
    // console.log(event)
    if (event.key.toLowerCase() == 'enter') {
      let newFrame = buildFrame(inputContent, frameList)
      frameList = [...frameList, newFrame]
			frameList = reorderLayers(newFrame.id, frameList)
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
		<Button variant='outlined'
		on:mousedown={(event)=> {
			event.preventDefault()
			keypressCheck({key: 'enter'})
			}}
		b>
			<Icon class="material-icons">add</Icon>
			<Label>Add Image</Label>
		</Button>
	</div>
</section>

<style lang='scss'>
  #inputArea {
		background-color: black;
		padding:1em;
		width: 100%;
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
</style>