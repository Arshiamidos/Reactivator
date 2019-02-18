//setSelected,toggleDraggingNew,toggleCroppingOld,toggleDraggingOld
export function setSelected(id) {
    return {
        type: 'SET_SELECTED',
        id
    };
}
export function toggleDraggingNew(toggle) {
    return {
        type: 'TOGGLE_DRAGGING_NEW',
        toggle
    };
}
export function toggleCroppingOld(toggle) {
    return {
        type: 'TOGGLE_CROPPING_OLD',
        toggle
    };
}
export function toggleDraggingOld(toggle) {
    return {
        type: 'TOGGLE_DRAGGING_OLD',
        toggle
    };
}
export function pushToRefrences(obj){
    return{
        type:'PUSH_TO_REFRENCES',
        obj
    }
}