import React from 'react'
import RowLayerItem from '../RowLayerItem'
import _ from 'lodash'
import T from '../T'
export function showMainContainer(){
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
export function showLayers(){
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {this.state.boxes.map((b, bi) => <RowLayerItem data={b} isSelected={this.R.selectedBoxIndex === bi} />)}
        </div>
    );
};
export function showMenuItems(){
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