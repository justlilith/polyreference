<script lang='ts'>
  import { createEventDispatcher } from 'svelte'

	import { autosave, loadFromLocal } from '$lib/ts/autosave'
  import * as Helpers from '$lib/ts/helpers'
  
  export let frame:FrameT
  export let frameList:FrameT[]
  
  export let addedClass = ''
  
  let coords = { x:0, y:0}
  let offset = [0,0]
  let topCorner = [0,0]
  
  let resizable:boolean = false
  
  let styleConstant:string = ` background-image: url('${frame?.url}');`
  let dimensionalConstant:string = ` width: ${frame?.width}px; height: ${frame?.height}px;`
  frame.style = frame?.style + styleConstant
  
  const handleDragStartMove = (event) => {
    event.dataTransfer.setData('frame id', frame.id)
    event.dataTransfer.dropEffect = 'move'
    coords.x = event.clientX
    coords.y = event.clientY
    topCorner = [frame.x, frame.y] //top left
    offset = [coords.x - topCorner[0], coords.y - topCorner[1]]
    return offset
  }
  
  const handleDragMove = (event) => {
    let id = event.dataTransfer.getData('frame id')
    coords.x = event.pageX
    coords.y = event.pageY
    topCorner = [frame.x, frame.y] //top left
    frame.x = event.clientX - offset[0]
    frame.y = event.clientY - offset[1]
    frame.style = `width: ${frame.width}px; height: ${frame.height}px; position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant
    frame = Helpers.moveHandles(frame)
    return false
  }
  
  const handleDragStartResize = (event, edge):number[] => {
    event.dataTransfer.setData('frame id', frame.id)
    // event.dataTransfer.dropEffect = 'move'
    coords.x = event.clientX
    coords.y = event.clientY
    topCorner = [frame.x, frame.y]
    offset = [coords.x - frame.x, coords.y - frame.y]
    return offset // shouldn't change on drag
  }
  
  const handleDragResize = (event, edge) => {
    event = event || window.event
    console.log(event)
    coords.x = event.movementX
    coords.y = event.movementY
    switch (edge){
      case 'bright':
      frame.width = frame.width + coords.x
      frame.height = frame.height + coords.y
      console.log(frame.width, frame.height)
      break
      default:
      return
    }
    frame = Helpers.moveHandles(frame)
  }
  
  const handleDragResizeDrop = (event) => {
    let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
    frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant
  }
  
  const dispatch = createEventDispatcher()
  
  function forward(frame,event,edge){
    console.log('send')
    dispatch('message', {
      frame: frame
      , event: event
      , edge: edge
    })
  }
  
  const setActive = () => {
    console.log('well')
    resizable = true
  }
  const setInactive = () => {
    console.log('nevermind')
    resizable = false
  }
  
</script>



<div class={`frame ${addedClass}`}
draggable='true'
style={frame?.style}
on:dragover="{event => handleDragMove(event)}"
on:dragstart="{event => {
  offset = handleDragStartMove(event)
}}"
on:dragend="{event => autosave(frameList)}"
>
</div>

{#if frame.active}

<div class={`${addedClass} handle handle-tleft`} draggable='true'
style={Helpers.calculateStyle(frame, 'tleft')}
on:dragstart={event => offset = handleDragStartResize(event, 'left')}

>
<button 
on:click="{event => {
  frameList = frameList.filter(frame => frame.top == false)
}}">Delete</button>
</div>

<div class={`${addedClass} handle handle-tright`} draggable='true'
style={Helpers.calculateStyle(frame, 'tright')}
on:dragstart={event => offset = handleDragStartResize(event, 'right')}
></div>

<div class={`${addedClass} handle handle-bleft`} draggable='true'
style={Helpers.calculateStyle(frame, 'bleft')}
on:dragstart={event => offset = handleDragStartResize(event, 'bleft')}
on:dragover|preventDefault={event => handleDragResize(event, 'bleft')}
></div>

<div
class={`${addedClass} handle handle-bright`}
style={Helpers.calculateStyle(frame, 'bright')}
on:pointerdown="{event => {
  forward(frame,event,'bright')
}}"
>
Resize
</div>
{/if}



<style lang='scss'>
  @mixin wh100 {
    width:100%;
    height:100%;
  }
  
  @mixin wh50 {
    width:20px;
    height:20px;
  }
  
  @mixin handle {
    // z-index: 10;
    position: fixed;
    // margin:50px;
    // border:60px solid hsla(0,0%,0%,0.0);
    // box-sizing:border-box;
    border: thick solid cyan;
  }
  
  .frame {
    height:400px;
    height:fit-content;
    width:400px;
    width:fit-content;
    // display:block;
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  .zindexMax {
    // border: thin solid cyan;
    z-index: 10;
    position: relative;
  }
  
  .active {
    border: thin solid cyan;
  }
  
  .active.handle {
    z-index: 15;
    position: relative;
  }
  
  .resize-handles-frame {
    @include wh100;
    display:grid;
    grid-template-columns: 5% 90% 5%;
    grid-template-rows: 5% 90% 5%;
    grid-template-areas:
    'tleft top tright'
    'left center right'
    'bleft bottom bright';
    // width:100%;
    // height:100%;
    border: thin solid cyan
  }
  
  .handle-tleft {
    @include handle;
    // grid-area: left;
    @include wh50;
    border-bottom:none;
    border-right:none;
  }
  .handle-tleft button {
    border:none;
    font-size:100%;
    font-family: inherit;
    text-transform: none;
    color:red;
    background:none;
  }
  
  .handle-tright {
    @include handle;
    // grid-area: right;
    @include wh50;
    border-bottom:none;
    border-left:none;
    border:none;
  }
  .handle-bright {
    @include handle;
    @include wh50;
    // grid-area: bright;
    // background-color: silver;
    border-left: none;
    border-top: none;
    text-align: right;
    color:red;
    overflow: visible;
    display:flex;
    align-items: flex-end;
    flex-direction: column;
  }  
  .handle-bleft {
    @include handle;
    @include wh50;
    // grid-area: bright;
    border-top:none;
    border-right:none;
    border:none;
  }

  // a {
	// 	color:red;
	// 	text-decoration: none;
	// }

</style>