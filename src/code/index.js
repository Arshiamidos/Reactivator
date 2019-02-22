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


    return (
      <p 
      style={{backgroundColor:'red'}}
      onClick={()=>alert('hello alert from custome code \n it has no side effect')}>
          {this.state.message}
      </p>
    )
  }
}
export default App;