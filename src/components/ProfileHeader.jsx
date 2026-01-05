import React, { useState, useRef, useEffect, useContext } from "react";
import {
  UserCircle2,
  Plus,
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
} from "lucide-react";
import AddContact from "./AddContact";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocketThunk,
  resetSaveContactStates,
  resetSocketStates,
} from "../features/socket/socketSlice";
import { context } from "../context/context";
import {
  authMeFun,
  logoutFun,
  resetAllStates,
} from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { disconnectSocket } from "../socket";

const ProfileHeader = () => {
  const { logoutStates, user } = useSelector((state) => state.auth);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { isAddContactOpen, setIsAddContactOpen } = useContext(context);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  // Handle click outside for dropdown closure
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    setIsSettingsOpen(!isSettingsOpen);
    toast.promise(dispatch(logoutFun()), {
      loading: "Loging Out...",
      success: <span>Loging out Successfully See you soon</span>,
      error: <span>Could not Logout.</span>,
    });
  };

  useEffect(() => {
    if (logoutStates.result === "logout") {
      dispatch(authMeFun());
      dispatch(resetAllStates());
      dispatch(resetSocketStates());
      disconnectSocket();
    }
  }, [logoutStates]);
  return (
    <div className="flex items-center justify-between w-full relative">
      {/* User Info / Avatar Section */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 group-hover:border-violet-500/30 transition-all overflow-hidden">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt="" loading="lazy"  className="h-full w-full object-cover"/>
            ) : (
              <UserCircle2 className="h-7 w-7" />
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full shadow-sm"></div>
        </div>
      </div>

      {/* Action Buttons: Add Contact & Settings */}
      <div className="flex gap-1 sm:gap-2 relative">
        <button
          onClick={() => setIsAddContactOpen(true)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-violet-400 group"
          title="Add Contact"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSettingsOpen
                ? "bg-violet-500/20 text-violet-400"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings
              className={`h-5 w-5 ${
                isSettingsOpen ? "rotate-45" : ""
              } transition-transform duration-300`}
            />
          </button>

          {/* Settings Dropdown Menu */}
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1e293b] border border-white/10 shadow-2xl z-50 overflow-hidden backdrop-blur-xl py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="px-4 py-2 border-b border-white/5 mb-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Account
                </p>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <User className="h-4 w-4 text-violet-400" />
                Edit Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Bell className="h-4 w-4 text-violet-400" />
                Notifications
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Shield className="h-4 w-4 text-violet-400" />
                Privacy
              </button>

              <div className="h-[1px] bg-white/5 my-1" />

              <button
                onClick={handleLogout}
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal - Conditional Rendering */}
    </div>
  );
};

export default ProfileHeader;
