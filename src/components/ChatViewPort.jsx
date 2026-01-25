import React, { useEffect, useRef } from "react";
import { Check, Clock, UserCircle2 } from "lucide-react";
import { useSelector } from "react-redux";

const ChatViewport = () => {
  const { messages, activeChat } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);

  const scrollRef = useRef(null);

  // Smooth scroll to bottom on every message update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 custom-scrollbar bg-transparent">
      {/* Standardized max-width for the shell to maintain layout integrity */}
      <div className="max-w-4xl mx-auto space-y-6">
        {messages?.map((msg, index) => {
          const isMe = msg.senderId === user?.userId;

          // Handling both string content and object content safely
          const messageText =
            typeof msg.content === "string" ? msg.content : msg?.content?.text;
          const messageImage = msg?.content?.image;

          return (
            <div
              key={msg.tempId || msg._id || index}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {/* min-w-0 is critical here to prevent flex children from expanding the shell */}
              <div
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] min-w-0 ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar for the other person */}
                {!isMe && (
                  <div className="h-9 w-9 rounded-xl overflow-hidden bg-slate-800 shrink-0 mb-1 border border-white/10 shadow-lg">
                    {activeChat?.ProfilePic ? (
                      <img
                        src={activeChat.ProfilePic}
                        alt={activeChat.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    ) : (
                      <UserCircle2 className="h-full w-full text-slate-500 p-1.5" />
                    )}
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`flex flex-col min-w-0 ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`relative px-4 py-3 shadow-xl transition-all w-fit max-w-full
                      ${
                        isMe
                          ? "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tr-none"
                          : "bg-slate-800/90 backdrop-blur-md border border-white/10 text-slate-200 rounded-2xl rounded-tl-none"
                      }`}
                  >
                    {/* Image Content (if any) */}
                    {messageImage && (
                      <div className="mb-2 -mx-1 -mt-1 overflow-hidden rounded-xl border border-white/5">
                        <img
                          src={messageImage}
                          alt="shared"
                          className="max-h-[300px] w-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Text Content with strict word breaking */}
                    {messageText && (
                      <p className="text-sm sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap overflow-hidden [word-break:break-word]">
                        {messageText}
                      </p>
                    )}

                    {/* Metadata: Time and Status */}
                    <div
                      className={`flex items-center gap-1.5 mt-2 opacity-60 text-[10px] font-bold tracking-widest ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>

                      {isMe && (
                        <span className="flex items-center shrink-0">
                          {msg.status === "sending" ? (
                            <Clock className="h-2.5 w-2.5 animate-pulse text-violet-200" />
                          ) : (
                            <span className="flex">
                              <Check className="h-3 w-3 text-cyan-400 -mr-1" />
                              <Check className="h-3 w-3 text-cyan-400" />
                            </span>
                          )}
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
        <div ref={scrollRef} className="h-2 w-full" />
      </div>
    </div>
  );
};

export default ChatViewport;
