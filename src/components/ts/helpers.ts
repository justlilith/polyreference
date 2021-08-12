let defaultHandle = { width: 20, height: 20, x: 0, y: 0 }

function buildFrame(data:string, frameList:Array<FrameT>):FrameT {
  let id = frameList.length;
  
  let frame = {
    url: data,
    width: 400,
    height: 400,
    x: 0,
    y: 0,
    style: ``,
    id: id,
    topLeftHandle: defaultHandle,
    topRightHandle: { ...defaultHandle, x: 380 },
    bottomRightHandle: { ...defaultHandle, x: 380, y: 380 },
    bottomLeftHandle: { ...defaultHandle, y: 380 },
    top: true
  };
  
  return frame;
}

function reorderLayers (frameid,frameList:FrameT[]):Array<FrameT> {
  let newList = frameList.map(frame => {
    if (frame.id == frameid) {
      frame = {...frame, top: true}
    } else {
      frame = {...frame, top: false}
    }
    return frame
  })
  return newList
}

export { buildFrame, reorderLayers }