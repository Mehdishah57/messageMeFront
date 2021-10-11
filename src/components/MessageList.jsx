import React from 'react';

import './MessageList.css';

const MessageList = React.memo(({receiverName ,email ,chats}) => {

  const MessageOwnerCheck = (myEmail , message ) => (
    myEmail === message.sender ? 
    <div className='my-message-item'><span style={{fontWeight:'bolder',color:'green',marginRight:5}}>Me: </span> {message.text}</div>:
    <div className='receiver-message-item'>{message.text}<span className='receiverName'>:{receiverName}</span></div>
);
  return(
    <React.Fragment> 
      {
      chats?.length > 0?
      chats[0].messages.map( message => MessageOwnerCheck(email,message) ):
      null
      }
    </React.Fragment>
  )
})

export default MessageList;