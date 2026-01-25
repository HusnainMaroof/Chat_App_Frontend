import { Plus, Search, Sparkles, UserCircle2, UserPlus } from "lucide-react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { context } from "../context/context";
import NoContact from "./NoContact";
import { setActiveChat } from "../features/socket/socketSlice";

function ContactList() {
  const { allContacts, OnlineContact } = useSelector((state) => state.socket);

  const dispatch = useDispatch();

  const contacts = allContacts?.contacts || [];

  if (contacts.length <= 0) return <NoContact />;

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
            onClick={() => dispatch(setActiveChat(user))}
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
