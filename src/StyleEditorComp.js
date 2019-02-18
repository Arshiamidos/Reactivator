import React from 'react';

class App extends React.PureComponent {
	
	render() {
			return (
                <input  
                type="button"
                value={this.props.type}
                onClick={()=>{this.props.getComp({
                    type:this.props.type,
                    data:{
                        top:0,
                        left:0,
                        height:50,
                        width:50,
                    },
                    props:{}
                    
                })}}
                style={{backgroundColor:'#f2f3f1',width:'100%',height:'30px'}}/>
			);
		
	}
}
export default App;
