import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

function ChatPage() {
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        <div className="w-full h-full flex">
          {/* LEFT SIDE */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            {/* ProfileHeader placeholder */}
            <div className="p-4 border-b border-slate-600/30">
              <div className="h-10 bg-slate-700/40 rounded-md" />
            </div>

            {/* ActiveTabSwitch placeholder */}
            <div className="p-3 border-b border-slate-600/30">
              <div className="h-8 bg-slate-700/40 rounded-md" />
            </div>

            {/* List area placeholder */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-700/30 rounded-lg" />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {/* ChatContainer / NoConversationPlaceholder placeholder */}
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a conversation
            </div>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
