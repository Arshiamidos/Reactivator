import React from 'react';
import style from './CropperStyle'
import T from './T'
import {getStore,setStore} from './Repository'
import './App.css';
import Redux from './Redux'
import { changeConfirmLocale } from 'antd/lib/modal/locale';

class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.R=Redux;
		this.state = {
			data: props.data,
			childrens: [],
			isSelected:false,
			isDragging:false,
		};
	}
	componentWillReceiveProps(nxp){
		this.setState({data:nxp.data})
	}
	getStyles = () => {
		return this.state.data
	}
	setSelected=(toggle=undefined)=>{
		if(!toggle){
			this.setState({
				isDragging:false,
				isSelected:false,
			})
			return;
		}
		
		this.setState({
			isDragging:true,
			isSelected:true
		})
	}
	setStyles = (data) => {
		this.setState({ data:{...this.state.data,...data} })
	}
	adaptor = (c = {}) => {

		if (Number.isNaN(parseFloat(c.height)) ||
			Math.abs(c.height) < 10 ||
			Math.abs(c.width) < 10
		)
			return ({});

		return {
			...c,
			name: c.name,
			lock: c.lock,
			visible: c.visible,
			top: c.top ? Math.abs(c.top) + 'px' : '0px',
			left: c.left ? Math.abs(c.left) + 'px' : '0px',
			height: !Number.isNaN(parseFloat(c.height)) ? Math.abs(c.height) + 'px' : '0px',
			width: !Number.isNaN(parseFloat(c.width)) ? Math.abs(c.width) + 'px' : '0px'
		};
	};




	addChild = (t, lastIndex, updateSelectedBoxIndex, setRef) => {

		this.setState({
			childrens: [...this.state.childrens,

			<T
				key={lastIndex}
				t={t}
				autoIncreament={lastIndex}
				onMouseDown={ev => {
					ev.stopPropagation();
					this.R.selectedBoxIndex=lastIndex
					getStore(lastIndex).setSelected(true)
					this.R.isDraggingOld = true;
				}}
				ref={r => setStore(lastIndex,r)}
				zindex={lastIndex}
				onRefChild={(ref,ai)=>setStore(ai,ref)}

				isDragging={this.R.selectedBoxIndex === lastIndex && this.R.isDraggingOld}
				isCropping={this.R.selectedBoxIndex === lastIndex && this.R.isCroppingOld}
				isSelected={this.R.selectedBoxIndex === lastIndex}
				
				onMouseUp={(ev) => {
					ev.stopPropagation();
					this.R.isDraggingOld = false;
					this.R.isCroppingOld = false;
					this.R.sideCropping = '';
				}}
				onCroping={(ev, side) => {
					ev.stopPropagation();
					this.R.isCroppingOld = true;
					this.R.sideCropping = side;
					this.R.selectedBoxIndex = lastIndex;
				}}
			/>
			]
		})


		

	}

	renderHandles() {
		const { isCropping, onCroping } = this.props
		return (
			<div>
				<div data-dir='ss' style={{ ...style.RegionLineS, cursor: isCropping ? 's-resize' : 'row-resize' }} onMouseDown={(ev) => onCroping(ev, 'ss')} />
				<div data-dir='ww' style={{ ...style.RegionLineW, cursor: isCropping ? 'w-resize' : 'col-resize' }} onMouseDown={(ev) => onCroping(ev, 'ww')} />
				<div data-dir='ee' style={{ ...style.RegionLineE, cursor: isCropping ? 'e-resize' : 'col-resize' }} onMouseDown={(ev) => onCroping(ev, 'ee')} />
				<div data-dir='nn' style={{ ...style.RegionLineN, cursor: isCropping ? 'n-resize' : 'row-resize' }} onMouseDown={(ev) => onCroping(ev, 'nn')} />

				<div data-dir='se' style={{ ...style.RegionHandleSE, cursor: isCropping ? 'crosshair' : 'se-resize' }} onMouseDown={(ev) => onCroping(ev, 'se')} />
				<div data-dir='sw' style={{ ...style.RegionHandleSW, cursor: isCropping ? 'crosshair' : 'sw-resize' }} onMouseDown={(ev) => onCroping(ev, 'sw')} />
				<div data-dir='nw' style={{ ...style.RegionHandleNW, cursor: isCropping ? 'crosshair' : 'nw-resize' }} onMouseDown={(ev) => onCroping(ev, 'nw')} />
				<div data-dir='ne' style={{ ...style.RegionHandleNE, cursor: isCropping ? 'crosshair' : 'ne-resize' }} onMouseDown={(ev) => onCroping(ev, 'ne')} />
			</div>
		);
	}

	render() {


		return (
			<div
				onMouseDown={() => this.props.onSelectBox()}
				onMouseUp={this.props.onMouseUp}
				className={`CROPPER ${this.state.isSelected ? 'border' : ''} `}
				style={{
					border: '1px dashed black',
					backgroundColor: 'yellow',
					position: 'absolute',
					cursor: (this.state.isDragging ? 'grabbing' : 'grab'),
					zIndex: (this.state.isSelected ? 10000 : this.props.zindex),
					...{ ...this.adaptor(this.state.data) },
				}}
			>
				<p>{`Reactivator_${this.props.zindex} w:${this.state.data.width} h:${this.state.data.height} t:${this.state.data.top} l:${this.state.data.left}`}</p>


				{this.state.isSelected ? this.renderHandles() : null}
				{this.state.childrens}
			</div>
		);
	}
}
export default App;
