import { Sparkles, UserCircle2, UserPlus } from "lucide-react";
import React, { useContext } from "react";
import { context } from "../context/context";

const NoContact = () => {
  const { setIsAddContactOpen } = useContext(context);
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center relative overflow-hidden bg-[#0f172a]/10">
      {/* Background Decorative Blurs - Scaled down for sidebar/smaller container */}
      <div className="absolute top-1/4 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-10 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[240px]">
        {/* Main Icon Container */}
        <div
          className="relative inline-block mb-6 group cursor-pointer"
          onClick={() => setIsAddContactOpen(true)}
        >
          {/* Animated Glow Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />

          <div className="relative h-16 w-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <UserCircle2 className="h-8 w-8 text-violet-400" />

            {/* Small floating badge */}
            <div className="absolute -top-1.5 -right-1.5">
              <div className="bg-fuchsia-500 rounded-md p-1 shadow-lg animate-bounce">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-slate-200 font-semibold text-base mb-1">
          No contacts found
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Your contact list is empty. Start a conversation to see them here.
        </p>

        {/* Glass Action Button */}
        <button
          onClick={() => setIsAddContactOpen(true)}
          className="w-full group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 transition-all duration-300 active:scale-95"
        >
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-center gap-2 relative z-10">
            <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <UserPlus className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Add Contact
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NoContact;
