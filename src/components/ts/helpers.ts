let defaultHandle = { width: 20, height: 20, x: 0, y: 0 }

function buildFrame(data:string, frameList:Array<FrameT>):FrameT {
  if (!data) {
    return
  }
  let id = frameList.length;
  
  let frame:FrameT = {
    url: data,
    width: 400,
    height: 400,
    x: 100,
    y: 100,
    style: ``,
    id: id,
    topLeftHandle: defaultHandle,
    topRightHandle: { ...defaultHandle, x: 380 },
    bottomRightHandle: { ...defaultHandle, x: 380, y: 380 },
    bottomLeftHandle: { ...defaultHandle, y: 380 },
    top: true,
    active: true
  };
  
  return frame;
}

function calculateStyle (frame:FrameT, corner?:string):string {
  let style:string = ""
  let addedStyle:string
  
  let width = frame.width
  let height = frame.height
  
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

function clearActiveFrame (frameList) {
  return frameList.map(frame => {
    return {...frame, active : false}
  })
}

function getActiveFrame (frameList:FrameT[]):FrameT {
  return frameList.filter(frame => frame.top == true)[0]
}

function handleKeypress(event, frameList?){
  // console.log(event)
  switch (event.key) {
    case 'Escape':
    frameList = clearActiveFrame(frameList)
    break
    case 'Delete':
    case 'Backspace':
    frameList = frameList.filter(frame => frame.top == false)
    break
    case 'ArrowLeft':
    frameList = moveActiveFrame(frameList,'left')
    break
    case 'ArrowRight':
    frameList = moveActiveFrame(frameList,'right')
    break
    case 'ArrowUp':
    frameList = moveActiveFrame(frameList,'up')
    break
    case 'ArrowDown':
    frameList = moveActiveFrame(frameList,'down')
    break
    default:
    break
  }
  if (frameList) {
    return frameList
  }
}

function moveActiveFrame(frameList,direction){
  let CONSTANT = 40
  let active = getActiveFrame(frameList)
  switch (direction) {
    case 'left':
    frameList[active.id].x = (frameList[active.id].x - CONSTANT) - (frameList[active.id].x % CONSTANT)
    console.log(frameList[active.id].x)
    break
    case 'right':
    frameList[active.id].x = (frameList[active.id].x + CONSTANT) - (frameList[active.id].x % CONSTANT)
    break
    case 'up':
    frameList[active.id].y = (frameList[active.id].y - CONSTANT) - (frameList[active.id].y % CONSTANT)
    break
    case 'down':
    frameList[active.id].y = (frameList[active.id].y + CONSTANT) - (frameList[active.id].y % CONSTANT)
    break
    default:
    break
  }
  
  moveHandles(active)
  frameList[active.id].style = calculateStyle(active)
  // console.log(active)
  return frameList
}

function moveHandles(frame: FrameT): FrameT {
  frame.topLeftHandle.x = frame.x;
  frame.topLeftHandle.y = frame.y;
  frame.topRightHandle.x = frame.x + frame.width - frame.topRightHandle.width;
  frame.topRightHandle.y = frame.y;
  frame.bottomLeftHandle.x = frame.x;
  frame.bottomLeftHandle.y = frame.y + frame.height - frame.bottomLeftHandle.height;
  frame.bottomRightHandle.x = frame.x + frame.width - frame.bottomRightHandle.width;
  frame.bottomRightHandle.y = frame.y + frame.height - frame.bottomRightHandle.height;
  
  return frame;
}

function purgeFrames (frameList) {
  return frameList.filter(frame => {
    return frame !== null || frame !== undefined
  })
}

function reorderLayers (frameid,frameList:FrameT[]):Array<FrameT> {
  let newList = frameList.map(frame => {
    if (frame.id == frameid) {
      frame = {...frame, top: true, active: true}
    } else {
      frame = {...frame, top: false, active: false}
    }
    return frame
  })
  return newList
}

export { buildFrame
  , calculateStyle
  , clearActiveFrame
  , getActiveFrame
  , handleKeypress
  , moveActiveFrame
  , moveHandles
  , purgeFrames
  , reorderLayers
}