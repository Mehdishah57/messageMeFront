import React from 'react'
import Chat from './Chat';

import "./MyMessages.css";

const MyMessages = ({handleChatClick, chatList, activeConversationList, email, onClick},ref) => {
  return (
    <div onClick={onClick} ref={ref} className="my-messages-wrapper">
      <Chat handleChatClick={handleChatClick} chatList={chatList} activeConversationList={activeConversationList} email={email}/>
    </div>
  )
}

export default React.forwardRef(MyMessages);
