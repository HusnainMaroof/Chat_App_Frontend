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
      

      {/* --- Contact List --- */}
      <div className="flex-1 overflow-hidden">
        <ContactList />
      </div>
    </div>
  );
};

export default SideBar;
