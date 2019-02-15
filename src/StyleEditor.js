import React, { Component } from 'react';
import cssKeys from './cssKeys'

class App extends Component {
  

  state={
        _styles:this.props.data
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

        
        </div>
    )
  }
}
export default App;