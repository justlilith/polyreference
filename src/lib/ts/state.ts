import { writable, get } from 'svelte/store'
import { autosave, saveToLocal } from './autosave'

let statePointer = 0
const stateList:StateT[] = [{
  currentTrans: ''
  , currentState: ''
  , framesSnapshot: []
}]

const initState:StateT = {
  currentTrans: ''
  , currentState: ''
  , framesSnapshot: []
}

const StateStore = writable(initState)

function advance ():void {
  StateStore.update(() => {
    statePointer += 1
    // let stateList = get(StateStore)
    if (statePointer === stateList.length) {
      statePointer = stateList.length - 1
    }
    return stateList[statePointer]
  })
}

function append (frameList:FrameT[]):void {
  statePointer += 1
  const currentState:StateT[] = stateList
  const newState = {
    ...currentState[statePointer -1]
    , framesSnapshot: frameList
  }
  currentState.push(newState)
  StateStore.update(() => {
    // console.log('%cstate updated', 'color:green')
    // console.log(currentState)
    // console.log(statePointer)
    return newState
  })
}

function calculate (states:StateT[], index:number, framesSnapshot:FrameT[]):StateT {
  return {
    currentTrans:'',
    currentState:states[index],
    framesSnapshot:framesSnapshot
  }
}

function reverse ():void {
  console.log('reversing history uwu ✨')
  StateStore.update(() => {
    
    if (statePointer == 0) {
      autosave([])
      return null
    }
    if (statePointer > 0) {
      statePointer -= 1
      console.log(stateList[statePointer].framesSnapshot)
      autosave(stateList[statePointer].framesSnapshot)
      return stateList[statePointer]
    }
  })
}

export { 
  append
  , advance
  , calculate
  , reverse
  , StateStore
}