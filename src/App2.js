import React from 'react';
import Reactivator from './Container'
import './App.css';

class App extends React.Component {
  
  
  state={
    p1x:0,
    p1y:0,

    px:0,
    py:0,
  }
  componentDidMount(){

  }
  
  
  render() {
    return (
          <div
          onMouseDown={ev=>this.setState({p1x:ev.pageX,p1y:ev.pageY})} 
          onMouseMove={(ev)=>{this.setState({px:ev.pageX,py:ev.pageY})}}
          style={{width:'500px',height:`500px`,backgroundColor:'#fabc00',display:'flex'}}>
            <svg style={{backgroundColor:'red',width:'100%',height:'100%'}}>
            <circle cx={`${this.state.px/2}`} cy={`${this.state.py/2}`} r={"5"} stroke="black" stroke-width="3" fill="red" />
            <circle cx={`0`} cy={`${this.state.py}`} r={"5"} stroke="black" stroke-width="3" fill="red" />
              <path
              className='path'
              style={{border:'1px dashed #f0f'}}
              id="test" d={`M ${this.state.p1x},${this.state.p1y} 
                                  C ${this.state.p1x+(this.state.px-this.state.p1x)/2},${this.state.p1y} 
                                  ${this.state.px-(this.state.px-this.state.p1x)/2},${this.state.py} 
                                  ${this.state.px},${this.state.py}`} fill="none" stroke="black"/>
            </svg>
            {this.state.px+"px : "+this.state.py+"px"} 
          </div>
    );
  }


}

export default App;
