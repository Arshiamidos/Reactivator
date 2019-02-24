const EMPTY={}
const EMPTY2={}
let croppers=EMPTY

export function getStore(i=undefined){
    if(i!==undefined){
        return croppers[i]
    }
    return croppers;
}

export function setStore(i,refr){
   return  croppers[i]=refr
}

export function resetStore(){

   //croppers={...EMPTY}//i dont't know why :ASK
  
   croppers={}
    console.log(croppers)
}
export function deSelectionStore(i=undefined){

    //console.log('Croppers',croppers)
    if(i===undefined)
        Object.keys(croppers).forEach(cropperIndex=>{
            croppers[cropperIndex].setSelected(false)
        })
    else croppers[i].setSelected(false)

}
