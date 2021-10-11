import React , {memo} from 'react';
import './Chat.css';
import ChatItem from './ChatItem';

const Chat = memo(({handleChatClick, chatList , activeConversationList}) => {
  return (
    <div className="chat-wrapper" id="style-1">
      {
        chatList?.length>0?
          <ChatItem
           handleChatClick={handleChatClick}
           chatList={chatList}
           activeConversationList={activeConversationList}
           />:
        <div className="chat-loading">Loading Your Chats</div>
      }
    </div>
  )
});

export default Chat;
