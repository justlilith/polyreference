import { autosave, saveToLocal } from "./autosave";
import * as Storage from "$lib/ts/storage";
import * as Save from "$lib/ts/autosave";
import * as State from "$lib/ts/state";
import * as Auth from "$lib/ts/auth";
import * as Crier from '$lib/ts/crier' 
import type { User } from "@supabase/gotrue-js";

const defaultHandle = { width: 20, height: 20, x: 0, y: 0 }

type BuildFrameArgsT = {
  url: string
  frameList: FrameT[]
  userData: User
}
function buildFrame(args:BuildFrameArgsT):Promise<FrameT> {
  console.log(args)
  return new Promise((resolve, reject) => {
    if (!args.url) {
      reject()
    }
    const id = args.frameList.length;
    
    let frame:FrameT = {
      url: args.url,
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


type KeypressArgsT = {
  userData:User
  event:KeyboardEvent
  frameList:FrameT[]
}
function handleKeypress(args:KeypressArgsT):FrameT[]{
  const deletable = args.frameList.filter(frame => frame.active == true)
  // console.log(event)
  switch (args.event.key) {
    case 'a':
    if (args.event.ctrlKey){
      args.frameList = selectAllFrames(args.frameList)
      State.append(args.frameList)
      autosave({userData: args.userData, frameList: args.frameList})
      Crier.send({notification:'Select All'})
    }
    break
    case 'A':
    if (args.event.ctrlKey){
      args.frameList = clearActiveFrame(args.frameList)
      State.append(args.frameList)
      autosave({userData: args.userData, frameList: args.frameList})
      Crier.send({notification:'Select All'})
    }
    break
    case 'y':
    if (args.event.ctrlKey){
      State.advance()
      Crier.send({notification:'Redo'})
    }
    break
    case 'z':
    if (args.event.ctrlKey){
      State.reverse(args.userData)
      Crier.send({notification:'Undo'})
      
    }
    break
    case 'Z':
    if (args.event.ctrlKey) {
      console.log('yay~')
      State.advance()
      Crier.send({notification:'Undo'})
    }
    break
    case 'Escape':
    args.frameList = clearActiveFrame(args.frameList)
    State.append(args.frameList)
    autosave({userData: args.userData, frameList: args.frameList})
    Crier.send({notification:'Select None'})
    break
    case 'Delete':
    case 'Backspace':
    args.frameList = args.frameList.filter(frame => frame.active == false)
    State.append(args.frameList)
    autosave({userData: args.userData, frameList: args.frameList})
    Crier.send({notification:'Cleared'})
    break
    case 'ArrowLeft':
    args.frameList = moveActiveFrame(args.frameList,'left')
    State.append(args.frameList)
    autosave({userData: args.userData, frameList: args.frameList})
    Crier.send({notification:'Nudge Left', duration:300, interrupt:true})
    break
    case 'ArrowRight':
    args.frameList = moveActiveFrame(args.frameList,'right')
    State.append(args.frameList)
    autosave({userData: args.userData, frameList: args.frameList})
    Crier.send({notification:'Nudge Right', duration:300, interrupt:true})
    break
    case 'ArrowUp':
    args.frameList = moveActiveFrame(args.frameList,'up')
    State.append(args.frameList)
    autosave({userData: args.userData, frameList: args.frameList})
    Crier.send({notification:'Nudge Up', duration:300, interrupt:true})
    break
    case 'ArrowDown':
    args.frameList = moveActiveFrame(args.frameList,'down')
    State.append(args.frameList)
    autosave({userData: args.userData, frameList: args.frameList})
    Crier.send({notification:'Nudge Down',duration:300, interrupt:true})
    break
    default:
    break
  }
  if (args.frameList) {
    return args.frameList
  }
}


function loadImage (args:LoadImageArgs):Promise<ImageRecordT> {
  let localImageList:Array<ImageRecordT> = []
  localImageList = Save.loadFromLocal(args.appStorage,'localImages', []) as Array<ImageRecordT>
  localImageList != null ? null : localImageList = []
  const localImage = localImageList.filter(image => {
    return image.id == args.frameList.length
  })[0]
  return new Promise((resolve) => {
    resolve(localImage)
  })
  // return localImageList[0].imageFile
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

type PasteArgsT = {
  frameList: FrameT[]
  event: ClipboardEvent
  appStorage: Storage
  userData: User
  loggedIn: boolean
}
async function paste (args:PasteArgsT):Promise<void> {
  const imageFile = args.event?.clipboardData?.items[0].getAsFile();
  let data = args.event?.clipboardData?.getData("text");
  console.log(args.loggedIn)
  if (imageFile) {
    console.log('image pasted')
    if (args.loggedIn == false || args.loggedIn == null) {
      await saveImage({imageFile, frameList: args.frameList, appStorage: args.appStorage})
      const imageData = await loadImage({appStorage: args.appStorage, frameList: args.frameList})
      data = imageData.text
      console.log(data)
    } else {
      const { error, imageUrl } = await Storage.uploadImage({userData: args.userData, imageFile})
      if (!error) {
        data = imageUrl
        console.log(data)
      } else {
        console.log(error)
      }
    }
  }
  let newFrame = await buildFrame({userData: args.userData, url: data, frameList: args.frameList});
  newFrame.x = 50;
  newFrame.y = 100;
  newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
  
  const newImage = new Image()
  newImage.src = data
  console.log(data)
  newImage.onload = () => {
    console.log(newImage.naturalHeight, newImage.naturalWidth)
    newFrame.height = newImage.naturalHeight
    newFrame.width = newImage.naturalWidth
    newFrame = fitToScreen(newFrame)
    newFrame.style = calculateStyle(newFrame)
    moveHandles(newFrame)
    
    data ? (args.frameList = [...args.frameList, newFrame]) : null;
    args.frameList = reorderLayers(newFrame.id, args.frameList)
    console.log(args.frameList.filter(frame => frame.id == newFrame.id))
    State.append(args.frameList)
  }
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


async function saveImage (args:SaveImageArgs) {
  const reader = new FileReader()
  let base64
  reader.addEventListener('loadend', event => {
    base64 = reader.result
    
    let localImageList = Save.loadFromLocal(args.appStorage,'localImages', []) as Array<ImageRecordT>
    localImageList != null ? localImageList : localImageList = []
    if (localImageList.length != 0 || localImageList != null) {
      const temp = localImageList.filter(imageRecord => {
        return imageRecord.id == args.frameList.length
      })
      if (temp.length < 1 || temp == null) {
        localImageList.push({
          imageFile: args.imageFile,
          id: args.frameList.length,
          type: args.imageFile.type,
          text: base64
        })
        Save.saveToLocal(args.appStorage,'localImages',localImageList)
      }
    }
    if (localImageList.length == 0) {
      localImageList.push({
        imageFile: args.imageFile,
        id: args.frameList.length,
        type: args.imageFile.type,
        text: base64
      })
      Save.saveToLocal(args.appStorage,'localImages',localImageList)
    }
  })
  
  reader.readAsDataURL(args.imageFile)
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
  , paste
  , purgeFrames
  , reorderLayers
  , selectAllFrames
  , touchZoomHandler
  , trackMouse
}