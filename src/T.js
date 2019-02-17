import React from 'react'

export default class TT extends React.Component {

    constructor(prop){
        super(prop);
        this.state={
            data:{
                width:'50px',
                height:'50px',
                backgroundColor:'orange',
            }
        }
    }

    setStyle=(data)=>{
        
        this.setState({
                width:'50px',
                height:'50px',
                backgroundColor:'orange',
                ...data
        })
    }
    getStyles=()=>{
        alert('from child')
        return this.state.data
    }
     

/*     key:this.props.autoIncreament,
    style:{width:'50px',height:'50px',backgroundColor:'magenta'},
    onMouseDown:ev=>{
        ev.stopPropagation();
        this.props.setRef(this.props.autoIncreament)
    },
    ref:r=>this.props._onRefChild(r,this.props.autoIncreament),
 */

    render() {
        return ( React.createElement(this.props.t.type,{})  );
    }

}