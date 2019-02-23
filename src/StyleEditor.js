import React, { Component } from 'react';
import Comp from './StyleEditorComp'
import tags from './utils/tags.json'
class App extends Component {
  

  state={
        _styles:this.props.data,
        _attribs:this.props.attribs,
        newStyleKey:'',
        newStyleValue:'',
        newAttribKey:'',
        newAttribValue:'',
  }

  componentWillReceiveProps=(nxp)=>{
      this.setState({
          _styles:nxp.data,
        _attribs:nxp.attribs
      })
  }
  
  render() {
    return (
        <div style={{
            display:'flex',
            flexDirection:'column',
            backgroundColor:'yellow',
            width:'30%',
            height:'100vh',
            overflow:'scroll',
        }}>
        {
            this.props.selectedIndex
        }
            {
                Object.keys(this.state._styles).map((k,ki)=>{
                    return (
                        <div key={ki} className='frcc' style={{width:'100%',}}>
                            <div style={{flex:1}}> {k}</div>
                            <input 
                              type="text"
                              value={this.state._styles[k]}
                              style={{flex:1,}}
                              onChange={(e)=>
                                    this.setState({_styles:{...this.state._styles,[k]:e.target.value}})}
                                />
                              
                           
                        </div>
                    )
                })
            }
            <input type="text" value={this.state.newStyleKey} onChange={(ev)=>this.setState({newStyleKey:ev.target.value})}/>
            <input type="text" value={this.state.newStyleValue} onChange={(ev)=>this.setState({newStyleValue:ev.target.value})}/>

           
            <input type='button' value='confirm styles' onClick={()=>{

                    let newStyle={}
                    if(this.state.newStyleKey.trim().length>0){
                        newStyle={[this.state.newStyleKey]:this.state.newStyleValue}
                    }
                    this.props.onConfirm({...this.state._styles,...newStyle})
                
                }}/>

            <hr/>...<hr/>

            {
                Object.keys(this.state._attribs).map((k,ki)=>{
                    return (
                        <div key={ki} className='frcc' style={{width:'100%',}}>
                            <div style={{flex:1}}> {k}</div>
                            <input 
                              type="text"
                              value={this.state._attribs[k]}
                              style={{flex:1,}}
                              onChange={(e)=>
                                    this.setState({_attribs:{...this.state._attribs,[k]:e.target.value}})}
                                />
                              
                           
                        </div>
                    )
                })
            }

            <input type="text" value={this.state.newAttribKey} onChange={(ev)=>this.setState({newAttribKey:ev.target.value})}/>
            <input type="text" value={this.state.newAttribValue} onChange={(ev)=>this.setState({newAttribValue:ev.target.value})}/>

            <input type='button' value='confirm attributes' onClick={()=>{

                let newAttribs={}
                if(this.state.newAttribKey.trim().length>0){
                    newAttribs={[this.state.newAttribKey]:this.state.newAttribValue}
                }
                this.props.onConfirmAttributes({...this.state._attribs,...newAttribs})

                }}
            />

            <hr/>...<hr/>

            {
                tags.map((i,ii)=><Comp key={"k"+ii} getComp={(T)=>this.props.onDragTemplate(T)} type={i} /> )
            }
          {/*   
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='p' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='ul' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='li' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='img' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='input' /> 
 */}

            cutome components:
            <Comp getComp={(T)=>this.props.onDrageCustom(T)} type='Custome' /> 



        
        </div>
    )
  }
}
export default App;