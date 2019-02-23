import React, { Component } from 'react';

class App extends Component {
 
  constructor(){
    super();
      this.state={
        message:'hello custom code !',
      }
      setInterval(() => {
        this.marquee()
      }, 500);

  }

  marquee=()=>{
    const l=this.state.message.length
    this.setState({
      message:this.state.message[l-1]+this.state.message.slice(0,l-1)
    })
  }


  render() {

//if u define a custom component, it will show as you mentioned for container 
//that means if style.with:100% it will responsive with parent element , otherwise it will static format
    return (
      <p 
      style={{backgroundColor:'red',width:'100%',height:'100%'}}
      onClick={()=>alert('hello alert from custome code \n it has no side effect')}>
          {this.state.message}
      </p>
    )
  }
}
export default App;