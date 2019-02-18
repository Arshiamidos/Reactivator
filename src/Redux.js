let _isCroppingOld=false;
let _isDraggingNew=false;
let _isDraggingOld=false;
let _selectedBoxIndex=-1;
let _sideCropping='';
let obj= {
   
    get sideCropping(){
        return _sideCropping
    },
    set sideCropping(s){
        _sideCropping=s
    },


    set isDraggingNew(t){
        _isDraggingNew=t
    },
    get isDraggingNew(){
        return _isDraggingNew 
    },

    set isDraggingOld(t){
        _isDraggingOld=t
    },

    get isDraggingOld(){
        return _isDraggingOld
    },

    set isCroppingOld(t){
        _isCroppingOld=t
    },

    get isCroppingOld(){
        return _isCroppingOld 
    },

    set selectedBoxIndex(t){
        _selectedBoxIndex=t
    },

    get selectedBoxIndex(){
        return _selectedBoxIndex 
    }




}
export default obj


