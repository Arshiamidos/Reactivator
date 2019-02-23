import React from 'react'
import { getStore, setStore, deSelectionStore } from '../Repository';
import _ from 'lodash'
import T from '../T'
export const getMousePosition = (ev) => ({ x: ev.pageX, y: ev.pageY });

export const setCurrentRefrenceStyle = (index, newStyle) => {
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
        } else throw new Error('Index Not Found ');
    }
}
export const setCurrentRefrenceAttribute=(index,newAttribute)=>{
    if (index === -1) {
        alert('main contianer has not attrib')
    } else {
        if (getStore(index)) {
            getStore(index).setAttributes(newAttribute);
        } else throw new Error('Index Not Found ');
    }
}
export const getCurrentRefrenceAttributes=(index)=>{
    if (index === -1) return ({});
    else {
        //main container
        if (getStore(index)) {
            return getStore(index).getAttributes();
        } else {
            return {};
        }
    }
}
export function getCurrentRefrenceStyle(index){
    if (index === -1) return this.getStyles();
    else {
        //main container
        if (getStore(index)) {
            return getStore(index).getStyles();
        } else {
            return {};
        }
    }
};

export const onScrollMainContainer = (ev) => {
    if (this.state.containerStyle.zoomScale >= 0.5 && this.state.containerStyle.zoomScale <= 2.0) {
        this.setState({
            containerStyle: {
                ...this.state.containerStyle,
                zoomScale: _.clamp(this.state.containerStyle.zoomScale + Math.sign(ev.deltaY) * 1 / 10, 0.5, 2.0)
            }
        });
    }
};

export function getStyles(){
    return this.state.containerStyle;
};


export function onContainerMouseDown(ev){
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

export function onCreating(ev){
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

export function onMouseUp(ev){
    
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

                    onMouseUp={(ev) => {
                        //alert('mouse up ')
                        ev.stopPropagation();
                        if(this.R.selectedBoxIndex===-1) {
                            return;
                        }
                        this.R.isDraggingOld = false;
                        this.R.isCroppingOld = false;
                        this.R.sideCropping = '';
                        getStore(this.R.selectedBoxIndex).toggleDragging(false)
                        getStore(this.R.selectedBoxIndex).toggleCropping(false)
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

export function onMouseMove(ev){
    if (ev.buttons === 1) {
        if (this.R.isDraggingOld && !this.R.isCroppingOld) this.onMouseMoveOldBox(ev, this.R.selectedBoxIndex);
        if (this.R.isCroppingOld) this.onCroppingOld(ev, this.R.selectedBoxIndex, this.R.sideCropping);
        if (this.R.isDraggingNew) this.onCreating(ev);
    }
};

export function onCroppingOld(ev, boxIndex, side){
    if (this.R.selectedBoxIndex === boxIndex) {
        
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
            this.R.isCroppingOld=true;
            this.R.isDraggingOld=false;
            getStore(this.R.selectedBoxIndex).toggleCropping(true)
            return;
        }

        const deltaY = this.getMousePosition(ev).y - y;
        const deltaX = this.getMousePosition(ev).x - x;

        if (side === 'ss') {
            getStore(boxIndex).setStyles({
                height: this.gridify(Math.abs(deltaY + h))
            });
        } else if (side === 'ww') {
            getStore(boxIndex).setStyles({
                left: this.gridify(Math.abs(deltaX + l)),
                width: this.gridify(Math.abs(deltaX - w))
            });
        } else if (side === 'nn') {
            getStore(boxIndex).setStyles({
                top: this.gridify(Math.abs(deltaY + t)),
                height: this.gridify(Math.abs(deltaY - h))
            });
        } else if (side === 'ee') {
            getStore(boxIndex).setStyles({
                width: this.gridify(Math.abs(deltaX + w))
            });
        } else if (side === 'sw') {
            getStore(boxIndex).setStyles({
                left: this.gridify(Math.abs(deltaX + l)),
                width: this.gridify(Math.abs(deltaX - w)),
                height: this.gridify(Math.abs(deltaY + h))
            });
        } else if (side === 'se') {
            getStore(boxIndex).setStyles({
                width: this.gridify(Math.abs(deltaX + w)),
                height: this.gridify(Math.abs(deltaY + h))
            });
        } else if (side === 'nw') {
            getStore(boxIndex).setStyles({
                left: this.gridify(Math.abs(deltaX + l)),
                width: this.gridify(Math.abs(deltaX - w)),
                top: this.gridify(Math.abs(deltaY + t)),
                height: this.gridify(Math.abs(deltaY - h))
            });
        } else if (side === 'ne') {
            getStore(boxIndex).setStyles({
                width: this.gridify(Math.abs(deltaX + w)),
                top: this.gridify(Math.abs(deltaY + t)),
                height: this.gridify(Math.abs(deltaY - h))
            });
        }
    }
};


export function onMouseMoveOldBox(ev, bi){
    if (this.R.selectedBoxIndex === bi) {
        if (this.state.mouseFirstCapture.x === 0) {
            this.setState({
                mouseFirstCapture: {
                    ...this.state.mouseFirstCapture,
                    y: this.getMousePosition(ev).y - getStore(bi).getStyles().top,
                    x: this.getMousePosition(ev).x - getStore(bi).getStyles().left
                }
            });
            this.R.isCroppingOld=false;
            this.R.isDraggingOld=true;
            getStore(this.R.selectedBoxIndex).toggleDragging(true)

            return;
        }
        getStore(bi).setStyles({
            ...getStore(bi).getStyles(),
            top: Math.abs(this.getMousePosition(ev).y - this.state.mouseFirstCapture.y),
            left: Math.abs(this.getMousePosition(ev).x - this.state.mouseFirstCapture.x)
        });
    }
};










