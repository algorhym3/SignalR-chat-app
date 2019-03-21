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
      channelID: '',
      userName:'',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  componentDidMount = () => 
  {
    const userID = window.prompt('userID:', '0');
    const channelID = window.prompt('channelID:', '0');

    let hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/chat")
    .build();
    this.setState({ hubConnection, userID , channelID }, () => {
      this.state.hubConnection
        .start().then(this.joinRoom())
        .then(() => {
        console.log('Connection started!');
        setTimeout(this.joinRoom(), 100);
         }).catch(err => console.log('Error while establishing connection :('));
        
        this.fetchUsername(userID).then(res => this.setState({userName:res.data.name}) );
        //  this.setState({userName})

      this.state.hubConnection.on('sendToAll', (userID,receivedMessage) => {
        const text = `${receivedMessage}`;
        this.fetchUsername(userID).then(res =>{
          var senderName = res.data.name
          console.log('senderName',senderName)
          console.log('senderID',userID)
          const singleMessage = {text : `${receivedMessage}` , sender : senderName , currentTime: this.currentTime()}
          const messages = this.state.messages.concat([singleMessage]);
          this.setState({ messages });

        });
      });
    });
  };

  sendMessage = (e) => {
    if(e.type != 'click' && e.which != 13 )
           return;
    if(this.state.message.trim().length==0)
           return;
    this.state.hubConnection
      .invoke('sendToAll',this.state.userID , this.state.channelID, this.state.message)
      .catch(err => console.error(err));

      this.setState({message: ''});      
  };

  joinRoom = () => {
    this.state.hubConnection
      .invoke('joinChannel',this.state.channelID)
      .catch(err => console.error(err));   
  };

  currentTime = () =>{
    var currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = ("0" + currentDate.getMinutes()).slice(-2); //transform to 2 digit number
    //const amPm = currentDate.get
    
    // const properHours = Number.MIN_VALUE(Number.MAX_VALUE(Math.abs(12-hours),12),hours)
    currentDate = (hours>12 || hours==0?Math.abs(hours-12):hours) +':'+minutes+(hours<12 ? ' am':' pm');
   return currentDate;
}

  fetchUsername = (userID) =>
  {
    return axios.get(`http://localhost:5000/api/users/${userID}`)
  };

  render() {
    return (
      <div>
        <div className="scrollableContainer">
          {this.state.messages.map(( message, index) => (
            // <span style={{display: 'block'}} key={index}> {message} </span>
            <Message  key={index} userName={message.sender} messageText ={message.text} currentTime={message.currentTime} />
          ))}
        </div>
        {/* <button onClick={this.sendMessage}>Send</button> */}
        {/* <input
          type="text"
          value={this.state.message}
          // is this not sad ? does it not re-render on every change in the text !?
          onChange={e => this.setState({ message: e.target.value })}
        /> */}

          <InputGroup className="stayAtBottomInput" size="lg">
            <InputGroup.Prepend>
              {/* <Button variant="outline-secondary" onClick={this.sendMessage}>Send</Button> */}
            </InputGroup.Prepend>
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
