import React, { useContext, useState } from "react";
import { context } from "../context/context";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { activeChat, setActiveChat } = useContext(context);
  const [message, setMessage] = useState(null);
  let sendMessage;
  return (
    <div className="flex flex-col h-full bg-[#0f172a]/20">
      <ChatHeader user={activeChat} onBack={() => setActiveChat(null)} />
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar h-full"></div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatContainer;
