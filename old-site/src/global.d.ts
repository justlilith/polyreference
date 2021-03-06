/// <reference types="svelte" />

interface FrameT {
  id: number
  url: string
  width: number
  height: number
  x: number
  y: number
  style: string
  topRightHandle: Handle
  topLeftHandle: Handle
  bottomRightHandle: Handle
  bottomLeftHandle: Handle
  top: boolean
  active: boolean
  aspect: number
  offset: number[]
}

interface Handle {
  width: number
  height: number
  x: number
  y: number
}

interface StateT {
  currentTrans:string
  currentState:function
  framesSnapshot: Array<FrameT>
}

interface TransT {
  transfomScale: number
  center: Array<number> //coordinates
}