import React from 'react';
import Template from './TemplateFactory';
import {selectArea} from './Repository'
class App extends Template {
  


  render() {

    selectArea(this.props.t.data)

    return (React.createElement('div', {
        className:` border`,
        style: {
            border: '1px dashed black',
            position: 'absolute',
            cursor: 'hand',
            zIndex: 10000,
            opacity: 0.5,
            background:`linear-gradient(#e66465, #9198e5)`,
            ...{ ...this.adaptor(this.props.t.data) },
        },
      }))
  }
}
export default App;