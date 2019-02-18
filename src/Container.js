import React from 'react';
import Cropper from './Cropper';
import './App.css';
import _ from 'lodash';
import RowLayerItem from './RowLayerItem'
import StyleEditor from './StyleEditor'
import {connect} from 'react-redux'
import {setSelected,toggleDraggingNew,toggleCroppingOld,toggleDraggingOld} from './redux/actions/canvas'
import {getStore,setStore} from './Repository'


class Container extends React.Component {
	
	
	constructor(props) {
		super(props);

		this.debugMode = false;
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
				width: null,
				height: null,
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

			if(getStore(index)) {

				getStore(index).setStyle(newStyle)

			}else throw new Error('Index Not Found '+__filename+':83')
		} 
	}
	getCurrentRefrenceStyle=(index)=>{

		if(index===-1) return this.getStyles();//main container
		else {

			if(getStore(index)) {

				return getStore(index).getStyles()
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
		if (ev.target.className.search('MAIN_CONTAINER') < 0) {//child selected
			ev.preventDefault();
			return;
		}
		if(this.selectedBoxIndex>=0){
			getStore(this.selectedBoxIndex).setSelected(false)
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
		let width = 
			this.getMousePosition(ev).x
			-this.container.getBoundingClientRect().left
			-this.state.defaultStyle.anchorX;
		
		let height = 
			this.getMousePosition(ev).y
			-this.container.getBoundingClientRect().top
			-this.state.defaultStyle.anchorY;

		if (width > 0 && height > 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY,
				left: this.state.defaultStyle.anchorX,
				width,
				height}
				
			});
		}
		if (width > 0 && height < 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY + height,
				left: this.state.defaultStyle.anchorX,
				width,
				height
			}
				
			});
		}
		if (width < 0 && height > 0) {
			this.setState({defaultStyle:{
				...this.state.defaultStyle,
				top: this.state.defaultStyle.anchorY,
				left: this.state.defaultStyle.anchorX + width,
				width,
				height
			}
				
			});
		}
		if (width < 0 && height < 0) {
			this.setState({defaultStyle:{
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
			if (this.isDraggingOld && !this.isCroppingOld) this.onMouseMoveOldBox(ev, this.selectedBoxIndex);
			if (this.isCroppingOld) this.onCroppingOld(ev, this.selectedBoxIndex, this.sideCropping);
			if (this.isDraggingNew) this.onCreating(ev);
		}
	};
	onMouseUp = (ev) => {

		this.isDraggingNew = false;

		if (!_.isEmpty(this.isValidStyle(this.state.defaultStyle)) )
		{

			const bi=this.state.boxes.length

			this.setState({
				boxes: [ ...this.state.boxes,
					<Cropper
					key={bi}
					zindex={bi}
					onRefChild={(ref,ai)=>setStore(ai,ref)}
					data={this.snapGridify({ ...this.state.defaultStyle })}
					ref={r=>setStore(bi,r)}
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
						getStore(bi).setSelected(true)
						this.isDraggingOld = true;
					}}
				/>
				
				],
				
				defaultStyle:{
					...this.state.defaultStyle,
					anchorX: null,
					anchorY: null,
					width: null,
					height: null,
					top: null,
					left: null
				}
				
			});
			

		}
			
	};
	onCroppingOld = (ev, boxIndex, side) => {

		if (this.selectedBoxIndex === boxIndex) {
			
			
			const height = 
				this.getMousePosition(ev).y 
				-this.container.getBoundingClientRect().top
				-getStore(boxIndex).getStyles().top;

			const width = 
				this.getMousePosition(ev).x 
				-this.container.getBoundingClientRect().left
				-getStore(boxIndex).getStyles().left;

			if(side==='ss'){

				getStore(boxIndex).setStyles({
					diffY : this.getMousePosition(ev).y 
							-this.container.getBoundingClientRect().top 
							-getStore(boxIndex).getStyles().top, 
				 })

			}else if(side==='ww'){

				getStore(boxIndex).setStyles({
					   left : this.getMousePosition(ev).x-this.container.getBoundingClientRect().left  ,
					   width : Math.abs(getStore(boxIndex).getStyles().width) - width ,
					})

			} else if(side==='nn'){

				getStore(boxIndex).setStyles({
					   top : this.getMousePosition(ev).y -this.container.getBoundingClientRect().top ,
					   height : Math.abs(getStore(boxIndex).getStyles().height)- height,
				 })
					

			}else if(side==='ee'){

				getStore(boxIndex).setStyles({
					width :-this.getMousePosition(ev).x+this.container.getBoundingClientRect().left
								+ Math.abs(getStore(boxIndex).getStyles().left),
				 })
					
			}else if (side === 'sw') {
				
				let _width=Math.abs(getStore(boxIndex).getStyles().width) - width;
				let _height=this.getMousePosition(ev).y 
							-this.container.getBoundingClientRect().top
							-getStore(boxIndex).getStyles().top

				getStore(boxIndex).setStyles({
					left : this.getMousePosition(ev).x 
						   -this.container.getBoundingClientRect().left,
					height :_.clamp(Math.abs(_height),10,Math.abs(_height)) , 
					width :_.clamp(Math.abs(_width),10,Math.abs(_width)),
				
				 })
				
			}else if (side === 'se') {

				let _width=-this.getMousePosition(ev).x +this.container.getBoundingClientRect().left + Math.abs(getStore(boxIndex).getStyles().left)
				let _height=-this.getMousePosition(ev).y  +this.container.getBoundingClientRect().top+ Math.abs(getStore(boxIndex).getStyles().top)
				getStore(boxIndex).setStyles({
					width :_.clamp(Math.abs(_width),10,Math.abs(_width)),
					height :_.clamp(Math.abs(_height),10,Math.abs(_height)),
					
				 })
				
			}else if (side === 'nw') {
				let _height=Math.abs(getStore(boxIndex).getStyles().height) - height
				let _width=Math.abs(getStore(boxIndex).getStyles().width) - width
				getStore(boxIndex).setStyles({
					top : this.getMousePosition(ev).y  -this.container.getBoundingClientRect().top,
					left : this.getMousePosition(ev).x  -this.container.getBoundingClientRect().left,
					height :_.clamp(Math.abs(_height),10,Math.abs(_height)) ,
					width :_.clamp(Math.abs(_width),10,Math.abs(_width)),
				 })

				
			}else if (side === 'ne') {

				let _width=-this.getMousePosition(ev).x +this.container.getBoundingClientRect().left + Math.abs(getStore(boxIndex).getStyles().left)
				let _height=Math.abs(getStore(boxIndex).getStyles().height) - height
				getStore(boxIndex).setStyles({
					top : this.getMousePosition(ev).y-this.container.getBoundingClientRect().top,
					width :_.clamp(Math.abs(_width),10,Math.abs(_width)),
					height :_.clamp(Math.abs(_height),10,Math.abs(_height)),
				 })
				
				
			}
		}
	};
	onMouseMoveOldBox = (ev, bi) => {
		
		if ( this.selectedBoxIndex === bi ) {
			
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
				top : Math.abs(this.getMousePosition(ev).y - this.state.mouseFirstCapture.y),
				left : Math.abs(this.getMousePosition(ev).x - this.state.mouseFirstCapture.x),
			 })
			
			

		}
	};
	isValidStyle = c => {
		if ( 
			Number.isNaN(parseFloat(c.height)) ||
			Math.abs(c.height)<10 ||
			Math.abs(c.width)<10  
		) return ({});

		return {
			...c,
			name:c.name,
			lock:c.lock,
			visible:c.visible,
			top: c.top ? Math.abs(c.top) + 'px' : '0px',
			left: c.left ? Math.abs(c.left) + 'px' : '0px',
			height: !Number.isNaN(parseFloat(c.height)) ? Math.abs(c.height) + 'px' : '0px',
			width: !Number.isNaN(parseFloat(c.width)) ? Math.abs(c.width) + 'px' : '0px'
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
				width:parseInt((data.width)/ss)*ss,
				height:parseInt((data.height)/ss)*ss,
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

				{this.state.boxes}

				{this.isDraggingNew && !_.isEmpty(this.isValidStyle(this.state.defaultStyle)) && <Cropper key={-2} data={this.snapGridify({ ...this.state.defaultStyle })} />}
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
	addChild=(t,index)=>{
		if(index===-1){
			return;
		}
		getStore(this.selectedBoxIndex).addChild(
			t,
			Object.keys(getStore()).length+1,
			(r)=>{
				this.selectedBoxIndex=r;
			},
			(ref,lastIndex)=>setStore(lastIndex,ref)
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
						selectedIndex={this.selectedBoxIndex}
						onDragTemplate={(t)=>{this.addChild(t,this.selectedBoxIndex) }}
						data={this.getCurrentRefrenceStyle(this.selectedBoxIndex)} 
						onConfirm={ newStyle =>{this.setCurrentRefrenceStyle(this.selectedBoxIndex,newStyle)}}
						/>
				}
				

			</div>
			
		);
	}
}


export default Container;
