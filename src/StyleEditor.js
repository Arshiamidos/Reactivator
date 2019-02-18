import React, { Component } from 'react';
import cssKeys from './cssKeys'
import Comp from './StyleEditorComp'

class App extends Component {
  

  state={
        _styles:this.props.data,
        newStyleKey:'',
        newStyleValue:'',
  }

  componentWillReceiveProps=(nxp)=>{
      console.log('update data style editor')
      this.setState({_styles:nxp.data})
  }
  
  render() {
    return (
        <div style={{
            display:'flex',
            flexDirection:'column',
            backgroundColor:'yellow',
            width:'30%',
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

            <input type='button' value='confirm' onClick={()=>{

                    let newStyle={}
                    if(this.state.newStyleKey.trim().length>0){
                        newStyle={[this.state.newStyleKey]:this.state.newStyleValue}
                    }
                    this.props.onConfirm({...this.state._styles,...newStyle})
                
                }}/>

            <hr/>
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='div' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='p' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='ul' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='li' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='input' /> 
            <Comp getComp={(T)=>this.props.onDragTemplate(T)} type='p' /> 




        
        </div>
    )
  }
}
export default App;