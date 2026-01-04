import { UserCircle2 } from "lucide-react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { context } from "../context/context";

function ContactList() {
  const { allContacts, OnlineContact } = useSelector((state) => state.socket);
  const { activeChat, setActiveChat } = useContext(context);

  const contacts = allContacts?.contacts || [];

  if (contacts.length <= 0)
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-2">
        <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-2">
          <UserCircle2 className="h-8 w-8" />
        </div>
        <p className="text-slate-400 font-medium">No contacts found</p>
        <p className="text-xs text-slate-600">
          Start a new chat to see them here.
        </p>
      </div>
    );

  return (
    <div className="h-full overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
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
                    src={user.ProfilePic}
                    alt={user.name}
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
