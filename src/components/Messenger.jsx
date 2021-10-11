import React, { useRef, useState } from 'react';
import './Messages.css'
import Chat from './Chat';
import Search from './Search';
import Message from './Message';
import socket from '../socketConfig';

const Messenger = ({email , chatList , activeConversationList}) => {
  const chatRef = useRef(null);
  const searchRef = useRef(null);

  const mainRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);


  const [item, setItem] = useState('');
  const [conversation , setConversation] = useState('')

  const displayChats = () => {
    searchRef.current.style.transform = "translate(500%)";
    chatRef.current.style.transform = "translate(0%)";
  }

  const displaySearch = () => {
    searchRef.current.style.transform = "translate(0%)";
    chatRef.current.style.transform = "translate(-500%)";
  }

  const handleSIClick = (item) => {
    console.log(item)
    const conversation = {
      member_1: email,
      member_2: item.email,
      message: []
    }
    socket.emit("joinRoom", item._id);
    setItem(item);
    setConversation(conversation);
  }

  const handleChatClick = (chat , conversation) => {
    setItem(chat);
    setConversation(conversation);
  }

  const exitMessage = () => {
    setItem('')
    setConversation('');
  }


  const showChats = () => {
    const { style } = leftRef.current;
    if(!style.height || style.height === '0%') style.height='400px';
    else style.height='0%';
  }

  return (
    <div ref={mainRef} className="main-wrapper">
      <button className="show-hide-chat-button" onClick={showChats}>Show Chats</button>
      <div ref={leftRef} className="left-panel-wrapper">
        <div className="left-panel-nav">
          <button onClick={() => displayChats()} className="left-panel-chats">Chats</button>
          <button onClick={() => displaySearch()} className="left-panel-search">Search</button>
        </div>
        <div className="inner-wrapper">
          <div ref={chatRef} className="chats" >
            <Chat handleChatClick={handleChatClick} chatList={chatList} activeConversationList={activeConversationList} email={email}/>
          </div>
          <div ref={searchRef} className="search">
            <Search handleSIClick={handleSIClick} /> 
          </div>
        </div>
      </div>
      <div ref={rightRef} className="right-panel-wrapper">
        <Message email={email} item={item} conversation={conversation} exitMessage={exitMessage} />
      </div>
    </div>
  );
}

export default Messenger;