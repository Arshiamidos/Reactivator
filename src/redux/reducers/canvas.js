export function Canvas(
    state = {
        debugMode:true,


        Refrences:{},
        RefrenceSelected:-1,

		isDraggingNew:false,
		isDraggingOld:true,
        
        sideCropping:'',
		isCroppingOld:true,
    }, 
    action) {

    switch (action.type) {
        case 'SET_SELECTED':
            return {...state,RefrenceSelected:action.id};
        case 'TOGGLE_DRAGGING_NEW':
            return {...state,isDraggingNew:action.toggle};
        case 'TOGGLE_CROPPING_OLD':
            return {...state,isCroppingOld:action.toggle};
        case 'TOGGLE_DRAGGING_OLD':
            return {...state,isDraggingOld:action.toggle};
        case 'PUSH_TO_REFRENCES':
            return {...state,Refrences:{...state.Refrences,...action.obj}};
        default:
            return state;
    }
}
