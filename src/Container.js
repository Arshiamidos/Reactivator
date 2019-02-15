import React from 'react';
import Cropper from './Cropper';
import './App.css';
import _ from 'lodash';
import RowLayerItem from './RowLayerItem'
import StyleEditor from './StyleEditor'

class Container extends React.Component {
	constructor() {
		super();

		this.debugMode = false;
		this.croppers={}
		this.sideCropping = '';
		this.isDraggingOld = false;
		this.isDraggingNew = false;
		this.isCroppingOld = false;
		this.selectedBoxIndex = -1;

		this.state = {
			toggleLayerLine:true,
			toggleStyleEditor:true,
			toggleSnapGrid:false,
			mainContainerFlexPercent:70,
			containerStyle:{
				zoomScale:1.0,
				snapSize:10,
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height:window.innerHeight+'px',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor:'red'
			},
			defaultStyle:{
				name:'',
				lock:false,
				visible:true,
				anchorX: null,
				anchorY: null,
				diffX: null,
				diffY: null,
				top: null,
				left: null,

			},
			
			mouseFirstCapture: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			},
			boxes: [],
			undos:[],
			redos:[],

		};
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
		
	}
	setCurrentRefrenceStyle=(index,newStyle)=>{
		if(index===-1) {
			this.setState({containerStyle:{
				...this.state.containerStyle,
				...newStyle
			}})
		}
		else {

			if(this.croppers[index]) {
				this.setState({
					boxes:[
						...this.state.boxes.slice(0,index),
						{
							...this.state.boxes[index],
							...newStyle
						},
						...this.state.boxes.slice(index+1),
					]
				})
			} 
		} 
	}
	getCurrentRefrenceStyle=(index)=>{
		if(index===-1) return this.getStyles();//main container
		else {

			if(this.croppers[index]) {
				return this.croppers[index].getStyles()
			} else {
				return ({})
			}
		} 

	}
	onScrollMainContainer=(ev)=>{

		

			if( this.state.containerStyle.zoomScale>=0.5 && 
			 this.state.containerStyle.zoomScale<=2.0)
			{

				this.setState({
					containerStyle:{
						...this.state.containerStyle,
						zoomScale:
						_.clamp(
							this.state.containerStyle.zoomScale+((Math.sign(ev.deltaY)*1 )/10),
							0.5,
							2.0
						)
						
					}
				})

			}
		

	}
	getStyles=()=>{
		return this.state.containerStyle
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
		this.setState({defaultStyle:{
			...this.state.defaultStyle,
			anchorX: this.getMousePosition(ev).x-this.container.getBoundingClientRect().left,
			anchorY: this.getMousePosition(ev).y-this.container.getBoundingClientRect().top
		}
			
		});
	};
	onCreating = (ev) => {
		let diffX = 
			this.getMousePosition(ev).x
			-this.container.getBoundingClientRect().left
			-this.state.defaultStyle.anchorX;
		
		let diffY = 
			this.getMousePosition(ev).y
			-this.container.getBoundingClientRect().top
			-this.state.defaultStyle.anchorY;

		if (diffX > 0 && diffY > 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY,
				left: this.state.defaultStyle.anchorX,
				diffX,
				diffY}
				
			});
		}
		if (diffX > 0 && diffY < 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY + diffY,
				left: this.state.defaultStyle.anchorX,
				diffX,
				diffY
			}
				
			});
		}
		if (diffX < 0 && diffY > 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY,
				left: this.state.defaultStyle.anchorX + diffX,
				diffX,
				diffY
			}
				
			});
		}
		if (diffX < 0 && diffY < 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY + this.state.defaultStyle.diffY,
				left: this.state.defaultStyle.anchorX + this.state.defaultStyle.diffX,
				diffX,
				diffY
			}
				
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

		if (!_.isEmpty(this.isValidStyle(this.state.defaultStyle)) )
		{
			this.setState({
				boxes: [ ...this.state.boxes,{ ...this.state.defaultStyle } ],
				
				defaultStyle:{
					...this.state.defaultStyle,
					anchorX: null,
					anchorY: null,
					diffX: null,
					diffY: null,
					top: null,
					left: null
				}
				
			});
			

		}
			
	};
	
	onCropingOld = (ev, boxIndex, side) => {
		if (this.selectedBoxIndex === boxIndex) {
			
			const diffY = 
				this.getMousePosition(ev).y 
				-this.container.getBoundingClientRect().top
				-this.state.boxes[boxIndex].top;

			const diffX = 
				this.getMousePosition(ev).x 
				-this.container.getBoundingClientRect().left
				-this.state.boxes[boxIndex].left;

			if(side==='ss'){

				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   diffY : this.getMousePosition(ev).y 
							   -this.container.getBoundingClientRect().top 
							   -this.state.boxes[boxIndex].top, 
					},
					...this.state.boxes.slice(boxIndex+1)
				]})


			}else if(side==='ww'){

				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   left : this.getMousePosition(ev).x-this.container.getBoundingClientRect().left  ,
					   diffX : Math.abs(this.state.boxes[boxIndex].diffX) - diffX ,
					},
					...this.state.boxes.slice(boxIndex+1)
				]})
				   

			} else if(side==='nn'){

				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   top : this.getMousePosition(ev).y -this.container.getBoundingClientRect().top ,
					   diffY : Math.abs(this.state.boxes[boxIndex].diffY)
								
								- diffY,
					},
					...this.state.boxes.slice(boxIndex+1)
				]})

			}else if(side==='ee'){

				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   diffX :-this.getMousePosition(ev).x 
					   +this.container.getBoundingClientRect().left
					   + Math.abs(this.state.boxes[boxIndex].left),
					},
					...this.state.boxes.slice(boxIndex+1)
				]})

			}else if (side === 'sw') {
				
				let _diffX=Math.abs(this.state.boxes[boxIndex].diffX) - diffX;
				let _diffY=this.getMousePosition(ev).y 
							-this.container.getBoundingClientRect().top
							-this.state.boxes[boxIndex].top

				this.setState({boxes:[
					 ...this.state.boxes.slice(0,boxIndex),
					 {
						...this.state.boxes[boxIndex],
						left : this.getMousePosition(ev).x 
							   -this.container.getBoundingClientRect().left,

						diffY :_.clamp(Math.abs(_diffY),10,Math.abs(_diffY)) , 
						diffX :_.clamp(Math.abs(_diffX),10,Math.abs(_diffX)),
					
					 },
					 ...this.state.boxes.slice(boxIndex+1)
				 ]})
					
				
				
			}else if (side === 'se') {

				let _diffX=-this.getMousePosition(ev).x +this.container.getBoundingClientRect().left + Math.abs(this.state.boxes[boxIndex].left)
				let _diffY=-this.getMousePosition(ev).y  +this.container.getBoundingClientRect().top+ Math.abs(this.state.boxes[boxIndex].top)
				
				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   diffX :_.clamp(Math.abs(_diffX),10,Math.abs(_diffX)),
					   diffY :_.clamp(Math.abs(_diffY),10,Math.abs(_diffY)),
					   
					},
					...this.state.boxes.slice(boxIndex+1)
				]})
			}else if (side === 'nw') {
				let _diffY=Math.abs(this.state.boxes[boxIndex].diffY) - diffY
				let _diffX=Math.abs(this.state.boxes[boxIndex].diffX) - diffX
				
				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   top : this.getMousePosition(ev).y  -this.container.getBoundingClientRect().top,
					   left : this.getMousePosition(ev).x  -this.container.getBoundingClientRect().left,
					   diffY :_.clamp(Math.abs(_diffY),10,Math.abs(_diffY)) ,
					   diffX :_.clamp(Math.abs(_diffX),10,Math.abs(_diffX)),
					},
					...this.state.boxes.slice(boxIndex+1)
				]})
			}else if (side === 'ne') {

				let _diffX=-this.getMousePosition(ev).x +this.container.getBoundingClientRect().left + Math.abs(this.state.boxes[boxIndex].left)
				let _diffY=Math.abs(this.state.boxes[boxIndex].diffY) - diffY

				this.setState({boxes:[
					...this.state.boxes.slice(0,boxIndex),
					{
					   ...this.state.boxes[boxIndex],
					   top : this.getMousePosition(ev).y-this.container.getBoundingClientRect().top,
					   diffX :_.clamp(Math.abs(_diffX),10,Math.abs(_diffX)),
					   diffY :_.clamp(Math.abs(_diffY),10,Math.abs(_diffY)),
					},
					...this.state.boxes.slice(boxIndex+1)
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
			
			this.setState({boxes:[
				...this.state.boxes.slice(0,this.selectedBoxIndex),
				{
				   ...this.state.boxes[this.selectedBoxIndex],
				   top : Math.abs(this.getMousePosition(ev).y - this.state.mouseFirstCapture.y),
                   left : Math.abs(this.getMousePosition(ev).x - this.state.mouseFirstCapture.x),
				},
				...this.state.boxes.slice(this.selectedBoxIndex+1)
			]})

		}
	};

	isValidStyle = c => {
		if ( 
			Number.isNaN(parseFloat(c.diffY)) ||
			Math.abs(c.diffY)<10 ||
			Math.abs(c.diffX)<10  
		) return ({});

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
	showMenuItems=()=>{
		return(
			<div>
				<p>Welcome Reacivator!</p>
				<div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',width:'500px'}}>
					<input
						type="button"
						value="remove selected"
						onClick={() => {
							if(this.selectedBoxIndex===-1){
								alert('no object selected')
								return;
							}
							this.setState({
								boxes:[
									...this.state.boxes.slice(0,this.selectedBoxIndex),
									...this.state.boxes.slice(this.selectedBoxIndex+1)
								]},
								()=>{

									this.selectedBoxIndex=-1
								})

						}}
					/> 
					<input
						type="button"
						value={`toggle Style Editor: ${this.state.toggleStyleEditor+""}`}
						onClick={() => {this.setState({toggleStyleEditor:!this.state.toggleStyleEditor})}}
					/>
					<input
						type="button"
						value={`Zoom Factor: ${this.state.containerStyle.zoomScale+""}`}
						onClick={() => {this.setState({containerStyle:{...this.state.containerStyle,zoomScale:1}})}}
					/>

					<input
						type="button"
						value={`toggle Layer Editor: ${this.state.toggleLayerLine+""}`}
						onClick={() => {this.setState({toggleLayerLine:!this.state.toggleLayerLine})}}
					/>

					<input
						type="button"
						value={`toggle Snap Grid: ${this.state.toggleSnapGrid+""}`}
						onClick={() => {this.setState({toggleSnapGrid:!this.state.toggleSnapGrid})}}
					/>

					<input
						type="button"
						value={`toggle Layer Editor: ${this.state.toggleLayerLine+""}`}
						onClick={() => {this.setState({toggleLayerLine:!this.state.toggleLayerLine})}}
					/>


					<input
						type="button"
						value="undo"
						onClick={() => {

							this.setState({ 
								undos:[...this.state.undos,...this.state.boxes.slice(this.state.boxes.length), ],
								boxes: 
								this.state.boxes.length===0
								?
								[...this.state.undos]
								:
								[...this.state.boxes.slice(0,this.state.boxes.length-1) ]
							})
						}}
					/>
					<input 
						type="button" 
						value="reset" 
						onClick={() => this.setState({ undos:[...this.state.boxes],boxes: [] })} />
					<input 
						type="button" 
						value="hard reset" 
						onClick={() => this.setState({ boxes: [] })} />
				</div>
			</div>
		)
	}

	snapGridify=(data)=>{
		if(this.state.toggleSnapGrid){
			let ss=this.state.containerStyle.snapSize
			return ({
				...data,
				top:  parseInt((data.top)/ss)*ss,
				left: parseInt((data.left)/ss)*ss,
				diffX:parseInt((data.diffX)/ss)*ss,
				diffY:parseInt((data.diffY)/ss)*ss,
			})
		}
		return data;

	}

	showMainContainer=()=>{

		return(
			<div
				ref={(ref) => (this.container = ref)}
				style={{ 
					
					...{...(this.state.toggleSnapGrid?{
						backgroundSize:`${this.state.containerStyle.snapSize}px ${this.state.containerStyle.snapSize}px`,    
    					backgroundImage:`repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent ${this.state.containerStyle.snapSize}px),repeating-linear-gradient(-90deg, #fff, #fff 1px, transparent 1px, transparent ${this.state.containerStyle.snapSize}px)`
					}:{})}
					,transform:`scale(${this.state.containerStyle.zoomScale})`,position:'relative',backgroundColor: 'gray', width: '500px', height: '500px' }}
				onMouseDown={this.onContainerMouseDown}
				onWheel={this.onScrollMainContainer}
				className={`MAIN_CONTAINER`}>

				{this.state.boxes.map((b, bi) => (
					<Cropper
						key={bi}
						zindex={bi}
						data={this.snapGridify({ ...b })}
						ref={r=>this.croppers[bi]=r}
						isDragging={this.selectedBoxIndex === bi && this.isDraggingOld}
						isCropping={this.selectedBoxIndex === bi && this.isCroppingOld}
						isSelected={this.selectedBoxIndex === bi}
						
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
				{this.isDraggingNew && !_.isEmpty(this.isValidStyle(this.state.defaultStyle)) && <Cropper data={this.snapGridify({ ...this.state.defaultStyle })} />}
				{this.debugMode &&
					(() => {
						console.clear();
						console.table(this.state.boxes);
					})()}
			</div>
		)
	}

	showLayers=()=>{
		return(
			<div style={{width:'100%',height:'100%'}}>
				{
					this.state.boxes.map(
						(b,bi)=><RowLayerItem 
							data={b}
							isSelected={this.selectedBoxIndex===bi}
						/>)
				}
			</div>
		)
	}
	
	render() {
		/*  */
		return (
			<div style={{display:'flex',flexDirection:'row'}}>
				
				<div style={this.state.containerStyle}>
					<div style={{
						display:'flex',
						flexDirection:'column',
						backgroundColor:'blue',
						justifyContent:'center',
						alignItems:'center',
						width:'100%',
						overflow:'hidden',
						flex:`1 1 ${this.state.mainContainerFlexPercent}%`,
					}}>

						{this.showMenuItems()}
						{this.showMainContainer()}

					</div>
{
					this.state.toggleLayerLine 
					&& 
					<div style={{
						display:'flex',
						flexDirection:'column',
						backgroundColor:'green',
						width:'100%',
						overflow:'auto',
						flex:`1 1 ${100-this.state.mainContainerFlexPercent}%`,
					}}>
						{this.showLayers()}

					</div>
}
					
				</div>

				{
					this.state.toggleStyleEditor && 
					<StyleEditor 
					data={this.getCurrentRefrenceStyle(this.selectedBoxIndex)} 
					onConfirm={ newStyle =>{this.setCurrentRefrenceStyle(this.selectedBoxIndex,newStyle)}}
					/>
				}
				

			</div>
			
		);
	}
}
export default Container;
