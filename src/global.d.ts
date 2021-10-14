/// <reference types="@sveltejs/kit" />

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

interface StateT {
  currentTrans:string
  currentState:function
  framesSnapshot: Array<FrameT>
}

interface TransT {
  transfomScale: number
  center: Array<number> //coordinates
}


interface ImageRecordT {
  id: number
  imageFile: File
  type: string
  text: string
}

interface Handle {
  width: number
  height: number
  x: number
  y: number
}



type LoadImageArgs = {
  frameList: FrameT[]
  appStorage: Storage
}

type SaveImageArgs = {
  imageFile: File
  frameList: FrameT[]
  appStorage: Storage
}


type NotificationArgsT = {
  notification: string
  duration?: number
  interrupt?: boolean
}
type NotificationsStoreT = {
  notifications: Array<NotificationArgsT>
}