import React, { useState , useEffect , useRef } from 'react';
import './Message.css';
import EmptyMessageBox from './EmptyMessageBox';
import { fetchUserMessage } from './../services/fetchUserMessage';
import MessageList from './MessageList';
import socket from '../socketConfig';
import { sendMessage } from './../services/sendMessage';
import * as _ from 'lodash';

const Message = ({ email ,item, conversation, exitMessage }) => {
  const [message, setMessage] = useState('');
  const [messageList , setMessageList] = useState([]);
  const [MessageLength , setMessageLength] = useState(10);

  const fetchMessage = useRef(null);

  fetchMessage.current = async (id , length) => {
    const messageList = await fetchUserMessage(id , length);
    setMessageList(messageList);
  }

  useEffect(()=>{
    if(!item || !conversation) return;
    fetchMessage.current(conversation._id , MessageLength);
  },[item,conversation,MessageLength]);

  useEffect(()=>{
    setMessageLength(10);
  },[item]);

  if(messageList.length)
    socket.off('user-message').on('user-message' , async data => {
      console.log("in socket function call")
      let tempArr = _.cloneDeep(messageList);
      tempArr[0].messages.unshift(data.thisMessage);
      setMessageList(tempArr);
    })

  const handleMessage = async (message) => {
    if(item.email === email) return;
    const thisMessage = {sender: email , text: message}
    if(!conversation._id){
      let conversation = {
        member_1: email,
        member_2: item.email,
        message: [thisMessage]
      };
      socket.emit("searchedMessage",{conversation,item,thisMessage});
      await sendMessage(conversation , thisMessage);
      return;
    }
    socket.emit("message",{conversation,item,thisMessage})
    await sendMessage(messageList[0] , thisMessage);
  }
  if(!item) return <EmptyMessageBox />
  return (
    <div className="chat-container">
      <nav className="message-user-nav">
        <div className="message-user-name">{item && item.name}</div>
        {<button className="load-messages" onClick={()=>setMessageLength(prevLength => prevLength + 10)}>Load Msgs</button>}
        <div className="message-menu">
          <button onClick={exitMessage} className="exit-message">Exit</button>
        </div>
      </nav>
      <div className='message-list-wrapper'>
        <MessageList receiverName={item?.name} email={email} chats={messageList}/>
      </div>
      <div className="message-input">
        <input placeholder="Send Message" className='signup-login-field custom-field' value={message} onChange={e => { setMessage(e.currentTarget.value) }} />
        <i onClick={() => handleMessage(message)} style={{ fontSize: 20 }} className="fa fa-paper-plane-o custom" aria-hidden="true"></i>
      </div>
    </div>
  );
}

export default Message;