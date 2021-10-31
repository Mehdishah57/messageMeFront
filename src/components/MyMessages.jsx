import React from "react";
import Chat from "./Chat";

import "./MyMessages.css";

const MyMessages = (
  { handleChatClick, chatList, activeConversationList, email, onClick, online },
  ref
) => {
  return (
    <div onClick={onClick} ref={ref} className="my-messages-wrapper">
      <Chat online={online} handleChatClick={handleChatClick} chatList={chatList} activeConversationList={activeConversationList} email={email}/>
    </div>
  );
};

export default React.forwardRef(MyMessages);
