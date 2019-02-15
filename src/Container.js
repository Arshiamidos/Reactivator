import React from 'react';
import Cropper from './Cropper';
import './App.css';
import { handleSize } from './style';
import _ from 'lodash';

class Container extends React.Component {
	constructor() {
		super();

		this.debugMode = true;

		this.sideCropping = '';
		this.isDraggingOld = false;
		this.isDraggingNew = false;
		this.isCroppingOld = false;
		this.selectedBoxIndex = -1;

		this.state = {
			anchorX: null,
			anchorY: null,
			diffX: null,
			diffY: null,
			top: null,
			left: null,
			mouseFirstCapture: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			},
			boxes: []
		};
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	getMousePosition = (ev) => ({ x: ev.pageX, y: ev.pageY });

	onContainerMouseDown = (ev) => {
		if (ev.target.className.search('MAIN_CONTAINER') < 0) {
			//child selected
			ev.preventDefault();
			return;
		}
		this.selectedBoxIndex = -1;
		this.isDraggingNew = true;
		this.setState({
			anchorX: this.getMousePosition(ev).x,
			anchorY: this.getMousePosition(ev).y
		});
	};
	onCreating = (ev) => {
		let diffX = this.getMousePosition(ev).x - this.state.anchorX;
		let diffY = this.getMousePosition(ev).y - this.state.anchorY;

		if (diffX > 0 && diffY > 0) {
			this.setState({
				top: this.state.anchorY,
				left: this.state.anchorX,
				diffX,
				diffY
			});
		}
		if (diffX > 0 && diffY < 0) {
			this.setState({
				top: this.state.anchorY + diffY,
				left: this.state.anchorX,
				diffX,
				diffY
			});
		}
		if (diffX < 0 && diffY > 0) {
			this.setState({
				top: this.state.anchorY,
				left: this.state.anchorX + diffX,
				diffX,
				diffY
			});
		}
		if (diffX < 0 && diffY < 0) {
			this.setState({
				top: this.state.anchorY + this.state.diffY,
				left: this.state.anchorX + this.state.diffX,
				diffX,
				diffY
			});
		}
	};
	onMouseMove = (ev) => {
		if (ev.buttons === 1) {
			if (this.isDraggingOld && !this.isCroppingOld) this.onMouseMoveOldBox(ev, this.selectedBoxIndex);
			if (this.isCroppingOld) this.onCropingOld(ev, this.selectedBoxIndex, this.sideCropping);
			if (this.isDraggingNew) this.onCreating(ev);
		}
	};
	onMouseUp = (ev) => {

		this.isDraggingNew = false;
		let { diffX, diffY, top, left } = this.state;

		if (!_.isEmpty(this.adaptor(this.state)) )
			this.setState({
				boxes: [ ...this.state.boxes, { diffX, diffY, top, left } ],
				anchorX: null,
				anchorY: null,
				diffX: null,
				diffY: null,
				top: null,
				left: null
			});

	};
	
