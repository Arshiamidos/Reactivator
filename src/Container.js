import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import _ from 'lodash';
import RowLayerItem from './RowLayerItem';
import StyleEditor from './StyleEditor';
import { getStore, setStore, deSelectionStore } from './Repository';
import Redux from './Redux';
import T from './T';
import {
	getMousePosition,
	getCurrentRefrenceStyle,
	setCurrentRefrenceStyle,
	onScrollMainContainer,
	getStyles,
	onContainerMouseDown,
	onCreating,
	onMouseUp,
	onMouseMove,
	onCroppingOld,
	onMouseMoveOldBox,



} from './utils/events'
import {showMenuItems, showLayers,showMainContainer} from './utils/ui'
class Container extends React.Component {
	constructor(props) {
		super(props);

		this.debugMode = false;
		this.R = Redux;

		this.getMousePosition=getMousePosition.bind(this)
		this.getCurrentRefrenceStyle=getCurrentRefrenceStyle.bind(this)
		this.setCurrentRefrenceStyle=setCurrentRefrenceStyle.bind(this)
		this.onScrollMainContainer=onScrollMainContainer.bind(this)
		this.onContainerMouseDown=onContainerMouseDown.bind(this)
		this.onCreating=onCreating.bind(this)
		this.getStyles=getStyles.bind(this)
		this.onMouseUp=onMouseUp.bind(this)
		this.onMouseMove=onMouseMove.bind(this)
		this.onCroppingOld=onCroppingOld.bind(this)
		this.onMouseMoveOldBox=onMouseMoveOldBox.bind(this)




		this.showMenuItems=showMenuItems.bind(this)
		this.showLayers=showLayers.bind(this)
		this.showMainContainer=showMainContainer.bind(this)




		this.state = {
			toggleLayerLine: true,
			toggleStyleEditor: true,
			toggleSnapGrid: false,
			mainContainerFlexPercent: 70,
			containerStyle: {
				zoomScale: 1.0,
				snapSize: 10,
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: window.innerHeight + 'px',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'red'
			},
			defaultStyle: {
				name: '',
				lock: false,
				visible: true,
				anchorX: null,
				anchorY: null,
				width: null,
				height: null,
				top: null,
				left: null
			},

			mouseFirstCapture: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			},
			boxes: [],
			undos: [],
			redos: []
		};
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}
		
	isValidStyle = (c) => {
		if (Number.isNaN(parseFloat(c.height)) || Math.abs(c.height) < 10 || Math.abs(c.width) < 10) return {};

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
	
	

	gridify=(pixel)=>{
		let ss = this.state.containerStyle.snapSize;
		return  parseInt(pixel / ss) * ss;
	}
	snapGridify = (data) => {
		if (this.state.toggleSnapGrid) {
			let ss = this.state.containerStyle.snapSize;
			return {
				...data,
				top: parseInt(data.top / ss) * ss,
				left: parseInt(data.left / ss) * ss,
				width: parseInt(data.width / ss) * ss,
				height: parseInt(data.height / ss) * ss
			};
		}
		return data;
	};
	

	
	addCustomChild=(t,index)=>{
		if (index === -1) {
			return;
		}
		getStore(this.R.selectedBoxIndex).addCustomChild(t, Object.keys(getStore()).length + 1);
		this.setState({
			mouseFirstCapture: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			}
		});
	}
	addChild = (t, index) => {
		if (index === -1) {
			return;
		}
		getStore(this.R.selectedBoxIndex).addChild(t, Object.keys(getStore()).length + 1);
		this.setState({
			mouseFirstCapture: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			}
		});
	};

	render() {
		/*  */
		return (
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div style={this.state.containerStyle}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							backgroundColor: 'blue',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							overflow: 'hidden',
							flex: `1 1 ${this.state.mainContainerFlexPercent}%`
						}}
					>
						{this.showMenuItems()}
						{this.showMainContainer()}
					</div>
					{this.state.toggleLayerLine && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								backgroundColor: 'green',
								width: '100%',
								overflow: 'auto',
								flex: `1 1 ${100 - this.state.mainContainerFlexPercent}%`
							}}
						>
							{this.showLayers()}
						</div>
					)}
				</div>

				{this.state.toggleStyleEditor && (
					<StyleEditor
						selectedIndex={this.R.selectedBoxIndex}
						onDragTemplate={(t) => {
							this.addChild(t, this.R.selectedBoxIndex);
						}}
						onDrageCustom={(t)=>{
							this.addCustomChild(t,this.R.selectedBoxIndex)
						}}
						data={this.getCurrentRefrenceStyle(this.R.selectedBoxIndex)}
						onConfirm={(newStyle) => {
							this.setCurrentRefrenceStyle(this.R.selectedBoxIndex, newStyle);
						}}
					/>
				)}
			</div>
		);
	}
}

export default Container;
