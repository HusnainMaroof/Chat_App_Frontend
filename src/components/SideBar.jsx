import React, { useContext } from "react";
import { Search } from "lucide-react";
import ContactList from "./ContactList";
import ProfileHeader from "./ProfileHeader";
import { context } from "../context/context";

const SideBar = () => {
  return (
    <div className="w-full flex flex-col h-full bg-[#0f172a]/80 backdrop-blur-xl">
      {/* --- Header --- */}
      <header className="flex h-[70px] shrink-0 items-center justify-between px-5 border-b border-white/5">
        <ProfileHeader />
      </header>

      {/* --- Search Box --- */}
      <div className="px-5 py-3 shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-xl bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none border border-transparent focus:border-violet-500/50 focus:bg-slate-800 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* --- Contact List --- */}
      <div className="flex-1 overflow-hidden">
        <ContactList />
      </div>
    </div>
  );
};

export default SideBar;
