import React from "react";
import { MessageSquare, Sparkles, ShieldCheck, Plus } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#0f172a]/30 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center z-10">
        {/* Main Icon Container */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-[2rem] blur-2xl opacity-20 animate-pulse" />
          <div className="relative h-24 w-24 rounded-[2rem] bg-slate-800 border border-white/10 flex items-center justify-center shadow-2xl">
            <MessageSquare className="h-10 w-10 text-violet-400" />
            <div className="absolute -top-2 -right-2">
              <div className="bg-fuchsia-500 rounded-lg p-1.5 shadow-lg animate-bounce">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
          Select a conversation
        </h2>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Choose a contact from the sidebar to start a secure, encrypted
          conversation.
        </p>

        {/* Glass Action Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
              <Plus className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Start Something New
              </p>
              <p className="text-xs text-slate-500">
                Create a group or message a new contact
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-white/5 w-full" />

          <div className="flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                End-to-End Encrypted
              </p>
              <p className="text-xs text-slate-500">
                Your messages are private and protected
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-600 uppercase tracking-widest text-[10px] font-bold">
          <ShieldCheck className="h-3 w-3" />
          Your personal messages are encrypted
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
