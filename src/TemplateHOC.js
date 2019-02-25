import React from 'react'
import { getStore,setStore, deSelectionStore } from './Repository';



export default (WrappedComponent,prps,lastIndex,that) => {

            return (<WrappedComponent
                 {...prps} 
                key={lastIndex}
                ref={(r) => setStore(lastIndex, r)}
                onMouseDown={ev => {
                    ev.stopPropagation();
                    deSelectionStore();
                    that.R.selectedBoxIndex = lastIndex
                    getStore(lastIndex).setSelected(true)
                    that.R.isDraggingOld = true;
                    if (prps.mainContainer) {
                        that.setState({
                            mouseFirstCapture: {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0
                            }
                        })
                    } else {
        
                        that.props.resetMouseFirstCapture()
                        that.props.startPropagtion()
        
                    }
        
        
                }}
        
                startPropagtion={() => {
                    if (prps.mainContainer) {
                        that.setState({});
        
                    } else {
        
                        that.props.startPropagtion()
                    }
                }}
        
                resetMouseFirstCapture={() => {
                    if (prps.mainContainer) {
                        that.setState({ mouseFirstCapture: { x: 0, y: 0, w: 0, h: 0 } });
        
                    } else {
                        that.props.resetMouseFirstCapture()
                    }
                }}
        
        
                onMouseUp={(ev) => {
                    ev.stopPropagation();
                    if (that.R.selectedBoxIndex === -1) {
                        return;
                    }
                    that.R.isDraggingOld = false;
                    that.R.isCroppingOld = false;
                    that.R.sideCropping = '';
                    getStore(that.R.selectedBoxIndex).toggleDragging(false)
                    getStore(that.R.selectedBoxIndex).toggleCropping(false)
                    if (prps.mainContainer) {
                        that.setState({
                            mouseFirstCapture: {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0
                            }
                        });
                    } else {
                        that.props.resetMouseFirstCapture()
                        that.props.startPropagtion()
                    }
                }}
        
                onCroping={(ev, side) => {
                    ev.stopPropagation();
                    that.R.isDraggingOld = false;
                    that.R.isCroppingOld = true;
                    that.R.sideCropping = side;
                    that.R.selectedBoxIndex = lastIndex;
                    if (prps.mainContainer) {
                        that.setState({});
        
                    } else {
                        that.props.resetMouseFirstCapture()
                        that.props.startPropagtion()
                    }
                }}
            />)
    
}

