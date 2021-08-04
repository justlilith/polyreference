<script lang='ts'>
  import Fab from '@smui/fab'
  export let frame:FrameT
  
  let coords = { x:0, y:0}
  let offset = []
  
  let styleConstant:string = ` background-image: url('${frame.url}');`
  let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
  // frame.style = frame.style + styleConstant + dimensionalConstant
  frame.style = frame.style + styleConstant
  
  const handleDragMove = (event) => {
    let id = event.dataTransfer.getData('frame id')
    // frameList[id].x = coords.x - frameList[id].x
    // frameList[id].y = coords.y - frameList[id].y
    frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;`
    console.log(event.dataTransfer.getData('frame id'))
    console.log(coords)
  }
  
  const handleDragStartMove = (event) => {
    event.dataTransfer.setData('frame id', frame.id)
    event.dataTransfer.dropEffect = 'move'
    coords.x = event.clientX
    coords.y = event.clientY
    offset = [coords.x - frame.x, coords.y - frame.y]
    return offset
  }
  
  const handleDragStartResize = (event, edge) => {
    event.dataTransfer.setData('frame id', frame.id)
    event.dataTransfer.dropEffect = 'move'
    coords.x = event.clientX
    coords.y = event.clientY
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
      frame.style = styleConstant + dimensionalConstant
      console.log(frame.style)
      console.log(frame.width, frame.height)
      default:
      return
    }
  }
  /*
  https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
  */
</script>

<div
style={frame.style}
class='frame'>
</div>

<style lang='scss'>
  @mixin wh100 {
    width:100%;
    height:100%;
  }
  
  div {
    @include wh100;
    // display:block;
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  .resize-button-frame {
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
  .resize-button {
    position:absolute;
    right:0px;
    bottom:0px;
    border: thin solid red;
    // z-index:10;
  }
  
</style>