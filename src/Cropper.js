import React from 'react';
import style from './CropperStyle'
import T from './T'
class App extends React.Component {
	constructor(props) {
    super(props);
        
    this.isDragging=false;

		this.state = {
			data:props.data,
			childrens:[],
			customStyle: {},
            _customeStringStyle: '',
		};
    }
	getStyles=()=>{
			return this.state.data
	}
	setStyle=(data)=>{
		this.setState({data})
	}
	adaptor = (c={}) => {
		
		if ( Number.isNaN(parseFloat(c.diffY)) ||
			Math.abs(c.diffY)<10 ||
			Math.abs(c.diffX)<10  
		)
		return ({});

		return {
			...c,
			name:c.name,
			lock:c.lock,
			visible:c.visible,
			top: c.top ? Math.abs(c.top) + 'px' : '0px',
			left: c.left ? Math.abs(c.left) + 'px' : '0px',
			height: !Number.isNaN(parseFloat(c.diffY)) ? Math.abs(c.diffY) + 'px' : '0px',
			width: !Number.isNaN(parseFloat(c.diffX)) ? Math.abs(c.diffX) + 'px' : '0px'
		};
	};
	
	


	addChild=(t,autoIncreament,setRef)=>{

		

		this.setState({childrens:[...this.state.childrens,
		<T  
			t={t}
			autoIncreament={autoIncreament} 
			setRef={setRef} 
			_onRefChild={this.props.onRefChild}/>]})

	}
	
	renderHandles () {
		const {isCropping,onCroping}=this.props
		return (
			<div>
				<div data-dir='ss'  style={{...style.RegionLineS,cursor:isCropping?'s-resize':'row-resize'}}   onMouseDown={(ev)=>onCroping(ev,'ss')} />
				<div data-dir='ww'  style={{...style.RegionLineW,cursor:isCropping?'w-resize':'col-resize'}}   onMouseDown={(ev)=>onCroping(ev,'ww')} />
				<div data-dir='ee'  style={{...style.RegionLineE,cursor:isCropping?'e-resize':'col-resize'}}   onMouseDown={(ev)=>onCroping(ev,'ee')} />
				<div data-dir='nn'  style={{...style.RegionLineN,cursor:isCropping?'n-resize':'row-resize'}}   onMouseDown={(ev)=>onCroping(ev,'nn')} />

				<div data-dir='se' style={{...style.RegionHandleSE,cursor:isCropping?'crosshair':'se-resize'}} onMouseDown={(ev)=>onCroping(ev,'se')} />
				<div data-dir='sw' style={{...style.RegionHandleSW,cursor:isCropping?'crosshair':'sw-resize'}} onMouseDown={(ev)=>onCroping(ev,'sw')} />
				<div data-dir='nw' style={{...style.RegionHandleNW,cursor:isCropping?'crosshair':'nw-resize'}} onMouseDown={(ev)=>onCroping(ev,'nw')} />
				<div data-dir='ne' style={{...style.RegionHandleNE,cursor:isCropping?'crosshair':'ne-resize'}} onMouseDown={(ev)=>onCroping(ev,'ne')} />
			</div>
		);
	}

	render() {
		const { customStyle } = this.state;
		return (
			<div
				onMouseDown={()=>this.props.onSelectBox()}
				onMouseUp={this.props.onMouseUp}
				className={`CROPPER ${this.props.isSelected?'border':''} `}
				style={{
					border: '1px dashed black',
					backgroundColor: 'yellow',
					position: 'absolute',
					cursor: (this.props.isDragging?'grabbing':'grab'),
					zIndex: (this.props.isSelected?10000:this.props.zindex),
					...{ ...this.adaptor(this.state.data) },
					...{ ...customStyle }
				}}
			>
			 <p>{`Reactivator_${this.props.zindex} w:${this.state.data.diffX} h:${this.state.data.diffY} t:${this.state.data.top} l:${this.state.data.left}`}</p>
			 
			
			 {this.props.isSelected ? this.renderHandles() : null}
			 {this.state.childrens}
			</div>
		);
	}
}
export default App;
