import { browser } from '$app/env';
// import * as Helpers from '$lib/ts/helpers'
let appStorage;
if (browser) {
    appStorage = window.localStorage;
}
function saveToLocal(appStorage, prop, value) {
    appStorage.setItem(prop, JSON.stringify(value));
}
function loadFromLocal(appStorage, prop, value) {
    let fetched = null;
    try {
        fetched = JSON.parse(appStorage.getItem(prop));
        if (fetched == "") {
            throw new Error("Smile empty soul");
        }
        return fetched;
    }
    catch (e) {
        console.warn(e);
        return value;
    }
}
function autosave(frameList) {
    saveToLocal(appStorage, 'frameList', frameList);
    console.log('saved uwu ✨');
}
export { autosave, loadFromLocal, saveToLocal };
//# sourceMappingURL=autosave.js.map