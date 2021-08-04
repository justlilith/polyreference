<script lang='ts'>
  import Fab from '@smui/fab'
  export let frame:FrameT
  
  let coords = { x:0, y:0}
  let offset = [0,0]
  let topCorner = [0,0]
  
  let styleConstant:string = ` background-image: url('${frame.url}');`
  let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
  // frame.style = frame.style + styleConstant + dimensionalConstant
  frame.style = frame.style + styleConstant
  
  const handleDragStartMove = (event) => {
    event.dataTransfer.setData('frame id', frame.id)
    event.dataTransfer.dropEffect = 'move'
    coords.x = event.clientX
    coords.y = event.clientY
    topCorner = [frame.x, frame.y] //top left
    offset = [coords.x - topCorner[0], coords.y - topCorner[1]]
    console.log(coords, frame.x, frame.y, offset, topCorner)
    return offset
  }
  
  const handleDragMove = (event) => {
    let id = event.dataTransfer.getData('frame id')
    coords.x = event.pageX
    coords.y = event.pageY
    console.log(coords, [event.clientX, event.clientY, event.pageX, event.pageY], frame.x, frame.y, offset)
    topCorner = [frame.x, frame.y] //top left
    // frame.x = coords.x - offset[0]
    // frame.y = coords.y - offset[1]
    frame.x = event.clientX - offset[0]
    frame.y = event.clientY - offset[1]
    console.log(coords, frame.x, frame.y, offset)
    frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant
    console.log(id)
    console.log(frame.style)
    return false
  }
  
  const handleDragStartResize = (event, edge) => {
    event.dataTransfer.setData('frame id', frame.id)
    event.dataTransfer.dropEffect = 'move'
    coords.x = event.clientX
    coords.y = event.clientY
    topCorner = [frame.x, frame.y]
    offset = [coords.x - frame.x, coords.y - frame.y]
    return offset // shouldn't change on drag
  }
  
  const handleDragResize = (event, edge) => {
    coords.x = event.clientX
    coords.y = event.clientY
    let id = event.dataTransfer.getData('frame id')
    let corner = {x: frame.x, y: frame.y} //top left
    console.log(edge)
    console.log(coords)
    switch (edge){
      case 'bright':
      frame.width = coords.x - corner.x
      frame.height = coords.y - corner.y
      let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
      frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant
      console.log(frame.width, frame.height)
      default:
        return
      }
    }
    const handleDragResizeDrop = (event) => {
      let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
      frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant
      console.log(frame.style)
      
    }
    /*
  https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
  */
</script>

<div
style={frame.style}
class='frame'
>
<div class='resize-handles-frame'>
  <div class='handle-left'
  draggable='true'
  on:dragstart={event => offset = handleDragStartResize(event, 'right')}
  ></div>
  <!-- on:dragover={event => event.preventDefault()} -->
  <div class='center'
  draggable='true'
  on:dragstart={event => offset = handleDragStartMove(event)}
  on:dragover|preventDefault={event => handleDragMove(event)}>
</div>
<div class='handle-right' draggable='true'
on:dragstart={event => offset = handleDragStartResize(event, 'right')}
></div>
<div class='handle-bright' draggable='true'
on:dragstart={event => offset = handleDragStartResize(event, 'bright')}
  on:dragover|preventDefault={event => handleDragResize(event, 'bright')}
  on:drop|preventDefault={event => handleDragResizeDrop(event)}
  ></div>
<!-- <div class='resize-button'> -->
  <!-- <Fab>Resize</Fab> -->
  <!-- </div> -->
  <!-- <img alt='reference' src={frame.url} > -->
</div>
</div>

<style lang='scss'>
  @mixin wh100 {
    width:100%;
    height:100%;
  }
  
  .frame {
    height:400px;
    width:400px;
    // display:block;
    background-size: contain;
    background-repeat: no-repeat;
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
  
  .center {
    @include wh100;
    grid-area:center;
  }
  .handle-left {
    grid-area: left;
    background-color: deepskyblue;
    @include wh100
  }
  .handle-right {
    grid-area: right;
    background-color: deeppink;
    @include wh100
  }
  .handle-bright {
    grid-area: bright;
    background-color: silver;
    @include wh100
  }  
</style>