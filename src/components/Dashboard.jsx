import React, { useContext, useRef, useEffect, useState  } from 'react';
import jwtDecode from 'jwt-decode';
import { UserContext } from './../UserContext';
import './Dashboard.css';
import Messenger from './Messenger';
import Profile from './Profile';
import socket from './../socketConfig';
import fetchUserChats from './../services/fetchUserChats';
import fetchUserData from '../services/fetchUser';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const user = useContext(UserContext);
  const [image, setImage] = useState('');
  const [chatList, setChatList] = useState([]);
  const [activeConversationList , setActiveConversationList] = useState([]);
  const fetchUser = useRef(null);
  const currentUser = useRef('');
  const fetchChats = useRef('');
  const profileRef = useRef(null);
  const messengerRef = useRef(null);

  fetchUser.current = async () => {
    const data = await fetchUserData(currentUser.current);
    setImage(data.imageUri);
  }

  fetchChats.current = async() => {
    const data = await fetchUserChats(currentUser.current.email);
    if(data.name==="error") return toast.error("Couldn't Load your Messages")
    setChatList(data?.conversation);
    setActiveConversationList(data?.ArrayOfFriends);
  }

  useEffect(() => {
    fetchUser.current();
    fetchChats.current();
    socket.on('logger', msg => {
      console.log(msg)
    });
  }, []);

  useEffect(()=>{
    socket.off("update-chats").on("update-chats" , () => {
      fetchChats.current();
    });
  },[])

  useEffect(() => {
    socket.off('User').emit('User', currentUser.current);
  },[]);

  useEffect(()=>{
    if(chatList.length > 0){
      chatList.map(chat=>{
        socket.emit('join-chat-emails', chat._id);
        return null;
      })
    }
  },[chatList])

  const displayProfile = () => {
    profileRef.current.style.transform = "translateX(0%)";
    messengerRef.current.style.transform = "translateX(500%)";
  };

  const displayMessenger = () => {
    messengerRef.current.style.transform = "translateX(0%)";
    profileRef.current.style.transform = "translateX(-500%)";
  }

  if (!localStorage.getItem('JWT_messageME')) return window.location = '/login';
  currentUser.current = jwtDecode(user);
  return (
    <div className="dashboard-wrapper">
      <ToastContainer />
      <nav className="dashboard-nav">
        <ul className="dashboard-nav-ul">
          <li className="dashboard-nav-li"><button className="nav-bar-btn" onClick={displayProfile}>Profile</button></li>
          <li className="dashboard-nav-li"><button className="nav-bar-btn" onClick={displayMessenger}>Messages</button></li>
          <li className="dashboard-nav-li">{currentUser.current.name}</li>
        </ul>
        <ul className="dashboard-nav-ul-2">
          <li><button onClick={() => { localStorage.removeItem('messageMeKey'); window.location = '/login' }} className="logout-btn">Logout</button></li>
        </ul>
      </nav>
        <div ref={profileRef} className="profile-slider">
          <Profile image={image} setImage={setImage}/>
        </div>
        <div ref={messengerRef} className="messenger-slider">
          <Messenger activeConversationList={activeConversationList} chatList={chatList} email={currentUser.current.email}/>
        </div>
    </div>
  );
}

export default Dashboard;