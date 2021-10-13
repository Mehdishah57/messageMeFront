import React , {memo} from 'react';
import './Chat.css';
import ChatItem from './ChatItem';
import Loader from './Loader';

const Chat = memo(({loading,handleChatClick, chatList , activeConversationList}) => {
  if(loading) return (
      <div className="chat-wrapper">
        <Loader />
      </div>
    )
  return (
    <div className="chat-wrapper" id="style-1">
      {
        chatList?.length>0?
          <ChatItem
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
