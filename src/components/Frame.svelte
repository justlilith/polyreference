<script lang='ts'>
  export let frame:FrameT
  
  let style:string=""
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
  <img alt='reference' src={frame.url} >
</div>

<style lang='scss'>
  div {
    height: 100px;
    width: 100px;
    display:block;
  }
  
</style>