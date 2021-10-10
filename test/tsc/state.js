import { writable } from 'svelte/store';
import { autosave } from './autosave';
let statePointer = 0;
const stateList = [{
        currentTrans: '',
        currentState: '',
        framesSnapshot: []
    }];
const initState = {
    currentTrans: '',
    currentState: '',
    framesSnapshot: []
};
const StateStore = writable(initState);
function advance() {
    StateStore.update(() => {
        statePointer += 1;
        // let stateList = get(StateStore)
        if (statePointer === stateList.length) {
            statePointer = stateList.length - 1;
        }
        return stateList[statePointer];
    });
}
function append(frameList) {
    statePointer += 1;
    const currentState = stateList;
    const newState = {
        // ...currentState[currentState.length -1]
        ...currentState[statePointer - 1],
        framesSnapshot: frameList
    };
    currentState.push(newState);
    StateStore.update(() => {
        // console.log('%cstate updated', 'color:green')
        // console.log(currentState)
        // console.log(statePointer)
        return newState;
    });
}
function calculate(states, index, framesSnapshot) {
    return {
        currentTrans: '',
        currentState: states[index],
        framesSnapshot: framesSnapshot
    };
}
function reverse() {
    console.log('reversing history uwu ✨');
    StateStore.update(() => {
        if (statePointer == 0) {
            autosave([]);
            return null;
        }
        if (statePointer > 0) {
            statePointer -= 1;
            console.log(stateList[statePointer].framesSnapshot);
            autosave(stateList[statePointer].framesSnapshot);
            return stateList[statePointer];
        }
    });
}
export { append, advance, calculate, reverse, StateStore };
//# sourceMappingURL=state.js.map