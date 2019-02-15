import React from 'react';

class App extends React.PureComponent {
  

  render() {
      const {data}=this.props
    return (
    <div style={{backgroundColor:'red',display:'flex',flexDirection:'row',width:'100%',height:'50px',}}>
					
        {/*   {data.visible}
{data.lock}
{data.name} */}
        <div className='frcc border-dashed' style={{flex:1}}>
          <input type="button" value="visible" onClick={()=>{

          }}/>
        </div>

         <div className='frcc border-dashed' style={{flex:1}}>
          <input type="button" value="lock" onClick={()=>{

          }}/>
        </div>
        
        <div className='frcc border-dashed' style={{flex:10}}>
          {data.name}
        </div>

        <div className='frcc border-dashed' style={{flex:10}}>
          {data.name}
        </div>
        
    </div>
    )
  }
}
export default App;