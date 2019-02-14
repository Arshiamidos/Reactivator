import React from 'react';
import Cropper from './Cropper'
import './App.css'
import {handleSize} from './style'

class App extends React.Component {
  constructor() {
    super();

    this.debugMode=true;

    this.isDraggingOld=false;
    this.isDraggingNew=false;
    this.isCroppingOld=false

    this.state={
        anchorX:null,
        anchorY:null,
        diffX:null,
        diffY:null,
        top:null,
        left:null,
        diffMouseWithRect:{
            x:0,
            y:0,
            w:0,
            h:0,
        },
        selectedBoxIndex:-1,
        boxes:[],


    }
  }


  componentDidMount(){
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
   isSubElement =(el, check)=> {
        if (el === null) {
            return false;
        } else if (check(el)) {
            return true;
        } else {
            return this.isSubElement(el.parentNode, check);
        }
    }

  getBoundingCustome=(el)=>{
    return this.container.getBoundingClientRect(el)
  }
  getBoundingClient=()=>{
    return this.container.getBoundingClientRect()
  }
  getMousePosition=(ev)=>{
    return {
        x:ev.pageX,
        y:ev.pageY
    }
  }
  
  onMouseDown=(ev)=>{

    if (
        ev.target.dataset.wrapper 
        || 
        ev.target.dataset.dir 
        || this.isSubElement(ev.target, (el) => el.dataset && el.dataset.wrapper)) {
        return;
    }
    ev.preventDefault();

    if(ev.target.className.search('MAIN_CONTAINER')<0){//child selected 

         ev.preventDefault();
         return;
        } 
    this.setState({selectedBoxIndex:-1})
   
    this.isDraggingNew=true;
    this.setState({
        anchorX:this.getMousePosition(ev).x,
        anchorY:this.getMousePosition(ev).y
    })
  }
  onMouseUp=(ev)=>{
        this.isDraggingNew=false;
        let {diffX,diffY,top,left}=this.state
       
        if(Math.abs(this.state.diffX)>0)
            this.setState({
                boxes:[...this.state.boxes,{diffX,diffY,top,left}],
                anchorX:null,
                anchorY:null,
                diffX:null,
                diffY:null,
                top:null,
                left:null,
            })
  }

  onCropingOld=(ev,bi,side)=>{

    if(ev.buttons===1 && this.state.selectedBoxIndex===bi ){//with holding left click 
        


        if(this.state.diffMouseWithRect.w===0){
            this.setState({//selectedBoxIndex:bi,
                diffMouseWithRect:{
                    ...this.state.diffMouseWithRect,
                    w:this.state.boxes[bi].left,
                    h:this.state.boxes[bi].top,
                    y:this.getMousePosition(ev).y-this.state.boxes[bi].top,
                    x:this.getMousePosition(ev).x-this.state.boxes[bi].left
                }})

            return;
        }

        const diffY=this.getMousePosition(ev).y-this.state.boxes[bi].top
        const diffX=this.getMousePosition(ev).x-this.state.boxes[bi].left

        if(side==='sw'){
            this.state.boxes[bi].left=this.getMousePosition(ev).x-handleSize/2
            this.state.boxes[bi].diffY=this.getMousePosition(ev).y-this.state.boxes[bi].top-handleSize/2
            this.state.boxes[bi].diffX=Math.abs(this.state.boxes[bi].diffX)-diffX+handleSize/2
            this.setState({boxes:this.state.boxes})
            
        }

        if(side==='se'){
            this.state.boxes[bi].diffX=-this.getMousePosition(ev).x+Math.abs(this.state.boxes[bi].left)+handleSize/2
            this.state.boxes[bi].diffY=-this.getMousePosition(ev).y+Math.abs(this.state.boxes[bi].top )+handleSize/2
            this.setState({boxes:this.state.boxes})
        }

        if(side==='nw'){
            this.state.boxes[bi].top=this.getMousePosition(ev).y
            this.state.boxes[bi].left=this.getMousePosition(ev).x-handleSize/2
            this.state.boxes[bi].diffY= Math.abs(this.state.boxes[bi].diffY)-diffY
            this.state.boxes[bi].diffX=Math.abs(this.state.boxes[bi].diffX)-diffX+handleSize/2
            this.setState({boxes:this.state.boxes})
        }

        if(side==='ne'){
            this.state.boxes[bi].top=this.getMousePosition(ev).y
            this.state.boxes[bi].diffX=-this.getMousePosition(ev).x+Math.abs(this.state.boxes[bi].left)+handleSize/2
            this.state.boxes[bi].diffY= Math.abs(this.state.boxes[bi].diffY)-diffY
            this.setState({boxes:this.state.boxes})

        }


    }

  }
  onMouseMoveOldBox=(ev,bi)=>{

    if(ev.buttons===1 && this.state.selectedBoxIndex===bi && !this.isCroppingOld){//with holding left click 


        const diffX=this.getMousePosition(ev).y-this.state.boxes[bi].top
        const diffY=this.getMousePosition(ev).x-this.state.boxes[bi].left

        if(this.state.diffMouseWithRect.x===0){
            this.setState({//selectedBoxIndex:bi,
                diffMouseWithRect:{
                    ...this.state.diffMouseWithRect,
                    x:this.getMousePosition(ev).y-this.state.boxes[bi].top,
                    y:this.getMousePosition(ev).x-this.state.boxes[bi].left
                }})

            this.isDraggingOld=true
            return;
        }
        this.state.boxes[bi].top=Math.abs(this.state.boxes[bi].top+diffX-this.state.diffMouseWithRect.x)
        this.state.boxes[bi].left=Math.abs(this.state.boxes[bi].left+diffY-this.state.diffMouseWithRect.y)

        this.setState(prv=>({boxes:prv.boxes}))
    }

  }

  onMouseMove=(ev)=>{

    ev.preventDefault()
    if(ev.buttons!==1 ) return;
    if(!this.isDraggingNew) return;
    
         
    let diffX=this.getMousePosition(ev).x-this.state.anchorX
    let diffY=this.getMousePosition(ev).y-this.state.anchorY

        if(diffX>0 && diffY>0){
            this.setState({
                top:this.state.anchorY,
                left:this.state.anchorX,
                diffX,
                diffY,
            })
        }
        if(diffX>0 && diffY<0){
            this.setState({
                top:this.state.anchorY+diffY,
                left:this.state.anchorX,
                diffX,
                diffY,
            })
        }
        if(diffX<0 && diffY>0){
            this.setState({
                top:this.state.anchorY,
                left:this.state.anchorX+diffX,
                diffX,
                diffY,
            })
        }
        if(diffX<0 && diffY<0){
            this.setState({
                top:this.state.anchorY+this.state.diffY,
                left:this.state.anchorX+this.state.diffX,
                diffX,
                diffY,
            })
        }
  }

 
adaptor=(c)=>{

    return {
        top:c.top?Math.abs(c.top)+'px':'0px',
        left:c.left?Math.abs(c.left)+'px':'0px',
        height:(!Number.isNaN(parseFloat(c.diffY))? (Math.abs(c.diffY)+'px'):'0px'),
        width:(!Number.isNaN(parseFloat(c.diffX))?  (Math.abs(c.diffX)+'px'):'0px')
    }

}

                render() {

                    const adaptored=this.adaptor(this.state)
                    return (
                    <div style={{display:'flex',flexDirection:'column',width:'100%',justifyContent:'center',alignItems:'center'}}>
                        <p>welcome reacivator!</p>
                        <input type='button' value='undo' onClick={()=>this.setState({boxes:this.state.boxes.splice(0,this.state.boxes.length-1)})}/>
                        <input type='button' value='reset' onClick={()=>this.setState({boxes:[]})}/>
                        <div 
                            ref={ref=>this.container=ref}
                            style={{backgroundColor:'gray',width:'500px',height:'500px'}}
                            onMouseDown={this.onMouseDown}
                            className={`MAIN_CONTAINER`}
                        >
                        {
                            this.state.boxes.map((b,bi)=><Cropper
                                        key={bi}
                                        zindex={bi}
                                        isDragging={this.state.selectedBoxIndex===bi && this.isDraggingOld}
                                        isCropping={this.state.selectedBoxIndex===bi && this.isCroppingOld}
                                        isSelected={this.state.selectedBoxIndex===bi}
                                        {...{...this.adaptor(b)}}
                                        onMouseMove={(ev)=>{this.onMouseMoveOldBox(ev,bi)}}
                                        onMouseUp={(ev)=>{
                                            this.isDraggingOld=false
                                            this.isCroppingOld=false;
                                            this.setState({diffMouseWithRect:{x:0,y:0,h:0,w:0}})
                                        }}
                                        onCroping={(ev,side)=>{
                                            this.isCroppingOld=true
                                            this.onCropingOld(ev,bi,side)
                                        }}
                                        onSelectBox={()=>{
                                            !this.isDraggingOld && this.setState({selectedBoxIndex:bi})
                                        }}
                                    />
                            )
                        }
                        {
                            this.isDraggingNew 
                            && 
                            <Cropper
                                {...{...adaptored}}
                            />
                        }
                        {
                            this.debugMode && (()=>{
                                console.clear()
                                console.table(this.state.boxes) 
                                //console.table(this.state.diffMouseWithRect) 
                            })() 
                        }
                        </div>
                    </div>
                    )
                }
}
export default App;