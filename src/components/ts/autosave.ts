let appStorage = window.localStorage

function saveToLocal (prop:string, value):void {
  appStorage.setItem(prop,JSON.stringify(value))
  // console.log(appStorage.getItem(prop))
}

function loadFromLocal (prop:string, value) {
  let fetched = null
  try {
    fetched = JSON.parse(appStorage.getItem(prop))
  } catch (e) {
    console.warn(e)
    fetched = value
  } finally {
    return fetched
  }
}

function autosave (frameList:Array<FrameT>):void {
  console.log('saving. . .')
  saveToLocal('frameList', frameList)
}

export { autosave, loadFromLocal, saveToLocal }