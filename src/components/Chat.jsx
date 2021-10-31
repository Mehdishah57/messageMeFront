import React , {memo} from 'react';
import './Chat.css';
import ChatItem from './ChatItem';

const Chat = memo(({loading,handleChatClick, chatList , activeConversationList, online}) => {
  if(loading) return (
      <div className="chat-wrapper">
        kuttyo
      </div>
    )
  return (
    <div className="chat-wrapper" id="style-1">
      {
        chatList?.length>0?
          <ChatItem
            online={online}
           handleChatClick={handleChatClick}
           chatList={chatList}
           activeConversationList={activeConversationList}
           />:
        <div className="chat-loading">Send Messages to see them here</div>
      }
    </div>
  )
});

export default Chat;
