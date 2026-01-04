import React from "react";
import { MessageCircleIcon, Sparkles, Send, Zap } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  const suggestions = [
    { text: "Say Hello 👋", icon: <Sparkles className="size-3" /> },
    { text: "How are you?", icon: <Zap className="size-3" /> },
    { text: "Meet up soon?", icon: <Send className="size-3" /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 relative">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Animated Icon Container */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative w-20 h-20 bg-slate-800 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
          <MessageCircleIcon className="size-10 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      {/* Typography */}
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        New conversation with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          {name}
        </span>
      </h3>

      <div className="max-w-sm mb-10">
        <p className="text-slate-400 text-base leading-relaxed">
          This is the beginning of your private connection. Break the ice with a
          message!
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {suggestions.map((item, i) => (
          <button
            key={i}
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-violet-600/20 hover:border-violet-500/30 hover:text-violet-200 transition-all duration-300 active:scale-95"
          >
            <span className="text-violet-400 group-hover:animate-pulse">
              {item.icon}
            </span>
            {item.text}
          </button>
        ))}
      </div>

      {/* Privacy Tag */}
      <div className="absolute bottom-4 flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
        <div className="h-1 w-1 rounded-full bg-violet-500/50" />
        Encrypted Stream
        <div className="h-1 w-1 rounded-full bg-violet-500/50" />
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
