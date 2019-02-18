import React from 'react'
import style from './CropperStyle'

const defaultStyle={
    top:'0px',
    left:'0px',
    width:'50px',
    height:'50px',
    backgroundColor:'orange',
}


export default class T extends React.Component {

    constructor(prop){
        super(prop);
        this.state={
            data:defaultStyle,
            childrens:[],
        }
    }

    componentWillReceiveProps(nxp){
        this.setState({data:nxp.data})
    }

    addChild = (t, lastIndex, updateSelectedBoxIndex, setRef) => {

		this.setState({
			childrens: [...this.state.childrens,

			<T
				key={lastIndex}
				t={t}
				autoIncreament={lastIndex}
				onMouseDown={ev => {
					ev.stopPropagation();
					updateSelectedBoxIndex(lastIndex)
				}}
				ref={r => setRef(r, lastIndex)}
			/>


			]
		})

	}

    setStyle=(data)=>{
        
        this.setState({
            data:{
                ...defaultStyle,
                ...this.state.data,
                ...data
            }
        })

    }
    getStyles=()=>{
        return this.state.data
    }
    getRandomRGB=()=>{
        const rgb=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']
        return `#${rgb[~~Math.random()*16]}${rgb[~~Math.random()*16]}${rgb[~~Math.random()*16]}`
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
            <React.Fragment>
                {    
                    React.createElement(this.props.t.type,{
                    style:{
                        ...defaultStyle,
                        border: '1px dashed black',
                        backgroundColor: this.getRandomRGB(),
                        position: 'absolute',
                        cursor: (this.props.isDragging ? 'grabbing' : 'grab'),
                        zIndex: (this.props.isSelected ? 10000 : this.props.zindex),
                        ...this.state.data,
                    },
                    onMouseDown:this.props.onMouseDown,

                    onMouseUp:this.props.onMouseUp,
                    className:`CROPPER ${this.props.isSelected ? 'border' : ''} `

                    },
                    
                    )
                }
                {this.state.childrens}
                {this.props.isSelected ? this.renderHandles() : null}
            </React.Fragment>
            );

    }

}