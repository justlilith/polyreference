/// <reference types="svelte" />

interface FrameT {
  id: number
  url: string
  width: number
  height: number
  x: number
  y: number
  style: string
<<<<<<< HEAD
  topRightHandle: Handle
  topLeftHandle: Handle
  bottomRightHandle: Handle
  bottomLeftHandle: Handle
  top: boolean
}

interface Handle {
  width: number
  height: number
  x: number
  y: number
=======
  active: boolean
  zindex: string
>>>>>>> main
}