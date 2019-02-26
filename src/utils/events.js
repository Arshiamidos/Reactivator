import React from 'react'
import { getStore } from '../Repository';
import _ from 'lodash'
import TemplateFactory from '../TemplateFactory';
import TemplateHOC from '../TemplateHOC';
export const getMousePosition = (ev) => ({ x: ev.pageX, y: ev.pageY });

export const setCurrentRefrenceStyle = (index, newStyle) => {
    if (index === -1) {

       return  Promise.resolve(1).then(()=>{
            
            this.setState({
                containerStyle: {
                    ...this.state.containerStyle,
                    ...newStyle
                }
            });

        })

    } else {
        if (getStore(index)) {
            return Promise.resolve(1).then(()=>getStore(index).setStyles(newStyle))
        } else throw new Error('Index Not Found ');
    }
}
export const setCurrentRefrenceAttribute=(index,newAttribute)=>{
    if (index === -1) {
        return Promise.resolve(1).then(()=>{

            alert('main contianer has not attrib')
        })
    } else {
        if (getStore(index)) {
            return Promise.resolve(1).then(()=>{
                return getStore(index).setAttributes(newAttribute);
            })

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
        
        
        if (getStore(index)) {
            return getStore(index).getStyles();
        } else {
            return {};
        }
    }
};

export function onScrollMainContainer(ev){
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
    if(this.state.toggleSelection){


    }
    if (ev.target.className.search('MAIN_CONTAINER') ===-1) {
        //child selected
        ev.preventDefault();
        return;
    }
    if (this.R.selectedBoxIndex >= 0) {
        getStore(this.R.selectedBoxIndex).setSelected(false);
    }
    this.R.selectedBoxIndex = -1;
    if(!this.state.toggleSelection)
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
    if(this.state.toggleSelection){
        this.setState({  
            defaultStyle: {
            ...this.state.defaultStyle,
            anchorX: null,
            anchorY: null,
            width: null,
            height: null,
            top: null,
            left: null
        }})
        return ;
    }

    if (!_.isEmpty(this.isValidStyle(this.state.defaultStyle))) {
        const lastIndex = this.state.boxes.length;

        this.setState({
            boxes: [
                ...this.state.boxes,
                TemplateHOC(
                            TemplateFactory,{
                                mainContainer:true,
                                zindex:lastIndex,
                                t:{
                                    type: 'div',
                                    data: {
                                        ...this.state.defaultStyle,
                                        width: Math.abs(this.state.defaultStyle.width),
                                        height: Math.abs(this.state.defaultStyle.height)
                                    }
                                }
                            },
                            lastIndex,
                            this
                            )
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
        if (this.state.toggleSelection) this.onCreating(ev)
    }
};
export function onSelecting(ev){

}
export function onCroppingOld(ev, boxIndex, side){
    if (this.R.selectedBoxIndex === boxIndex && this.R.selectedBoxIndex!==-1) {
        
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










