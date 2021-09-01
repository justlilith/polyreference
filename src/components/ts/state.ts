import { writable, get } from 'svelte/store'
import { autosave, saveToLocal } from './autosave'

let statePointer:number = 0
let _stateList:StateT[] = []

let initState:StateT = {
  currentTrans: ''
  , currentState: ''
  , framesSnapshot: []
}

const StateStore = writable(initState)

function advance () {
  StateStore.update(() => {
    statePointer += 1
    // let stateList = get(StateStore)
    if (statePointer === _stateList.length) {
      statePointer = _stateList.length - 1
    }
    return _stateList[statePointer]
  })
  // statePointer = _stateList.length - 1
  // return _stateList[_stateList.length - 1]
}

function append (frameList:FrameT[]) {
  statePointer += 1
  const currentState:StateT[] = _stateList
  const newState = {
    // ...currentState[currentState.length -1]
    ...currentState[statePointer -1]
    , framesSnapshot: frameList
  }
  currentState.push(newState)
  StateStore.update(() => {
    console.log('%cstate updated', 'color:green')
    console.log(currentState)
    console.log(statePointer)
    return newState
  })
}

function calculate (states, index, framesSnapshot:FrameT[]) {
  
}

function reverse () {
  console.log('reversing history uwu ✨')
  StateStore.update(() => {
    let stateList = _stateList
    
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