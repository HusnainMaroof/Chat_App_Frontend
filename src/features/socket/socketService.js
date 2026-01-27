import { initSocket, getSocket } from "../../socket";
import axios from "axios";
import {
  appendMessage,
  setContected,
  appendNewContact,
  setOnlineContact,
  setSokcetConnetingError,
  setSokcetError,
  updateMessageStatus,
  updateSingleUserStatus,
  updateContactLastMessage,
} from "./socketSlice";

const origin = `${import.meta.env.VITE_BACKEND_ORIGIN}/api/chat`;
axios.defaults.withCredentials = true;

export const socketConnecting = (dispatch) => {
  const socket = getSocket() || initSocket();

  if (socket.connected) return socket;

  socket.connect();

  socket.on("connect", () => {
    console.log("Connected to Real-time Gateway");
    dispatch(setContected(true));
  });

  // Received upon initial connection
  socket.on("initalOnlineUser", (onlineUsers) => {
    dispatch(setOnlineContact(onlineUsers));
  });

  // This event is now triggered by Redis Pub/Sub on the backend
  socket.on("userStatusUpdate", (data) => {
    const { userId, status } = data;
    dispatch(updateSingleUserStatus({ userId, status }));
  });

  //this event is for reciving message

  socket.on("receiveMessage", (data) => {
    dispatch(appendMessage(data));
  });

  socket.on("messageSent", (data) => {
    dispatch(updateMessageStatus(data));
  });

  // this is notification event
  socket.on("newNotification", (data) => {
    if (data.type === "New_Message") {
      const newData = {
        contactId: data.data.messageData.senderId,
        timestamp: data.data.messageData.timestamp,
        content: data.data.messageData.content.text,
      };


      dispatch(updateContactLastMessage(newData));
    }

    if (data.type === "New_Contact") {
      dispatch(appendNewContact(data.data));
    }
  });
  socket.on("disconnect", () => {
    dispatch(setContected(false));
  });

  socket.on("connect_error", (err) => {
    dispatch(setContected(false));
    dispatch(setSokcetConnetingError(err.message || "Connection Error"));
  });

  return socket;
};

// send message event

export const sendMessageSocket = async (payload) => {
  const socket = getSocket();

  if (socket) {
    socket.emit("sendMessage", payload);
  }
};

// get All contact
export const getAllContact = async () => {
  let res = await axios.get(`${origin}/getMyContact`);

  return res.data;
};
export const saveContact = async (data) => {
  let res = await axios.post(`${origin}/save-contact`, data);
  return res.data;
};
export const getChatHistroy = async (contactId) => {
  let res = await axios.get(`${origin}/getContactHistory/${contactId}`);
  return res.data;
};
