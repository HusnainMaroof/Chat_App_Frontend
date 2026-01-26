import React, { useEffect, useRef } from "react";
import { Check, Clock, UserCircle2 } from "lucide-react";
import { useSelector } from "react-redux";

const ChatViewport = () => {
  const { messages, activeChat } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);

  const bottomRef = useRef(null);

  const sortedMessages = React.useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [sortedMessages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* IMPORTANT:
            messages come NEWEST FIRST from backend
            reverse ONLY for rendering */}
        {sortedMessages.map((msg) => {
          const isMe = msg.senderId === user?.userId;
          const text = msg?.content?.text;
          const image = msg?.content?.image;

          return (
            <div
              key={msg._id || msg.tempId}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar (only for other user) */}
                {!isMe && (
                  <div className="h-9 w-9 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                    {activeChat?.ProfilePic ? (
                      <img
                        src={activeChat.ProfilePic}
                        alt={activeChat?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircle2 className="h-full w-full text-slate-500 p-1.5" />
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-4 py-3 max-w-full shadow-xl
                      ${
                        isMe
                          ? "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tr-none"
                          : "bg-slate-800/90 border border-white/10 text-slate-200 rounded-2xl rounded-tl-none"
                      }`}
                  >
                    {/* Image */}
                    {image && (
                      <div className="mb-2 overflow-hidden rounded-xl">
                        <img
                          src={image}
                          alt="shared"
                          className="max-h-[300px] w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Text */}
                    {text && (
                      <p className="text-sm sm:text-[15px] break-words whitespace-pre-wrap">
                        {text}
                      </p>
                    )}

                    {/* Meta */}
                    <div
                      className={`flex items-center gap-1.5 mt-2 text-[10px] opacity-60 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Time */}
                      {msg.timestamp && (
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      )}

                      {/* Status (ONLY for my messages) */}
                      {isMe && (
                        <span className="flex items-center">
                          {msg.status === "sending" ? (
                            <Clock className="h-2.5 w-2.5 animate-pulse" />
                          ) : msg.status === "sent" ? (
                            <Check className="h-3 w-3" />
                          ) : msg.status === "delivered" ? (
                            <span className="flex">
                              <Check className="h-3 w-3 -mr-1" />
                              <Check className="h-3 w-3" />
                            </span>
                          ) : msg.status === "seen" ? (
                            <span className="flex text-blue-400">
                              <Check className="h-3 w-3 -mr-1" />
                              <Check className="h-3 w-3" />
                            </span>
                          ) : null}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Scroll Anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatViewport;
