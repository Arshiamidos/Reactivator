import React from 'react';
import Container from './Container'
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className='centerize'>
          <p>WellCome to Reactivator</p>
          <Container/>
        </div>
      </div>
    );
  }
}

export default App;
