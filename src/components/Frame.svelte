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
    // console.log(coords, frame.x, frame.y, offset, topCorner)
    return offset
  }
  
  const handleDragMove = (event) => {
    console.log('dragging')
    // console.log(event.target)
    let id = event.dataTransfer.getData('frame id')
    coords.x = event.pageX
    coords.y = event.pageY
    // console.log(coords, [event.clientX, event.clientY, event.pageX, event.pageY], frame.x, frame.y, offset)
    topCorner = [frame.x, frame.y] //top left
    // frame.x = coords.x - offset[0]
    // frame.y = coords.y - offset[1]
    frame.x = event.clientX - offset[0]
    frame.y = event.clientY - offset[1]
    // console.log(coords, frame.x, frame.y, offset)
    frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant
    // console.log(id)
    // console.log(frame.style)
    moveHandles(frame)
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
    // console.log(event)
    coords.x = event.offsetX
    coords.y = event.offsetY
    // let id = event.dataTransfer.getData('frame id')
    // let corner = {x: frame.x, y: frame.y} //top left
    // console.log(edge)
    // console.log(coords)
    switch (edge){
      case 'bright':
      frame.width = coords.x > 0 ? coords.x + frame.width : frame.width - coords.x
      frame.height = coords.y + frame.height
      // frame.width += event.offsetX
      // let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
      // frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant
      // console.log(frame.width, frame.height)
      break
      default:
      return
    }
    frame.style = calculateStyle(frame)
    frame = moveHandles(frame)
  }
  
  const handleDragResizeDrop = (event) => {
    let dimensionalConstant:string = ` width: ${frame.width}px; height: ${frame.height}px;`
    frame.style = `position: fixed; left: ${frame.x}px; top: ${frame.y}px;` + styleConstant + dimensionalConstant
    // console.log(frame.style)
    
  }
  
  const calculateStyle = (frame:FrameT, corner?:string):string => {
    let style:string = ""
    let addedStyle:string
    let width = (frame.topRightHandle.x + frame.topRightHandle.width) - frame.topLeftHandle.x
    let height = (frame.bottomLeftHandle.y + frame.bottomLeftHandle.height) - frame.topLeftHandle.y
    
    if (corner) {
      switch (corner) {
        case 'tleft':
        width = frame.topLeftHandle.width
        height = frame.topLeftHandle.height
        addedStyle = ` top: ${frame.topLeftHandle.y}px; left: ${frame.topLeftHandle.x}px;`
        break
        case 'tright':
        width = frame.topRightHandle.width
        height = frame.topRightHandle.height
        addedStyle = ` top: ${frame.topRightHandle.y}px; left: ${frame.topRightHandle.x}px;`
        break
        case 'bleft':
        width = frame.bottomLeftHandle.width
        height = frame.bottomLeftHandle.height
        addedStyle = ` top: ${frame.bottomLeftHandle.y}px; left: ${frame.bottomLeftHandle.x}px;`
        break
        case 'bright':
        width = frame.bottomRightHandle.width
        height = frame.bottomRightHandle.height
        addedStyle = ` top: ${frame.bottomRightHandle.y}px; left: ${frame.bottomRightHandle.x}px;`
        break
        default:
        return
      }
    }
    
    style = `width: ${width}px; height: ${height}px; position: fixed;`
    
    if (!corner) {
      style = style + ` background-image: url('${frame.url}'); top: ${frame.y}px; left: ${frame.x}px;` 
    }
    if (corner) {
      style = style + addedStyle
    }
    return style
  }
  
  function moveHandles (frame:FrameT):FrameT {
    frame.topLeftHandle.x = frame.x
    frame.topLeftHandle.y = frame.y
    frame.topRightHandle.x = frame.x + frame.width - frame.topRightHandle.width
    frame.topRightHandle.y = frame.y
    frame.bottomLeftHandle.x = frame.x
    frame.bottomLeftHandle.y = frame.y + frame.height - frame.bottomLeftHandle.height
    frame.bottomRightHandle.x = frame.x + frame.width - frame.bottomRightHandle.width
    frame.bottomRightHandle.y = frame.y + frame.height - frame.bottomRightHandle.height
    
    return frame
  }
  /*
  https://i.pinimg.com/originals/10/d1/d3/10d1d39769c54e69a11c409038dc1adc.jpg
  */
</script>

<!-- <div style={frame.style} class='frame'>
</div> -->

<div  class='frame'
style={calculateStyle(frame)}
draggable='true'
on:dragstart|self={event => {
  // console.log('dragging frame')
  offset = handleDragStartMove(event)
}}
>
</div>
<!-- on:dragover|preventDefault|self={event => handleDragMove(event)} -->

<div class='handle handle-tleft' draggable='true'
style={calculateStyle(frame, 'tleft')}
on:dragstart={event => offset = handleDragStartResize(event, 'left')}
></div>

<div class='handle handle-tright' draggable='true'
style={calculateStyle(frame, 'tright')}
on:dragstart={event => offset = handleDragStartResize(event, 'right')}
></div>
<!-- on:dragover={event => event.preventDefault()} -->

<div class='handle handle-bleft' draggable='true'
style={calculateStyle(frame, 'bleft')}
on:dragstart={event => offset = handleDragStartResize(event, 'bleft')}
on:dragover|preventDefault={event => handleDragResize(event, 'bleft')}
></div>

<div class='handle handle-bright' draggable='true'
style={calculateStyle(frame, 'bright')}
on:dragstart={event => offset = handleDragStartResize(event, 'bright')}
on:dragover={event => handleDragResize(event, 'bright')}
on:dragleave|preventDefault={event => handleDragResize(event, 'bright')}
></div>
<!-- on:drop|preventDefault|stopPropagation={event => handleDragResizeDrop(event)} -->

<!-- <div class='resize-button'> -->
  <!-- <Fab>Resize</Fab> -->
  <!-- </div> -->
  <!-- <img alt='reference' src={frame.url} > -->
  
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
      // position: absolute;
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
    
    .handle-tleft {
      @include handle;
      // grid-area: left;
      background-color: deepskyblue;
      @include wh50;
    }
    .handle-tright {
      @include handle;
      // grid-area: right;
      background-color: deeppink;
      @include wh50;
    }
    .handle-bright {
      @include handle;
      @include wh50;
      // grid-area: bright;
      background-color: silver;
    }  
    .handle-bleft {
      @include handle;
      @include wh50;
      // grid-area: bright;
      background-color: silver;
    }  
  </style>