import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import _ from 'lodash';
import RowLayerItem from './RowLayerItem';
import StyleEditor from './StyleEditor';
import { getStore, setStore, deSelectionStore } from './Repository';
import Redux from './Redux';
import T from './T';

class Container extends React.Component {
	constructor(props) {
		super(props);

		this.debugMode = false;
		this.R = Redux;

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
	setCurrentRefrenceStyle = (index, newStyle) => {
		if (index === -1) {
			this.setState({
				containerStyle: {
					...this.state.containerStyle,
					...newStyle
				}
			});
		} else {
			if (getStore(index)) {
				getStore(index).setStyles(newStyle);
			} else throw new Error('Index Not Found ' + __filename + ':83');
		}
	};
	getCurrentRefrenceStyle = (index) => {
		if (index === -1) return this.getStyles();
		else {
			//main container
			if (getStore(index)) {
				JSON.stringify(getStore(index).getStyles());
				return getStore(index).getStyles();
			} else {
				return {};
			}
		}
	};
	onScrollMainContainer = (ev) => {
		if (this.state.containerStyle.zoomScale >= 0.5 && this.state.containerStyle.zoomScale <= 2.0) {
			this.setState({
				containerStyle: {
					...this.state.containerStyle,
					zoomScale: _.clamp(this.state.containerStyle.zoomScale + Math.sign(ev.deltaY) * 1 / 10, 0.5, 2.0)
				}
			});
		}
	};
	getStyles = () => {
		return this.state.containerStyle;
	};
	getMousePosition = (ev) => ({ x: ev.pageX, y: ev.pageY });
	onContainerMouseDown = (ev) => {
		if (ev.target.className.search('MAIN_CONTAINER') < 0) {
			//child selected
			ev.preventDefault();
			return;
		}
		if (this.R.selectedBoxIndex >= 0) {
			getStore(this.R.selectedBoxIndex).setSelected(false);
		}
		this.R.selectedBoxIndex = -1;
		this.R.isDraggingNew = true;
		this.setState({
			defaultStyle: {
				...this.state.defaultStyle,
				anchorX: this.getMousePosition(ev).x - this.container.getBoundingClientRect().left,
				anchorY: this.getMousePosition(ev).y - this.container.getBoundingClientRect().top
			}
		});
	};
	onCreating = (ev) => {
		let width =
			this.getMousePosition(ev).x - this.container.getBoundingClientRect().left - this.state.defaultStyle.anchorX;

		let height =
			this.getMousePosition(ev).y - this.container.getBoundingClientRect().top - this.state.defaultStyle.anchorY;

		if (width > 0 && height > 0) {
			this.setState({
				defaultStyle: {
					...this.state.defaultStyle,
					top: this.state.defaultStyle.anchorY,
					left: this.state.defaultStyle.anchorX,
					width,
					height
				}
			});
		}
		if (width > 0 && height < 0) {
			this.setState({
				defaultStyle: {
					...this.state.defaultStyle,
					top: this.state.defaultStyle.anchorY + height,
					left: this.state.defaultStyle.anchorX,
					width,
					height
				}
			});
		}
		if (width < 0 && height > 0) {
			this.setState({
				defaultStyle: {
					...this.state.defaultStyle,
					top: this.state.defaultStyle.anchorY,
					left: this.state.defaultStyle.anchorX + width,
					width,
					height
				}
			});
		}
		if (width < 0 && height < 0) {
			this.setState({
				defaultStyle: {
					...this.state.defaultStyle,
					top: this.state.defaultStyle.anchorY + this.state.defaultStyle.height,
					left: this.state.defaultStyle.anchorX + this.state.defaultStyle.width,
					width,
					height
				}
			});
		}
	};
	onMouseMove = (ev) => {
		if (ev.buttons === 1) {
			if (this.R.isDraggingOld && !this.R.isCroppingOld) this.onMouseMoveOldBox(ev, this.R.selectedBoxIndex);
			if (this.R.isCroppingOld) this.onCroppingOld(ev, this.R.selectedBoxIndex, this.R.sideCropping);
			if (this.R.isDraggingNew) this.onCreating(ev);
		}
	};
	onMouseUp = (ev) => {
		this.R.isDraggingNew = false;

		if (!_.isEmpty(this.isValidStyle(this.state.defaultStyle))) {
			const lastIndex = this.state.boxes.length;

			this.setState({
				boxes: [
					...this.state.boxes,
					<T
						key={lastIndex}
						t={{
							type: 'div',
							data: {
								...this.state.defaultStyle,
								width: Math.abs(this.state.defaultStyle.width),
								height: Math.abs(this.state.defaultStyle.height)
							}
						}}
						autoIncreament={lastIndex}
						onMouseDown={(ev) => {
							ev.stopPropagation();
							deSelectionStore();
							this.R.selectedBoxIndex = lastIndex;
							getStore(lastIndex).setSelected(true);
							this.R.isDraggingOld = true;
							//for parent to this.forceUpdate tricky because it's a refrence that don't apply on main renderer
							this.setState({
								mouseFirstCapture: {
									x: 0,
									y: 0,
									w: 0,
									h: 0
								}
							});
						}}
						startPropagtion={() => {
							this.setState({});
						}} //for child call to update main renderer
						resetMouseFirstCapture={() => {
							this.setState({ mouseFirstCapture: { x: 0, y: 0, w: 0, h: 0 } });
						}}
						ref={(r) => setStore(lastIndex, r)}
						zindex={lastIndex}
						onRefChild={(ref, ai) => setStore(ai, ref)}
						isDragging={this.R.selectedBoxIndex === lastIndex && this.R.isDraggingOld}
						isCropping={this.R.selectedBoxIndex === lastIndex && this.R.isCroppingOld}
						isSelected={this.R.selectedBoxIndex === lastIndex}
						onMouseUp={(ev) => {
							ev.stopPropagation();
							this.R.isDraggingOld = false;
							this.R.isCroppingOld = false;
							this.R.sideCropping = '';
							this.setState({
								mouseFirstCapture: {
									x: 0,
									y: 0,
									w: 0,
									h: 0
								}
							});
						}}
						onCroping={(ev, side) => {
							ev.stopPropagation();
							this.R.isDraggingOld = false;
							this.R.isCroppingOld = true;
							this.R.sideCropping = side;
							this.R.selectedBoxIndex = lastIndex;
							this.setState({});
						}}
					/>
				],

				defaultStyle: {
					...this.state.defaultStyle,
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
				}
			});
		}
	};
	onCroppingOld = (ev, boxIndex, side) => {
		if (this.R.selectedBoxIndex === boxIndex) {
			console.log(this.getMousePosition(ev));

			let { x, y, w, h, t, l } = this.state.mouseFirstCapture;
			if (x + y + w + h === 0) {
				this.setState({
					mouseFirstCapture: {
						...this.state.mouseFirstCapture,
						y: Math.abs(this.getMousePosition(ev).y),
						x: Math.abs(this.getMousePosition(ev).x),
						t: Math.abs(getStore(boxIndex).getStyles().top),
						l: Math.abs(getStore(boxIndex).getStyles().left),
						w: Math.abs(getStore(boxIndex).getStyles().width),
						h: Math.abs(getStore(boxIndex).getStyles().height)
					}
				});
				return;
			}

			const deltaY = this.getMousePosition(ev).y - y;
			const deltaX = this.getMousePosition(ev).x - x;

			if (side === 'ss') {
				getStore(boxIndex).setStyles({
					height: Math.abs(deltaY + h)
				});
			} else if (side === 'ww') {
				getStore(boxIndex).setStyles({
					left: Math.abs(deltaX + l),
					width: Math.abs(deltaX - w)
				});
			} else if (side === 'nn') {
				getStore(boxIndex).setStyles({
					top: Math.abs(deltaY + t),
					height: Math.abs(deltaY - h)
				});
			} else if (side === 'ee') {
				getStore(boxIndex).setStyles({
					width: Math.abs(deltaX + w)
				});
			} else if (side === 'sw') {
				getStore(boxIndex).setStyles({
					left: Math.abs(deltaX + l),
					width: Math.abs(deltaX - w),
					height: Math.abs(deltaY + h)
				});
			} else if (side === 'se') {
				getStore(boxIndex).setStyles({
					width: Math.abs(deltaX + w),
					height: Math.abs(deltaY + h)
				});
			} else if (side === 'nw') {
				getStore(boxIndex).setStyles({
					left: Math.abs(deltaX + l),
					width: Math.abs(deltaX - w),
					top: Math.abs(deltaY + t),
					height: Math.abs(deltaY - h)
				});
			} else if (side === 'ne') {
				getStore(boxIndex).setStyles({
					width: Math.abs(deltaX + w),
					top: Math.abs(deltaY + t),
					height: Math.abs(deltaY - h)
				});
			}
		}
	};
	onMouseMoveOldBox = (ev, bi) => {
		if (this.R.selectedBoxIndex === bi) {
			if (this.state.mouseFirstCapture.x === 0) {
				this.setState({
					mouseFirstCapture: {
						...this.state.mouseFirstCapture,
						y: this.getMousePosition(ev).y - getStore(bi).getStyles().top,
						x: this.getMousePosition(ev).x - getStore(bi).getStyles().left
					}
				});
				return;
			}
			getStore(bi).setStyles({
				...getStore(bi).getStyles(),
				top: Math.abs(this.getMousePosition(ev).y - this.state.mouseFirstCapture.y),
				left: Math.abs(this.getMousePosition(ev).x - this.state.mouseFirstCapture.x)
			});
		}
	};
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
	showMenuItems = () => {
		return (
			<div>
				<p>Welcome Reacivator!</p>
				<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '500px' }}>
					<input
						type="button"
						value="remove selected"
						onClick={() => {
							if (this.R.selectedBoxIndex === -1) {
								return;
							}
							this.setState(
								{
									boxes: [
										...this.state.boxes.slice(0, this.R.selectedBoxIndex),
										...this.state.boxes.slice(this.R.selectedBoxIndex + 1)
									]
								},
								() => {
									this.R.selectedBoxIndex = -1;
								}
							);
						}}
					/>
					<input
						type="button"
						value={`toggle Style Editor: ${this.state.toggleStyleEditor + ''}`}
						onClick={() => {
							this.setState({ toggleStyleEditor: !this.state.toggleStyleEditor });
						}}
					/>
					<input
						type="button"
						value={`Zoom Factor: ${this.state.containerStyle.zoomScale + ''}`}
						onClick={() => {
							this.setState({ containerStyle: { ...this.state.containerStyle, zoomScale: 1 } });
						}}
					/>

					<input
						type="button"
						value={`toggle Layer Editor: ${this.state.toggleLayerLine + ''}`}
						onClick={() => {
							this.setState({ toggleLayerLine: !this.state.toggleLayerLine });
						}}
					/>

					<input
						type="button"
						value={`toggle Snap Grid: ${this.state.toggleSnapGrid + ''}`}
						onClick={() => {
							this.setState({ toggleSnapGrid: !this.state.toggleSnapGrid });
						}}
					/>

					<input
						type="button"
						value="undo"
						onClick={() => {
							this.setState({
								undos: [ ...this.state.undos, ...this.state.boxes.slice(this.state.boxes.length) ],
								boxes:
									this.state.boxes.length === 0
										? [ ...this.state.undos ]
										: [ ...this.state.boxes.slice(0, this.state.boxes.length - 1) ]
							});
						}}
					/>
					<input
						type="button"
						value="reset"
						onClick={() => this.setState({ undos: [ ...this.state.boxes ], boxes: [] })}
					/>
					<input type="button" value="hard reset" onClick={() => this.setState({ boxes: [] })} />
				</div>
			</div>
		);
	};
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
	showMainContainer = () => {
		return (
			<div
				ref={(ref) => (this.container = ref)}
				style={{
					...{
						...(this.state.toggleSnapGrid
							? {
									backgroundSize: `${this.state.containerStyle.snapSize}px ${this.state.containerStyle
										.snapSize}px`,
									backgroundImage: `repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent ${this
										.state.containerStyle
										.snapSize}px),repeating-linear-gradient(-90deg, #fff, #fff 1px, transparent 1px, transparent ${this
										.state.containerStyle.snapSize}px)`
								}
							: {})
					},
					transform: `scale(${this.state.containerStyle.zoomScale})`,
					position: 'relative',
					backgroundColor: 'gray',
					width: '500px',
					height: '500px'
				}}
				onMouseDown={this.onContainerMouseDown}
				onWheel={this.onScrollMainContainer}
				className={`MAIN_CONTAINER`}
			>
				{this.state.boxes}

				{this.R.isDraggingNew &&
				!_.isEmpty(this.isValidStyle(this.state.defaultStyle)) && (
					<T t={{ type: 'div', data: this.snapGridify({ ...this.state.defaultStyle }) }} />
				)}

				{this.debugMode &&
					(() => {
						console.clear();
						console.table(this.state.boxes);
					})()}
			</div>
		);
	};

	showLayers = () => {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				{this.state.boxes.map((b, bi) => <RowLayerItem data={b} isSelected={this.R.selectedBoxIndex === bi} />)}
			</div>
		);
	};

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
