import React from 'react';
import Cropper from './Cropper'
import './App.css'

class App extends React.Component {
  constructor() {
    super();

    this.debugMode=true;

    this.isDraggingOld=false;
    this.isDraggingNew=false;

    this.state={
        anchorX:null,
        anchorY:null,
        diffX:null,
        diffY:null,
        top:null,
        left:null,
        diffMouseWithRect:{
            x:0,
            y:0
        },
        selectedBoxIndex:-1,
        boxes:[],


    }
  }


  componentDidMount(){
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
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
                        isDragging={this.state.diffMouseWithRect.x>0}
                        //ref={ref=>this['cropper_'+bi]=ref}
                        isSelected={this.state.selectedBoxIndex===bi}
                        {...{...this.adaptor(b)}}
                        onMouseMove={(ev)=>{
                            if(ev.buttons===1 && this.state.selectedBoxIndex===bi){//with holding left click 


                                const diffX=this.getMousePosition(ev).y-this.state.boxes[bi].top
                                const diffY=this.getMousePosition(ev).x-this.state.boxes[bi].left

                                if(this.state.diffMouseWithRect.x===0){
                                    this.setState({
                                        //selectedBoxIndex:bi,
                                        diffMouseWithRect:{
                                            x:this.getMousePosition(ev).y-this.state.boxes[bi].top,
                                            y:this.getMousePosition(ev).x-this.state.boxes[bi].left
                                        }})
                                    return;
                                }
                                this.isDraggingOld=true
                               
            this.state.boxes[bi].top=Math.abs(this.state.boxes[bi].top+diffX-this.state.diffMouseWithRect.x)
            this.state.boxes[bi].left=Math.abs(this.state.boxes[bi].left+diffY-this.state.diffMouseWithRect.y)
            
                                this.setState(prv=>({boxes:prv.boxes}))
                            }
                        }}
                        onMouseUp={(ev)=>{
                            this.isDraggingOld=false
                            this.setState({diffMouseWithRect:{x:0,y:0}})
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
                //console.clear()
                /* console.table({...{...adaptored},
                    isDraggingNew:this.isDraggingNew,
                    isDraggingOld:this.isDraggingOld,
                })
                console.table(this.state.boxes) */
            })() 
        }
        </div>
      </div>
    )
  }
}
export default App;