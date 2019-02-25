import React from 'react';
import style from './CropperStyle'
import Redux from './Redux'
import { getStore } from './Repository'
import voidTags from './utils/voidTags.json'
import TemplateHOC from './TemplateHOC';


const getRandomRGB = () => {
  const rgb = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  return `#${rgb[~~(Math.random() * 16)]}${rgb[~~(Math.random() * 16)]}${rgb[~~(Math.random() * 16)]}`
}

const defaultStyle = {
  top: 0,
  left: 0,
  width: 50,
  height: 50,
}


class TemplateFactory extends React.Component {
  constructor(props) {
    super(props);
    this.R = Redux;
    this.state =
      props.zindex && getStore(props.zindex) ?//if exist for destructing new parent it will borow from refs 
        ({
          ...getStore(props.zindex).state,
          isSelected: false,
          isDragging: false,
          isCropping: false,

        })// reparenting https://github.com/facebook/react/issues/3965
        : ({
          data: { ...props.t.data, backgroundColor: getRandomRGB() },
          childrens: this.props.childrens || [],
          isSelected: false,
          isDragging: false,
          isCropping: false,
          text: 'sample text',
          attributes: props.attributes || {},
        })
  }




  addCustomChild = (t, lastIndex) => {

    const CustomChild = React.lazy(() => import("./code"));

    this.setState({
      childrens: [...this.state.childrens,
      TemplateHOC(
        TemplateFactory,
        {
          t,
          zindex:lastIndex,
          childrens:[
            <React.Suspense fallback={<div>loading ...</div>}>
              <CustomChild />
            </React.Suspense>
          ]
        }
        ,
        lastIndex,
        this
      )
    ]
    })



  }

  addChild = (t, lastIndex) => {

    this.setState({
      childrens: [...this.state.childrens,
      TemplateHOC(
        TemplateFactory,
        {
          t,
          zindex:lastIndex,
        },
        lastIndex,
        this
      )


      ]
    })

  }


  componentWillReceiveProps(nxp) {
    this.setState({ data: { ...this.state.data, ...nxp.t.data } })
  }
  setAttributes = (attributes) => {
    this.setState({ attributes })
  }
  getAttributes = () => {
    return this.state.attributes
  }
  setStyles = (data) => {
    this.setState({ data: { ...this.state.data, ...data } })
  }
  setSelected = (toggle = undefined) => {
    if (!toggle) {
      this.setState({
        isDragging: false,
        isSelected: false,
      })
      return;
    }

    this.setState({
      isDragging: true,
      isSelected: true
    })
  }

  getStyles = () => {
    return this.state.data
  }


  toggleDragging = (toggle = undefined) => {
    if (!toggle) {
      this.setState({
        isDragging: false,
      })
      return;
    }

    this.setState({
      isDragging: true,
    })
  }

  toggleCropping = (toggle = undefined) => {
    if (!toggle) {
      this.setState({
        isCropping: false,
      })
      return;
    }

    this.setState({
      isCropping: true,
    })
  }

  adaptor = (c = {}) => {

    if (Number.isNaN(parseFloat(c.height)) ||
      Math.abs(c.height) < 10 ||
      Math.abs(c.width) < 10
    )
      return ({});

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




  renderHandles() {
    const { onCroping } = this.props
    const { isCropping } = this.state
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

    let V = React.createElement(this.props.t.type, {
      style: {
        ...defaultStyle,
        border: '1px dashed black',
        position: 'absolute',
        cursor: (this.state.isDragging ? 'grabbing' : 'grab'),
        zIndex: (this.state.isSelected ? 10000 : this.props.zindex),
        opacity: (this.state.isSelected ? 0.5 : 1),
        ...{ ...this.adaptor(this.state.data) },
        ...{ ...this.state.isSelected ? { top: '0px', left: '0px' } : {} }
      },
      ...{ ...this.state.attributes },
      onMouseDown: this.props.onMouseDown,
      onMouseUp: this.props.onMouseUp,
      //className:`CROPPER ${this.state.isSelected ? 'border' : ''} `
    },
      !voidTags.includes(this.props.t.type) ?
        [
          !this.state.isSelected ? this.state.text : <input type="text" value={this.state.text} onChange={e => this.setState({ text: e.target.value })} />,
          ...this.state.childrens,
        ]
        :
        null
    );


    return [

      <React.Fragment>
        <div
          className={`CROPPER ${this.state.isSelected ? 'border' : ''} `}
          style={{
            border: '1px dashed black',
            position: 'absolute',
            cursor: (this.state.isDragging ? 'grabbing' : 'grab'),
            zIndex: (this.state.isSelected ? 10000 : this.props.zindex),
            ...{ ...this.adaptor(this.state.data) },
          }}
        >
          {
            V
          }
          {this.state.isSelected ? this.renderHandles() : null}
        </div>
      </React.Fragment>

      ,
      V

    ][this.state.isSelected ? 0 : 1]

  }











}
export default TemplateFactory;