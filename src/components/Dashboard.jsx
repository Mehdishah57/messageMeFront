import React, { useRef, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import "./Dashboard.css";
import Profile from "./Profile";
import socket from "./../socketConfig";
import fetchUserChats from "./../services/fetchUserChats";
import fetchUserData from "../services/fetchUser";
import PrimarySearchAppBar from "./NavTest";
import MyMessages from "./MyMessages";
import UpdatedMessenger from "./UpdatedMessenger";
import { Route, useHistory } from "react-router-dom";
import SearchUsers from './SearchUsers';
import { CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [image, setImage] = useState("");
  const [current_user, setCurrentUser] = useState({});
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState({});
  const [conversation, setConversation] = useState({});
  const [activeConversationList, setActiveConversationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUser = useRef(null);
  const fetchChats = useRef("");
  const profileRef = useRef(null);
  const messengerRef = useRef(null);
  const myMessagesRef = useRef();

  const history = useHistory();

  fetchUser.current = async () => {
    setLoading(true);
    const data = await fetchUserData(current_user);
    setImage(data.imageUri);
    setLoading(false);
  };

  fetchChats.current = async () => {
    setLoading(true);
    const data = await fetchUserChats(current_user.email);
    if (data.name === "error") {
      return setLoading(false);
    }
    setChatList(data?.conversation);
    setActiveConversationList(data?.ArrayOfFriends);
    setLoading(false);
  };

  useEffect(() => {
    if (!current_user || !current_user._id) return;
    fetchUser.current();
    fetchChats.current();
    socket.off("logger").on("logger", (msg) => {
      console.log(msg);
    });
  }, [current_user]);

  useEffect(() => {
    socket.off("update-chats").on("update-chats", () => {
      fetchChats.current();
    });
  }, []);

  useEffect(() => {
    if (!current_user || !current_user._id) return;
      socket.off("User").emit("User", current_user);
  }, [current_user]);

  useEffect(() => {
    if (chatList.length > 0) {
      chatList.map((chat) => {
        socket.emit("join-chat-emails", chat._id);
        return null;
      });
    }
  }, [chatList]);

  useEffect(() => {
    try {
      let usr = jwtDecode(localStorage.getItem("JWT_messageME"));
      setCurrentUser(usr);
    } catch (error) {
      window.location = "/login";
    }
  }, []);

  const displayProfile = () => {
    profileRef.current.style.transform = "translateX(0%)";
    messengerRef.current.style.transform = "translateX(500%)";
  };

  const displayMessenger = () => {
    messengerRef.current.style.transform = "translateX(0%)";
    profileRef.current.style.transform = "translateX(-500%)";
  };

  const handleNameUpdate = async (name, data) => {
    const usr = jwtDecode(data);
    setCurrentUser(usr);
  };

  const handleDrawerShow = () => {
    myMessagesRef.current.style.transform = "translateX(0px)";
  };

  const handleMenuClose = () => {
    myMessagesRef.current.style.transform = "translateX(-100vh)";
  };

  const handleChatClick = (chat, conversation) => {
    setChat(chat);
    setConversation(conversation)
  };

  const closeMessageBox = () => {
    setChat({});
    setConversation({});
  }

  const handleSIClick = (item) => {
    const conversation = {
      member_1: current_user.email,
      member_2: item.email,
      message: []
    }
    socket.emit("joinRoom", item._id);
    setChat(item);
    setConversation(conversation);
  }

  if (!localStorage.getItem("JWT_messageME"))
    history.push("/login");
    if(!current_user._id) return <div className="dashboard-wrapper">
      <CircularProgress />
    </div>;
  return (
    <div className="dashboard-wrapper">
      <PrimarySearchAppBar
        user={current_user}
        displayProfile={displayProfile}
        displayMessenger={displayMessenger}
        showDrawer={handleDrawerShow}
      />
      <Route
        path="/dashboard/profile"
        component={() => (
          <Profile
            onClick={handleMenuClose}
            image={image}
            setImage={setImage}
            username={current_user.name}
            userStatus={current_user.private}
            updateName={handleNameUpdate}
          />
        )}
      />
      <Route
        path="/dashboard/messages"
        component={() => (
          <UpdatedMessenger
            onClick={handleMenuClose}
            conversation={conversation}
            chat={chat}
            email={current_user.email}
            closeMessageBox={closeMessageBox}
          />
        )}
      />
      <Route 
        path="/dashboard/search"
        component={()=>(
          <SearchUsers 
          onClick={handleMenuClose}
          handleSIClick={handleSIClick}
          current_user={current_user}
          />
        )}
      />
      <MyMessages
        chatList={chatList}
        email={current_user.email}
        activeConversationList={activeConversationList}
        handleChatClick={handleChatClick}
        ref={myMessagesRef}
      />
    </div>
  );
};

export default Dashboard;
