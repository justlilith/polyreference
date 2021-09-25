import { browser } from '$app/env'

let appStorage

if (browser) {
	appStorage = window.localStorage;
}

function saveToLocal (appStorage:Storage, prop:string, value):void {
  appStorage.setItem(prop,JSON.stringify(value))
}

function loadFromLocal (appStorage:Storage, prop:string, value) {
  let fetched = null
  try {
    fetched = JSON.parse(appStorage.getItem(prop))
    if (fetched == "") {
      throw new Error("Smile empty soul")
    }
  } catch (e) {
    console.warn(e)
    fetched = value
  } finally {
    return fetched
  }
}

function autosave (frameList:Array<FrameT>):void {
  saveToLocal(appStorage, 'frameList', frameList)
  console.log('saved uwu ✨')
}

export { autosave, loadFromLocal, saveToLocal }