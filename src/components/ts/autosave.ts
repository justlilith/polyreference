let appStorage = window.localStorage

function saveToLocal (prop:string, value):void {
  appStorage.setItem(prop,JSON.stringify(value))
}

function loadFromLocal (prop:string, value) {
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
  saveToLocal('frameList', frameList)
}

export { autosave, loadFromLocal, saveToLocal }