import React, { useState, useRef, useEffect } from "react";
import "./UpdatedMessenger.css";
import { Button, Fab, TextField } from "@mui/material";
import { fetchUserMessage } from './../services/fetchUserMessage';
import socket from "./../socketConfig";
import { sendMessage } from './../services/sendMessage';
import * as _ from 'lodash';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import BackspaceIcon from '@mui/icons-material/Backspace';

const UpdatedMessenger = React.memo(({ closeMessageBox, chat:item,conversation, onClick ,email}) => {
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
    if(conversation && !conversation._id){}
  },[item,conversation])

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
    if(!message) return;
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

  const handleCloseIconDrag = e => {
    let initialHorizontalPosition = e.clientX;
    let initialVerticalPosition = e.clientY;

    if(initialHorizontalPosition < initialHorizontalPosition + e.clientX){
      e.currentTarget.style.left = e.clientX + "px";
    }
    if(initialHorizontalPosition > initialHorizontalPosition + e.clientX){
      e.currentTarget.style.right = e.clientX + "px";
    }
    if(initialVerticalPosition < initialVerticalPosition + e.clientY){
      e.currentTarget.style.top = e.clientY + "px";
    }
    if(initialVerticalPosition > initialVerticalPosition + e.clientY){
      e.currentTarget.style.bottom = e.clientY + "px";
    }
      
  }
    

  if(!item.email || !conversation.member_1) return <div onClick={onClick} style={{fontSize:'20px',display:'flex',justifyContent:'center',alignItems:'center',width:"100%",height:'70vh'}} className="updated-messenger-wrapper">
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly',width:'280px'}}>
      <MenuIcon sx={{color:'dodgerblue',fontWeight:'bolder',fontSize:'35px'}}/> or <MailIcon sx={{color:'dodgerblue',fontWeight:'bolder',fontSize:'35px'}}/> to view messages
    </div>
  </div>
  return (
    <div style={{position:'relative'}} onClick={onClick} className="updated-messenger-wrapper">
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
        <Button variant="contained" onClick={handleMessage} sx={{position:'absolute',right:'0px',height:'100%'}}>Send</Button>
      </div>
      <Fab draggable onTouchStart={handleCloseIconDrag} onClick={closeMessageBox} sx={{position:'absolute', backgroundColor:'red'}} onDrag={handleCloseIconDrag} variant="extended" size="medium" color="primary" aria-label="add">
        <BackspaceIcon sx={{position:'absolute'}} />
      </Fab>
    </div>
  );
});

export default UpdatedMessenger;
