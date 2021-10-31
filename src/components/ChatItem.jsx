import React from 'react';
import dummyImg from '../assets/dummyUser.png';

import './ChatItem.css';
const ChatItem = React.memo(({activeConversationList, chatList , handleChatClick, online }) => {
  return (
    <div className="chat-item-wrapper">
      {
        activeConversationList?.length > 0 ?
        activeConversationList.map(item => chatList.map(chat=> (
          (chat.member_1 === item.email || chat.member_2 === item.email) ? 
          <div  onClick={() => handleChatClick(item ,chat)} className="single-chat-item" key={item?._id}>
            <div className="chat-item-row">
              <div style={{width:'40px',height:'40px',marginRight:'20px',borderRadius:'100vh',overflow:'hidden'}} className="item-img">
                {item && item.imageUri ? <img width="100%" src={item.imageUri} alt="" /> : <img src={dummyImg} alt="" />}
              </div>
              <div className="item-name">
                {item && item.name}
              </div>
            </div>
            <div className="chat-item-latest-message"><span className="message-highlight">Message: </span>{chat?.member_1===item.email || chat?.member_2 === item.email ? chat.messages.text : null}</div>
            <div className={online? "online": "offline"}>{online? "Online": "Offline"}</div>
          </div>
          : null
        ))
      ):null
    }
    </div>
  );
});

export default ChatItem;