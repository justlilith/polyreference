<script lang='ts'>
  import Fab from '@smui/fab'
  export let frame:FrameT
  
  let styleConstant:string=` background-image: url('${frame.url}'`
  frame.style = frame.style + styleConstant
  const handleDrag = (event) => {
    // console.log(event)
    // frame.style = `position:fixed; left:${frame.x}px; top:${frame.y}px`
  }
  
  const handleDragStart = (event) => {
    event.dataTransfer.setData('frame id', frame.id)
    event.dataTransfer.dropEffect = 'move'
  }
  
  /*
https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
*/
</script>

<div
style={frame.style}
class='frame'
draggable='true'
on:drag={event => handleDrag(event)}
on:dragstart={event => handleDragStart(event)}>
<div class='resize-button-frame'>
<div class='handle-left'></div>
<div class='handle-right'></div>
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

  div {
    height: 200px;
    width: 200px;
    // display:block;
    background-size: contain;
  }

  .resize-button-frame {
    display:grid;
    grid-template-columns: 5% 90% 5%;
    grid-template-rows: 5% 90% 5%;
    grid-template-areas:
    'tleft top tright'
    'left . right'
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
  .resize-button {
    position:absolute;
    right:0px;
    bottom:0px;
    border: thin solid red;
    // z-index:10;
  }
  
</style>