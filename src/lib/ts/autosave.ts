import { browser } from '$app/env'
import type { User } from '@supabase/gotrue-js';
// import * as Helpers from '$lib/ts/helpers'
import * as Storage from '$lib/ts/storage'

let appStorage

if (browser) {
  appStorage = window.localStorage;
}

function saveToLocal (appStorage:Storage, prop:string, value:unknown):void {
  appStorage.setItem(prop,JSON.stringify(value))
}

function loadFromLocal (appStorage:Storage, prop:string, value:unknown):unknown {
  let fetched = null
  try {
    fetched = JSON.parse(appStorage.getItem(prop))
    if (fetched == "") {
      throw new Error("Smile empty soul")
    }
    return fetched
  } catch (e) {
    console.warn(e)
    return value
  }
}


type AutosaveArgsT = {
  userData: User
  frameList: Array<FrameT>
}
function autosave (args:AutosaveArgsT):void {
  saveToLocal(appStorage, 'frameList', args.frameList)
  if (args.userData){
    Storage.uploadFrames(args.userData,args.frameList)
  }
  console.log('saved uwu ✨')
}

export { autosave, loadFromLocal, saveToLocal }