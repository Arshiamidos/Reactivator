import React, { Component } from 'react';
import cssKeys from './cssKeys'

class App extends Component {
  

  state={
        _styles:this.props.data,
        newStyleKey:'',
        newStyleValue:'',
  }

  componentWillReceiveProps=(nxp)=>{
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

        
        </div>
    )
  }
}
export default App;