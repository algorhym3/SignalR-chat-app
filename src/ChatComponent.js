import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Message from "./MessageComponent"
const signalR = require("@aspnet/signalr");

class ChatComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: '',
      chatID: '',
      userName: '',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  componentDidMount = () => {
    const userID = this.props.userID
    const chatID = this.props.chatID


    let hubConnection = new signalR.HubConnectionBuilder()
      //http://10.0.67.127:8080/chat
      .withUrl("http://localhost:5000/chat")
      .build();
      // might remove 
      hubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10; // 1 second * 60 * 10 = 10 minutes.

    this.setState({ hubConnection, userID, chatID }, () => {
      this.state.hubConnection
        .start().then(this.joinRoom())
        .then(() => {
          console.log('Connection started!');
          //setTimeout(this.joinRoom(), 100);
        }).catch(err => console.log('Error while establishing connection :('));

      this.fetchUsername(userID).then(res => this.setState({userName:res.data.name}) ); 

      this.state.hubConnection.on('sendToAll', (userID, receivedMessage) => {
        const text = `${receivedMessage}`;
        this.fetchUsername(userID).then(res => {
          var senderName = res.data.name
          const singleMessage = { text: `${receivedMessage}`, sender: senderName, currentTime: this.currentTime() }
          const messages = this.state.messages.concat([singleMessage]);
          this.setState({ messages });

        });
      });
    });
  };


  sendMessage = (e) => {
    if (e.type != 'click' && e.which != 13)
      return;
    if (this.state.message.trim().length == 0)
      return;
    this.state.hubConnection
      .invoke('sendToAll', this.state.userID, this.state.chatID, this.state.message)
      .catch(err => console.error(err));

    this.setState({ message: '' });
  };

  // merging to workspace
  joinRoom = () => {
    this.state.hubConnection
      .invoke('joinChannel', this.state.chatID)
      .catch(err => console.error(err));
  };

  currentTime = () => {
    var currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = ("0" + currentDate.getMinutes()).slice(-2); //transform to 2 digit number
    //const amPm = currentDate.get

    // const properHours = Number.MIN_VALUE(Number.MAX_VALUE(Math.abs(12-hours),12),hours)
    currentDate = (hours > 12 || hours == 0 ? Math.abs(hours - 12) : hours) + ':' + minutes + (hours < 12 ? ' am' : ' pm');
    return currentDate;
  }

  fetchUsername = (userID) => {
    // needs authentication
    return axios.get(`http://localhost:5000/api/users/${userID}`)
  };

  render() {
    return (
      <div>
        <div className="scrollableContainer">
          {this.state.messages.map((message, index) => (
            <Message key={index} userName={message.sender} messageText={message.text} currentTime={message.currentTime} />
          ))}
        </div>

        <InputGroup className="stayAtBottomInput" size="lg">
          <FormControl
            onKeyPress={this.sendMessage}
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="Send Your Message"
            aria-describedby="basic-addon2"
            aria-describedby="inputGroup-sizing-sm"
          />
        </InputGroup>
      </div>
    );
  }
}

export default ChatComponent;
