import React, { Component } from 'react';
import ChatComponent from './ChatComponent'
import Chat from './Chat';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src="https://files.slack.com/files-pri/TD4KKEZTP-FG9J52VQB/symbol_1_____1.png" className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Zeww</h1>
        </header> */}
       <div>
         <ChatComponent/>
       </div>
      </div>
    );
  }
}

export default App;
