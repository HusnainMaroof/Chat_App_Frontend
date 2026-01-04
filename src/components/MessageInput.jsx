import { Loader2, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      onSend({ text });
      setText("");
      setIsSending(false);
    }, 400);
  };

  return (
    <div className="p-3 sm:p-4 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 shrink-0">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto flex items-center gap-2 sm:gap-3"
      >
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-2.5 sm:py-3 px-4 sm:px-5 text-sm text-slate-200 outline-none focus:border-violet-500/50 focus:bg-slate-800 transition-all"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-violet-400 hidden xs:block"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20 active:scale-90 transition-all disabled:opacity-50"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
