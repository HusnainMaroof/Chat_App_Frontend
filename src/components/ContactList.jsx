import { Plus, Search, Sparkles, UserCircle2, UserPlus } from "lucide-react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { context } from "../context/context";

function ContactList() {
  const { allContacts, OnlineContact } = useSelector((state) => state.socket);
  const { activeChat, setActiveChat, isAddContactOpen, setIsAddContactOpen } =
    useContext(context);

  const contacts = allContacts?.contacts || [];

  if (contacts.length <= 0)
    return (
     <div className="flex flex-col items-center justify-center h-full px-6 text-center relative overflow-hidden bg-[#0f172a]/10">
      
      {/* Background Decorative Blurs - Scaled down for sidebar/smaller container */}
      <div className="absolute top-1/4 -right-10 w-32 h-32 bg-violet-600/10 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-10 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[240px]">
        {/* Main Icon Container */}
        <div className="relative inline-block mb-6 group cursor-pointer" onClick={() => setIsAddContactOpen(true)}>
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

  return (
    <div className="h-full overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
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
      {contacts.map((contact, index) => {
        let user = {};
        let online = false;
        OnlineContact.forEach((element) => {
          if (element === contact.contactUserId) {
            online = true;
          }
        });
        console.log(contact);

        user = {
          email: contact.email,
          contactUserId: contact.contactUserId,
          ProfilePic: contact.ProfilePic,
          name: contact.name,
          online: online,
        };
        return (
          <div
            key={contact.contactUserId || index}
            onClick={() => setActiveChat(user)}
            className="group flex h-[76px] cursor-pointer items-center px-3 rounded-2xl hover:bg-white/5 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="relative mr-4 shrink-0">
              <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 group-hover:border-violet-500/30 transition-all overflow-hidden">
                {user?.ProfilePic ? (
                  <img
                    src={contact.ProfilePic}
                    alt={contact.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-7 w-7" />
                )}
              </div>
              {online && (
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full shadow-lg shadow-green-500/20"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h3 className="font-semibold text-slate-200 truncate pr-2">
                  {contact.name}
                </h3>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {contacts.lastMessageAt ? `${lastMessageAt}` : "00.0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="truncate text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {contact.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;
