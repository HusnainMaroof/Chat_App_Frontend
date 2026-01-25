import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useDispatch, useSelector } from "react-redux";
import UsersLoadingSkeleton from "../components/UsersLoadingSkeleton";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useContext, useEffect } from "react";
import {
  connectSocketThunk,
  getAllContactsThunk,
} from "../features/socket/socketSlice";
import SideBar from "../components/SideBar";
import { context } from "../context/context";
import AddContact from "../components/AddContact";
import ChatContainer from "../components/ChatContainer";

function ChatPage() {
  const { getAllContactsStates, activeChat } = useSelector(
    (state) => state.socket,
  );
  const { isAddContactOpen, setIsAddContactOpen } = useContext(context);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllContactsThunk());
  }, [dispatch]);
  useEffect(() => {
    dispatch(connectSocketThunk());
  }, [dispatch]);
  return (
    <div className="relative w-full md:max-w-6xl h-screen md:h-[90vh] md:my-auto">
      <BorderAnimatedContainer>
        <div className="w-full h-full flex overflow-hidden relative">
          <AddContact
            isOpen={isAddContactOpen}
            onClose={() => setIsAddContactOpen(false)}
          />
          {/* LEFT SIDE: SideBar */}
          {/* Visible always on Desktop, but hidden on Mobile if a chat is active */}
          <div
            className={`
            ${activeChat ? "hidden md:flex" : "flex"} 
            w-full md:w-80 lg:w-96 bg-[#0f172a] flex-col h-full border-r border-white/10 transition-all duration-300
          `}
          >
            {getAllContactsStates.loading ? (
              <UsersLoadingSkeleton />
            ) : (
              <SideBar />
            )}
          </div>

          {/* RIGHT SIDE: Chat View */}
          {/* Hidden on Mobile unless a chat is active */}
          <div
            className={`
            ${activeChat ? "flex" : "hidden md:flex"} 
            flex-1 flex-col bg-slate-900/50 backdrop-blur-sm relative
          `}
          >
            {/* If activeChat exists, render ChatContainer (you will build this), else Placeholder */}
            {activeChat ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
