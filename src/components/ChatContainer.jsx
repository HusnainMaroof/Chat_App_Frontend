import React, { useContext, useEffect, useState } from "react";
import { context } from "../context/context";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatHistoryThunk,
  resetGetChatHistory,
} from "../features/socket/socketSlice";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const ChatContainer = () => {
  const { activeChat, setActiveChat } = useContext(context);
  const { getChatHistoryStates, messages } = useSelector(
    (state) => state.socket
  );
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  // Fetch chat history
  useEffect(() => {
    if (!activeChat?.contactUserId) return;

    dispatch(getChatHistoryThunk(activeChat.contactUserId));

    return () => {
      dispatch(resetGetChatHistory());
    };
  }, [activeChat?.contactUserId, dispatch]);

  const handleSendMessage = () => {
    if (!text.trim()) return;

    // TODO: dispatch send message action / socket emit
    console.log("Send:", text);

    setText("");
  };

  const handleOnBack = () => {
    setActiveChat(null);
    dispatch(resetGetChatHistory());
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a]/20">
      <ChatHeader user={activeChat} onBack={handleOnBack} />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
        {getChatHistoryStates.loading ? (
          <MessagesLoadingSkeleton />
        ) : messages && messages.length === 0 ? (
          <NoChatHistoryPlaceholder
            name={activeChat?.name}
            onchangeSms={setText}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {messages?.map((msg) => (
              <div key={msg._id}>{msg.text}</div>
            ))}
          </div>
        )}
      </div>

      <MessageInput onSend={handleSendMessage} text={text} setText={setText} />
    </div>
  );
};

export default ChatContainer;
