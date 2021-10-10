import { autosave } from "./autosave";
import * as State from "$lib/ts/state";
import * as Save from "$lib/ts/autosave";
const defaultHandle = { width: 20, height: 20, x: 0, y: 0 };
function buildFrame(data, frameList) {
    return new Promise((resolve, reject) => {
        if (!data) {
            reject();
        }
        const id = frameList.length;
        let frame = {
            url: data,
            width: 400,
            height: 400,
            x: 100,
            y: 100,
            style: ``,
            id: id,
            topLeftHandle: defaultHandle,
            topRightHandle: { ...defaultHandle, x: 380 },
            bottomRightHandle: { ...defaultHandle, x: 380, y: 380 },
            bottomLeftHandle: { ...defaultHandle, y: 380 },
            top: true,
            active: true,
            aspect: 0,
            offset: [0, 0]
        };
        const newImage = new Image();
        newImage.src = frame.url;
        newImage.onload = () => {
            console.log(newImage.naturalHeight, newImage.naturalWidth);
            frame.height = newImage.naturalHeight;
            frame.width = newImage.naturalWidth;
            frame.aspect = frame.width / frame.height; // 2:1 wideboi
            frame = fitToScreen(frame);
            frame.style = calculateStyle(frame);
            moveHandles(frame);
            resolve(frame);
        };
        // return frame;
    });
}
function calculateStyle(frame, corner) {
    let style = "";
    let addedStyle;
    let width = frame.width;
    let height = frame.height;
    if (corner) {
        switch (corner) {
            case 'tleft':
                width = frame.topLeftHandle.width;
                height = frame.topLeftHandle.height;
                addedStyle = ` top: ${frame.topLeftHandle.y}px; left: ${frame.topLeftHandle.x}px;`;
                break;
            case 'tright':
                width = frame.topRightHandle.width;
                height = frame.topRightHandle.height;
                addedStyle = ` top: ${frame.topRightHandle.y}px; left: ${frame.topRightHandle.x}px;`;
                break;
            case 'bleft':
                width = frame.bottomLeftHandle.width;
                height = frame.bottomLeftHandle.height;
                addedStyle = ` top: ${frame.bottomLeftHandle.y}px; left: ${frame.bottomLeftHandle.x}px;`;
                break;
            case 'bright':
                width = frame.bottomRightHandle.width;
                height = frame.bottomRightHandle.height;
                addedStyle = ` top: ${frame.bottomRightHandle.y}px; left: ${frame.bottomRightHandle.x}px;`;
                break;
            default:
                return;
        }
    }
    style = `width: ${width}px; height: ${height}px; position: fixed;`;
    if (!corner) {
        style = style + ` background-image: url('${frame.url}'); top: ${frame.y}px; left: ${frame.x}px;`;
    }
    if (corner) {
        style = style + addedStyle;
    }
    return style;
}
function clearActiveFrame(frameList) {
    return frameList.map(frame => {
        return { ...frame, active: false };
    });
}
function deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
}
function fitToScreen(frame) {
    const aspect = frame.width / frame.height; // 20/10 == 2:1 == 2
    let newWidth = window.visualViewport.width / 2; //e.g. 450
    let newHeight = window.visualViewport.width / 2; //e.g 225
    frame.width > frame.height //wideboi
        ? newHeight = newWidth / aspect //e.g 225
        : newWidth = newHeight * aspect; //longboi (1/2 = .5, )
    console.log(newWidth, newHeight, aspect);
    return { ...frame, width: newWidth, height: newHeight };
}
function getActiveFrame(frameList) {
    return frameList.filter(frame => frame.top == true)[0];
}
function handleKeypress(event, frameList) {
    // console.log(event)
    switch (event.key) {
        case 'a':
            if (event.ctrlKey) {
                frameList = selectAllFrames(frameList);
                State.append(frameList);
                autosave(frameList);
            }
            break;
        case 'A':
            if (event.ctrlKey) {
                frameList = clearActiveFrame(frameList);
                State.append(frameList);
                autosave(frameList);
            }
            break;
        case 'y':
            if (event.ctrlKey) {
                State.advance();
            }
            break;
        case 'z':
            if (event.ctrlKey) {
                State.reverse();
            }
            break;
        case 'Z':
            if (event.ctrlKey) {
                console.log('yay~');
                State.advance();
            }
            break;
        case 'Escape':
            frameList = clearActiveFrame(frameList);
            State.append(frameList);
            autosave(frameList);
            break;
        case 'Delete':
        case 'Backspace':
            frameList = frameList.filter(frame => frame.active == false);
            State.append(frameList);
            autosave(frameList);
            break;
        case 'ArrowLeft':
            frameList = moveActiveFrame(frameList, 'left');
            State.append(frameList);
            autosave(frameList);
            break;
        case 'ArrowRight':
            frameList = moveActiveFrame(frameList, 'right');
            State.append(frameList);
            autosave(frameList);
            break;
        case 'ArrowUp':
            frameList = moveActiveFrame(frameList, 'up');
            State.append(frameList);
            autosave(frameList);
            break;
        case 'ArrowDown':
            frameList = moveActiveFrame(frameList, 'down');
            State.append(frameList);
            autosave(frameList);
            break;
        default:
            break;
    }
    if (frameList) {
        return frameList;
    }
}
function loadImage(args) {
    let localImageList = [];
    localImageList = Save.loadFromLocal(args.appStorage, 'localImages', []);
    localImageList != null ? null : localImageList = [];
    return localImageList.filter(image => {
        return image.id == args.frameList.length;
    })[0];
    // return localImageList[0].imageFile
}
function moveActiveFrame(frameList, direction) {
    const CONSTANT = 40;
    const active = getActiveFrame(frameList);
    switch (direction) {
        case 'left':
            frameList[active.id].x = (frameList[active.id].x - CONSTANT) - (frameList[active.id].x % CONSTANT);
            console.log(frameList[active.id].x);
            break;
        case 'right':
            frameList[active.id].x = (frameList[active.id].x + CONSTANT) - (frameList[active.id].x % CONSTANT);
            break;
        case 'up':
            frameList[active.id].y = (frameList[active.id].y - CONSTANT) - (frameList[active.id].y % CONSTANT);
            break;
        case 'down':
            frameList[active.id].y = (frameList[active.id].y + CONSTANT) - (frameList[active.id].y % CONSTANT);
            break;
        default:
            break;
    }
    moveHandles(active);
    frameList[active.id].style = calculateStyle(active);
    // console.log(active)
    return frameList;
}
function moveFrame(event, frame, offset) {
    var _a;
    if (((_a = event) === null || _a === void 0 ? void 0 : _a.pointerType) === 'mouse') {
        const coords = { x: 0, y: 0 };
        coords.x = event.movementX;
        coords.y = event.movementY;
        frame.x += coords.x;
        frame.y += coords.y;
    }
    else {
        // console.log(event)
        frame.x = event.changedTouches[0].clientX - offset[0];
        frame.y = event.changedTouches[0].clientY - offset[1];
        // console.log(event.changedTouches[0].clientX)
        // console.log(event.targetTouches[0].clientX + offset[0])
        console.log(offset[0]);
        // console.log(frame.x)
    }
    frame = moveHandles(frame);
    frame.style = calculateStyle(frame);
    // console.log(frame)
    return frame;
}
function moveHandles(frame) {
    frame.topLeftHandle.x = frame.x;
    frame.topLeftHandle.y = frame.y;
    frame.topRightHandle.x = frame.x + frame.width - frame.topRightHandle.width;
    frame.topRightHandle.y = frame.y;
    frame.bottomLeftHandle.x = frame.x;
    frame.bottomLeftHandle.y = frame.y + frame.height - frame.bottomLeftHandle.height;
    frame.bottomRightHandle.x = frame.x + frame.width - frame.bottomRightHandle.width;
    frame.bottomRightHandle.y = frame.y + frame.height - frame.bottomRightHandle.height;
    return frame;
}
async function paste(frameList, event, appStorage) {
    var _a, _b;
    const imageFile = (_a = event === null || event === void 0 ? void 0 : event.clipboardData) === null || _a === void 0 ? void 0 : _a.items[0].getAsFile();
    let data = (_b = event === null || event === void 0 ? void 0 : event.clipboardData) === null || _b === void 0 ? void 0 : _b.getData("text");
    if (imageFile) {
        await saveImage({ imageFile, frameList, appStorage });
        const imageData = loadImage({ appStorage, frameList });
        data = imageData.text;
    }
    let newFrame = await buildFrame(data, frameList);
    newFrame.x = 50;
    newFrame.y = 100;
    newFrame.style = `position:fixed; left:${newFrame.x}px; top:${newFrame.y}px;`;
    const newImage = new Image();
    newImage.src = data;
    newImage.onload = () => {
        console.log(newImage.naturalHeight, newImage.naturalWidth);
        newFrame.height = newImage.naturalHeight;
        newFrame.width = newImage.naturalWidth;
        newFrame = fitToScreen(newFrame);
        newFrame.style = calculateStyle(newFrame);
        moveHandles(newFrame);
        data ? (frameList = [...frameList, newFrame]) : null;
        frameList = reorderLayers(newFrame.id, frameList);
        console.log(frameList.filter(frame => frame.id == newFrame.id));
        State.append(frameList);
    };
}
function purgeFrames(frameList) {
    return frameList.filter(frame => {
        return frame !== null || frame !== undefined;
    });
}
function reorderLayers(frameid, frameList) {
    const newList = frameList.map(frame => {
        if (frame.id == frameid) {
            frame = { ...frame, top: true, active: true };
        }
        else {
            frame = { ...frame, top: false, active: false };
        }
        return frame;
    });
    return newList;
}
async function saveImage(args) {
    const reader = new FileReader();
    let base64;
    reader.addEventListener('loadend', event => {
        base64 = reader.result;
        let localImageList = Save.loadFromLocal(args.appStorage, 'localImages', []);
        localImageList != null ? localImageList : localImageList = [];
        if (localImageList.length != 0 || localImageList != null) {
            const temp = localImageList.filter(imageRecord => {
                return imageRecord.id == args.frameList.length;
            });
            if (temp.length < 1 || temp == null) {
                localImageList.push({
                    imageFile: args.imageFile,
                    id: args.frameList.length,
                    type: args.imageFile.type,
                    text: base64
                });
                Save.saveToLocal(args.appStorage, 'localImages', localImageList);
            }
        }
        if (localImageList.length == 0) {
            localImageList.push({
                imageFile: args.imageFile,
                id: args.frameList.length,
                type: args.imageFile.type,
                text: base64
            });
            Save.saveToLocal(args.appStorage, 'localImages', localImageList);
        }
    });
    reader.readAsDataURL(args.imageFile);
}
function selectAllFrames(frameList) {
    return frameList.map(frame => {
        return { ...frame, active: true };
    });
}
// hey this needs to map over the filterlist instead of using css transforms
function touchZoomHandler(frameList, event, startingScale) {
    event.preventDefault();
    const transOptions = { transfomScale: 1.0,
        center: [200, 200]
    };
    const pointer1 = event.targetTouches[0];
    const pointer2 = event.targetTouches[1];
    // const leftOffset = Math.abs(pointer1.clientX + pointer2.clientX)
    // const topOffset = Math.abs(pointer1.clientY + pointer2.clientY)
    const width = Math.abs(pointer1.clientX - pointer2.clientX);
    const height = Math.abs(pointer1.clientY - pointer2.clientY);
    // let scaleCenter = [width/2, height/2]
    // let scale = (width * height)
    transOptions.transfomScale = Math.sqrt(width ** 2 + height ** 2);
    const ratio = transOptions.transfomScale / startingScale;
    // transOptions.center = [leftOffset/2, topOffset/2]
    const newFrameList = [...frameList].map(frame => {
        // frame.x = frame.x * transOptions.transfomScale
        // frame.y = frame.y * transOptions.transfomScale
        frame.width *= ratio;
        frame.height *= ratio;
        frame.x *= ratio;
        frame.y *= ratio;
        frame = moveHandles(frame);
        frame.style = calculateStyle(frame);
        return frame;
    });
    // startingScale = width
    return newFrameList;
}
function trackMouse(event, frameId, frameList) {
    let frame = frameList[frameId];
    const origin = { x: frame.x, y: frame.y };
    const coords = { x: 0, y: 0 };
    switch (event.pointerType) {
        case 'touch':
            console.log(event);
            frame.width = event.clientX - origin.x;
            frame.height = frame.width / frame.aspect;
            break;
        default:
        case 'mouse':
            coords.x = event.movementX;
            coords.y = event.movementY;
            frame.width += coords.x;
            frame.height += coords.x / frame.aspect;
            frame.bottomRightHandle.x += coords.x;
            frame.bottomRightHandle.y += frame.height;
            break;
    }
    frame = moveHandles(frame);
    frame.style = calculateStyle(frame);
    return frame;
}
;
export { buildFrame, calculateStyle, clearActiveFrame, deepCopy, fitToScreen, getActiveFrame, handleKeypress, moveActiveFrame, moveFrame, moveHandles, paste, purgeFrames, reorderLayers, selectAllFrames, touchZoomHandler, trackMouse };
//# sourceMappingURL=helpers.js.map