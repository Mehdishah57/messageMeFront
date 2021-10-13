import React, { useState, useRef, useEffect } from "react";
import "./UpdatedMessenger.css";
import { Button, TextField } from "@mui/material";
import { fetchUserMessage } from './../services/fetchUserMessage';
import socket from "./../socketConfig";
import { sendMessage } from './../services/sendMessage';
import * as _ from 'lodash';


const UpdatedMessenger = React.memo(({ chat:item,conversation, onClick ,email}) => {
  const [message, setMessage] = useState("");
  const [messageList , setMessageList] = useState([{messages:[]}]);
  const [MessageLength , setMessageLength] = useState(10);
  const divRef = useRef(null);

  const fetchMessage = useRef(null);

  fetchMessage.current = async (id , length) => {
    const messageList = await fetchUserMessage(id , length);
    try {
      messageList[0].messages=messageList[0].messages.reverse()
      setMessageList(messageList);
    } catch (error) {
      return
    }
    
  }

  useEffect(()=>{
    if(!item || !conversation) return;
    fetchMessage.current(conversation._id , MessageLength);
  },[item,conversation,MessageLength]);

  useEffect(()=>{
    setMessageLength(10);
  },[item]);

  useEffect(()=>{
    socket.off('user-message').on('user-message' , async data => {
      let tempArr = _.cloneDeep(messageList);
      tempArr[0].messages.push(data.thisMessage);
      setMessageList(tempArr);
      divRef.current.scrollTop = divRef.current.scrollHeight - divRef.current.clientHeight;
    })
  },[messageList])

  const TextBox = ({message}) => (
    <div className={message.sender===email?"myBox":"hisBox"}>
      {message.text}
    </div>
  )

  const handleMessage = async () => {
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
    setMessage("");
  }

  return (
    <div onClick={onClick} className="updated-messenger-wrapper">
      <div ref={divRef} style={{display:'flex',height:'80vh',flexDirection:'column',alignItems:'stretch',width:'100%',overflowX:'hidden',overflowY:'scroll'}} className="new-message-wrapper">
        {
          messageList.length &&  messageList[0].messages.map( message => <TextBox message={message} /> )
        }
      </div>
      <div style={{position:'relative',display:'flex',flexDirection:'column',marginTop:'10px',overflow:'hidden'}}>
      <TextField
        id="outlined-basic"
        label="Message"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
        <Button onClick={handleMessage} sx={{position:'absolute',right:'0px',height:'100%'}}>Send</Button>
      </div>
    </div>
  );
});

export default UpdatedMessenger;
