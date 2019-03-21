import React, { Component } from 'react';
import Image from 'react-bootstrap/Image'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

class Message extends Component {
 
   

  render() {
    return (
        <div className="mainContainer" >
            <div className="SenderInfoContainer">
                <Image className="message-user-img" src="https://i2.wp.com/crimsonems.org/wp-content/uploads/2017/10/profile-placeholder.gif?fit=250%2C250&ssl=1" roundedCircle/>
                <div className="UserNameAndTimeContainer">
                    <span><b>{this.props.userName}</b></span>               
                    <span>{this.props.currentTime} </span>
                </div>
            </div>  
                <div className="messageContainer">
                    <span>{this.props.messageText} </span>
                </div>
      </div>
    );
  }
}

export default Message;
