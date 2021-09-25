import { autosave } from "./autosave";
import * as State from "./state";

const defaultHandle = { width: 20, height: 20, x: 0, y: 0 }


function buildFrame(data:string, frameList:Array<FrameT>):Promise<FrameT> {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject()
    }
    const id = frameList.length;
    
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
      active: true,
      aspect: 0,
      offset: [0,0]
    };
    
    const newImage = new Image()
    newImage.src = frame.url
    newImage.onload = () => {
      console.log(newImage.naturalHeight, newImage.naturalWidth)
      frame.height = newImage.naturalHeight
      frame.width = newImage.naturalWidth
      frame.aspect = frame.width / frame.height // 2:1 wideboi
      frame = fitToScreen(frame)
      frame.style = calculateStyle(frame)
      moveHandles(frame)
      resolve(frame)
    }
    
    // return frame;
  })
}


function calculateStyle (frame:FrameT, corner?:string):string {
  let style = ""
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


function clearActiveFrame (frameList:FrameT[]):FrameT[] {
  return frameList.map(frame => {
    return {...frame, active : false}
  })
}


function deepCopy (array:Array<FrameT> & unknown):Array<FrameT> & unknown {
  return JSON.parse(JSON.stringify(array))
}


function fitToScreen(frame:FrameT):FrameT{
  const aspect = frame.width / frame.height // 20/10 == 2:1 == 2
  let newWidth = window.visualViewport.width / 2 //e.g. 450
  let newHeight = window.visualViewport.width / 2 //e.g 225
  frame.width > frame.height //wideboi
  ? newHeight = newWidth / aspect //e.g 225
  : newWidth = newHeight * aspect //longboi (1/2 = .5, )
  console.log(newWidth, newHeight, aspect)
  return {...frame, width: newWidth, height: newHeight}
}


function getActiveFrame (frameList:FrameT[]):FrameT {
  return frameList.filter(frame => frame.top == true)[0]
}


function handleKeypress(event:KeyboardEvent, frameList:FrameT[]):FrameT[]{
  // console.log(event)
  switch (event.key) {
    case 'a':
    if (event.ctrlKey){
      frameList = selectAllFrames(frameList)
      State.append(frameList)
      autosave(frameList)
    }
    break
    case 'A':
    if (event.ctrlKey){
      frameList = clearActiveFrame(frameList)
      State.append(frameList)
      autosave(frameList)
    }
    break
    case 'y':
    if (event.ctrlKey){
      State.advance()
    }
    break
    case 'z':
    if (event.ctrlKey){
      State.reverse()
    }
    break
    case 'Z':
    if (event.ctrlKey) {
      console.log('yay~')
      State.advance()
    }
    break
    case 'Escape':
    frameList = clearActiveFrame(frameList)
    State.append(frameList)
    autosave(frameList)
    break
    case 'Delete':
    case 'Backspace':
    frameList = frameList.filter(frame => frame.active == false)
    State.append(frameList)
    autosave(frameList)
    break
    case 'ArrowLeft':
    frameList = moveActiveFrame(frameList,'left')
    State.append(frameList)
    autosave(frameList)
    break
    case 'ArrowRight':
    frameList = moveActiveFrame(frameList,'right')
    State.append(frameList)
    autosave(frameList)
    break
    case 'ArrowUp':
    frameList = moveActiveFrame(frameList,'up')
    State.append(frameList)
    autosave(frameList)
    break
    case 'ArrowDown':
    frameList = moveActiveFrame(frameList,'down')
    State.append(frameList)
    autosave(frameList)
    break
    default:
    break
  }
  if (frameList) {
    return frameList
  }
}

function moveActiveFrame(frameList:FrameT[],direction:string):FrameT[]{
  const CONSTANT = 40
  const active = getActiveFrame(frameList)
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


function moveFrame (event:PointerEvent | TouchEvent, frame:FrameT, offset:number[]):FrameT {
  if ((event as PointerEvent)?.pointerType === 'mouse') {
    const coords = {x:0, y:0}
    coords.x = (event as PointerEvent).movementX;
    coords.y = (event as PointerEvent).movementY;
    frame.x += coords.x
    frame.y += coords.y
  } else {
    // console.log(event)
    frame.x = (event as TouchEvent).changedTouches[0].clientX - offset[0]
    frame.y = (event as TouchEvent).changedTouches[0].clientY - offset[1]
		// console.log(event.changedTouches[0].clientX)
    // console.log(event.targetTouches[0].clientX + offset[0])
    console.log(offset[0])
    // console.log(frame.x)
  }
  frame = moveHandles(frame)
  frame.style = calculateStyle(frame)
  // console.log(frame)
  return frame
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

function purgeFrames (frameList:FrameT[]):FrameT[] {
  return frameList.filter(frame => {
    return frame !== null || frame !== undefined
  })
}

function reorderLayers (frameid:number,frameList:FrameT[]):Array<FrameT> {
  const newList = frameList.map(frame => {
    if (frame.id == frameid) {
      frame = {...frame, top: true, active: true}
    } else {
      frame = {...frame, top: false, active: false}
    }
    return frame
  })
  return newList
}


function selectAllFrames(frameList:FrameT[]):FrameT[] {
  return frameList.map(frame => {
    return {...frame, active: true}
  })
}


// hey this needs to map over the filterlist instead of using css transforms

function touchZoomHandler (frameList:FrameT[], event:TouchEvent, startingScale:number):FrameT[] {
  event.preventDefault()
  const transOptions:TransT =
  { transfomScale: 1.0
    , center: [200,200]
  }
  
  const pointer1 = event.targetTouches[0]
  const pointer2 = event.targetTouches[1]
  
  // const leftOffset = Math.abs(pointer1.clientX + pointer2.clientX)
  // const topOffset = Math.abs(pointer1.clientY + pointer2.clientY)
  
  const width = Math.abs(pointer1.clientX - pointer2.clientX)
  const height = Math.abs(pointer1.clientY - pointer2.clientY)
  
  // let scaleCenter = [width/2, height/2]
  
  // let scale = (width * height)
  
  transOptions.transfomScale = Math.sqrt(width ** 2 + height ** 2)
  const ratio = transOptions.transfomScale / startingScale
  
  // transOptions.center = [leftOffset/2, topOffset/2]
  
  const newFrameList = [...frameList].map(frame => {
    // frame.x = frame.x * transOptions.transfomScale
    // frame.y = frame.y * transOptions.transfomScale
    frame.width *= ratio
    frame.height *= ratio
    frame.x *= ratio
    frame.y *= ratio
    frame = moveHandles(frame)
    frame.style = calculateStyle(frame)
    return frame
  })


  // startingScale = width
  
  return newFrameList
}


function trackMouse (event:PointerEvent | TouchEvent, frameId:number, frameList:FrameT[]):FrameT {
  let frame:FrameT = frameList[frameId]
  const origin = {x: frame.x, y: frame.y}
  const coords = {x:0, y:0}
  
  switch ((event as PointerEvent).pointerType) {
    case 'touch':
    console.log(event)
    frame.width = (event as MouseEvent).clientX - origin.x
    frame.height = frame.width / frame.aspect
    break
    default:
    case 'mouse':
    coords.x = (event as MouseEvent).movementX;
    coords.y = (event as MouseEvent).movementY;
    frame.width += coords.x
    frame.height += coords.x / frame.aspect
    frame.bottomRightHandle.x += coords.x
    frame.bottomRightHandle.y += frame.height
    break
  }
  frame = moveHandles(frame)
  frame.style = calculateStyle(frame)
  return frame
};


export { 
  buildFrame
  , calculateStyle
  , clearActiveFrame
  , deepCopy
  , fitToScreen
  , getActiveFrame
  , handleKeypress
  , moveActiveFrame
  , moveFrame
  , moveHandles
  , purgeFrames
  , reorderLayers
  , selectAllFrames
  , touchZoomHandler
  , trackMouse
}