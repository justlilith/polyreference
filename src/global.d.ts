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
}

interface Handle {
  width: number
  height: number
  x: number
  y: number
}