	onCropingOld = (ev, bi, side) => {
		if (this.selectedBoxIndex === bi) {
			

			const diffY = this.getMousePosition(ev).y - this.state.boxes[bi].top;
			const diffX = this.getMousePosition(ev).x - this.state.boxes[bi].left;

			if (side === 'sw') {
				
				 this.setState({boxes:[
					 ...this.state.boxes.splice(0,this.selectedBoxIndex-1),
					 {
						...this.state.boxes[this.selectedBoxIndex],
						left : this.getMousePosition(ev).x ,
						diffY : this.getMousePosition(ev).y - this.state.boxes[bi].top, 
						diffX : Math.abs(this.state.boxes[bi].diffX) - diffX ,
					 },
					 ...this.state.boxes.splice(this.selectedBoxIndex+1)
				 ]})
					
				
				
			}else if (side === 'se') {

				this.setState({boxes:[
					...this.state.boxes.splice(0,this.selectedBoxIndex-1),
					{
					   ...this.state.boxes[this.selectedBoxIndex],
					   diffX :-this.getMousePosition(ev).x + Math.abs(this.state.boxes[bi].left),
					   diffY :-this.getMousePosition(ev).y + Math.abs(this.state.boxes[bi].top)
					},
					...this.state.boxes.splice(this.selectedBoxIndex+1)
				]})
			}else if (side === 'nw') {
				
				this.setState({boxes:[
					...this.state.boxes.splice(0,this.selectedBoxIndex-1),
					{
					   ...this.state.boxes[this.selectedBoxIndex],
					   top : this.getMousePosition(ev).y,
					   left : this.getMousePosition(ev).x,
					   diffY : Math.abs(this.state.boxes[bi].diffY) - diffY,
					   diffX : Math.abs(this.state.boxes[bi].diffX) - diffX,
					},
					...this.state.boxes.splice(this.selectedBoxIndex+1)
				]})
			}else if (side === 'ne') {

				this.setState({boxes:[
					...this.state.boxes.splice(0,this.selectedBoxIndex-1),
					{
					   ...this.state.boxes[this.selectedBoxIndex],
					   top : this.getMousePosition(ev).y,
					   diffX :-this.getMousePosition(ev).x + Math.abs(this.state.boxes[bi].left),
					   diffY : Math.abs(this.state.boxes[bi].diffY) - diffY,
					},
					...this.state.boxes.splice(this.selectedBoxIndex+1)
				]})
				
			}
		}
	};
	onMouseMoveOldBox = (ev, bi) => {
		if ( this.selectedBoxIndex === bi ) {
			
			if (this.state.mouseFirstCapture.x === 0) {
				this.setState({
					mouseFirstCapture: {
						...this.state.mouseFirstCapture,
						y: this.getMousePosition(ev).y - this.state.boxes[bi].top,
						x: this.getMousePosition(ev).x - this.state.boxes[bi].left
					}
				});
				return;
			}
			this.state.boxes[bi].top = Math.abs(this.getMousePosition(ev).y - this.state.mouseFirstCapture.y);
			this.state.boxes[bi].left = Math.abs(this.getMousePosition(ev).x - this.state.mouseFirstCapture.x);

			this.setState((prv) => ({ boxes: prv.boxes }));
		}
	};

	adaptor = c => {
		if (Number.isNaN(parseFloat(c.diffY))) return ({});
		return {
			top: c.top ? Math.abs(c.top) + 'px' : '0px',
			left: c.left ? Math.abs(c.left) + 'px' : '0px',
			height: !Number.isNaN(parseFloat(c.diffY)) ? Math.abs(c.diffY) + 'px' : '0px',
			width: !Number.isNaN(parseFloat(c.diffX)) ? Math.abs(c.diffX) + 'px' : '0px'
		};
	};

	render() {
		const adaptored = this.adaptor(this.state);
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<p>Welcome Reacivator!</p>
				<input
					type="button"
					value="undo"
					onClick={() => this.setState({ boxes: this.state.boxes.splice(0, this.state.boxes.length - 1) })}
				/>
				<input type="button" value="reset" onClick={() => this.setState({ boxes: [] })} />
				<div
					ref={(ref) => (this.container = ref)}
					style={{ backgroundColor: 'gray', width: '500px', height: '500px' }}
					onMouseDown={this.onContainerMouseDown}
					className={`MAIN_CONTAINER`}
				>
					{this.state.boxes.map((b, bi) => (
						<Cropper
							key={bi}
							zindex={bi}
							isDragging={this.selectedBoxIndex === bi && this.isDraggingOld}
							isCropping={this.selectedBoxIndex === bi && this.isCroppingOld}
							isSelected={this.selectedBoxIndex === bi}
							{...{ ...this.adaptor(b) }}
							onMouseUp={(ev) => {
								this.isDraggingOld = false;
								this.isCroppingOld = false;
								this.sideCropping = '';
								this.setState({ mouseFirstCapture: { x: 0, y: 0, h: 0, w: 0 } });
							}}
							onCroping={(ev, side) => {
								this.isCroppingOld = true;
								this.sideCropping = side;
								this.selectedBoxIndex = bi;
							}}
							onSelectBox={() => {
								this.selectedBoxIndex = bi;
								this.isDraggingOld = true;
							}}
						/>
					))}
					{this.isDraggingNew && !_.isEmpty(adaptored) && <Cropper {...{ ...adaptored }} />}
					{this.debugMode &&
						(() => {
							console.clear();
							console.table(this.state.boxes);
						})()}
				</div>
			</div>
		);
	}
}
export default Container;
