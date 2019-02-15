import React from 'react';
import style from './style'
class App extends React.Component {
	constructor() {
        super();
        
        this.isDragging=false;

		this.state = {
			customStyle: {},
            _customeStringStyle: '',
		};
    }
    
	renderHandles () {
		return (
			<div>
				<div data-dir='se' style={{...style.RegionHandleSE,cursor:this.props.isCropping?'crosshair':'se-resize'}} onMouseDown={(ev)=>this.props.onCroping(ev,'se')} />
				<div data-dir='sw' style={{...style.RegionHandleSW,cursor:this.props.isCropping?'crosshair':'sw-resize'}} onMouseDown={(ev)=>this.props.onCroping(ev,'sw')} />
				<div data-dir='nw' style={{...style.RegionHandleNW,cursor:this.props.isCropping?'crosshair':'nw-resize'}} onMouseDown={(ev)=>this.props.onCroping(ev,'nw')} />
				<div data-dir='ne' style={{...style.RegionHandleNE,cursor:this.props.isCropping?'crosshair':'ne-resize'}} onMouseDown={(ev)=>this.props.onCroping(ev,'ne')} />
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
					...{ ...this.props },
					...{ ...customStyle }
				}}
			>
			 <p>{`Reactivator_${this.props.zindex} w:${this.props.width} h:${this.props.height} t:${this.props.top} l:${this.props.left}`}</p>
				<input
					ref={r=>this.input=r}
					onClick={()=>{this.input.focus()}}
					onChange={(e) => this.setState({ _customeStringStyle: e.target.value })}
					value={this.state._customeStringStyle}
					multiple
				/>
				<input
					type={'button'}
					onClick={() => {
					
						this.setState({
							customStyle: JSON.parse(`{  ${ (this.state._customeStringStyle) }  }`)
						});
					}}
					value={'Confirm'}
				/>
				{this.props.isSelected ? this.renderHandles() : null}
			</div>
		);
	}
}
export default App;
