import {
  ChevronLeft,
  MoreVertical,
  Phone,
  Search,
  UserCircle2,
  Video,
} from "lucide-react";
import { useContext } from "react";

const ChatHeader = ({ user, onBack }) => {
  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between px-4 sm:px-6 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3 sm:gap-4 h-full">
        {/* Back Button for Mobile */}
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="relative">
          <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 group-hover:border-violet-500/30 transition-all overflow-hidden">
            {user?.ProfilePic ? (
              <img
                src={user.ProfilePic}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2 className="h-7 w-7" />
            )}
          </div>
        </div>

        <div className="min-w-0 ">
          <h3 className="text-sm font-semibold text-white tracking-tight leading-none truncate max-w-[120px] sm:max-w-none">
            {user?.name}
          </h3>
          <p className="text-[12px] text-violet-400 font-medium mt-1.5 animate-border">
            {user.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:block">
          <Phone className="h-4 w-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:block">
          <Video className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
