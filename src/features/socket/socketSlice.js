import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllContact,
  getChatHistroy,
  saveContact,
  socketConnecting,
} from "./socketService";

const initialState = {
  messages: [],
  allContacts: [],
  OnlineContact: [],
  connected: false,
  activeChat: null,
  socketError: null,
  connectingStates: {
    loading: false,
    error: false,
    success: false,
    result: null,
  },
  getAllContactsStates: {
    loading: false,
    error: false,
    success: false,
    result: null,
  },
  saveContactStates: {
    loading: false,
    error: false,
    success: false,
    result: null,
  },
  getChatHistoryStates: {
    loading: false,
    error: false,
    success: false,
    result: null,
  },
  sendMessageStates: {
    loading: false,
    error: false,
    success: false,
    result: null,
  },
  reciveMessageStates: {
    loading: false,
    error: false,
    success: false,
    result: null,
  },
};

// Async thunk to initialize the connection from a component
export const connectSocketThunk = createAsyncThunk(
  "socket/connect",
  async (_, { dispatch }) => {
    await socketConnecting(dispatch);
    return true;
  },
);

//
// get All contact
export const getAllContactsThunk = createAsyncThunk(
  "socket/getAllContact",
  async (_, thunkAPI) => {
    try {
      return await getAllContact();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
// save Contact
export const saveContactThunk = createAsyncThunk(
  "socket/saveContact",
  async (data, thunkAPI) => {
    try {
      return await saveContact(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

// get chat history
export const getChatHistoryThunk = createAsyncThunk(
  "socket/getChatHistory",
  async (data, thunkAPI) => {
    try {
      return await getChatHistroy(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setOnlineContact: (state, action) => {
      state.OnlineContact = action.payload;
    },
    setContected: (state, action) => {
      state.connected = action.payload;
    },
    setSokcetConnetingError: (state, action) => {
      state.connectingStates.error = true;
      state.connectingStates.result = action.payload;
    },
    setSokcetError: (state, action) => {
      state.socketError = action.payload;
    },
    // Handles updates for a single user (online/offline)
    updateSingleUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      if (status === "online") {
        if (!state.OnlineContact.includes(userId)) {
          state.OnlineContact.push(userId);
        }
      } else {
        state.OnlineContact = state.OnlineContact.filter((id) => id !== userId);
      }
    },

    resetSaveContactStates: (state, action) => {
      state.saveContactStates = {
        loading: false,
        error: false,
        success: false,
        result: null,
      };
    },
    resetSocketStates: (state, action) => {
      state.OnlineContact = [];
      state.connected = false;
      state.connectingStates = {
        loading: false,
        error: false,
        success: false,
        result: null,
      };
    },

    resetGetChatHistory: (state, action) => {
      state.getChatHistoryStates = {
        loading: false,
        error: false,
        success: false,
        result: null,
      };
      state.messages = [];
    },

    // messaging states

    appendMessage: (state, action) => {
      const msg = action.payload;

      state.messages.unshift(msg);
    },

    // add new contact list

    appendNewContact: (state, action) => {
      const contact = action.payload;
      console.log(contact);

      state.allContacts.unshift(contact);
    },

    // updated the message status

    updateMessageStatus: (state, action) => {
      const { tempId, status } = action.payload;

      const message = state.messages.find((m) => m.tempId === tempId);

      if (message) {
        message.status = status;
      }
    },

    updateContactLastMessage: (state, action) => {
      const { contactId, content, timestamp } = action.payload;

      const contact = state.allContacts.find(
        (c) => c.contactUserId === contactId,
      );
      if (contact) {
        contact.lastMessage = content;
        contact.lastMessageAt = timestamp;
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // connecting Sokcet
      .addCase(connectSocketThunk.pending, (state) => {
        state.connectingStates.loading = true;
      })
      .addCase(connectSocketThunk.fulfilled, (state) => {
        state.connectingStates.loading = false;
        state.connectingStates.success = true;
      })

      // getting All contact

      .addCase(getAllContactsThunk.pending, (state, action) => {
        state.getAllContactsStates.loading = true;
      })
      .addCase(getAllContactsThunk.rejected, (state, action) => {
        state.getAllContactsStates.loading = false;
        state.getAllContactsStates.error = true;
        state.getAllContactsStates.result = action.payload;
      })
      .addCase(getAllContactsThunk.fulfilled, (state, action) => {
        state.getAllContactsStates.loading = false;
        state.getAllContactsStates.error = false;
        state.getAllContactsStates.success = true;
        state.getAllContactsStates.result = action.payload;
        state.allContacts = action.payload;
      })
      // saveContact

      .addCase(saveContactThunk.pending, (state, action) => {
        state.saveContactStates.loading = true;
      })
      .addCase(saveContactThunk.rejected, (state, action) => {
        state.saveContactStates.loading = false;
        state.saveContactStates.error = true;
        state.saveContactStates.result = action.payload;
      })
      .addCase(saveContactThunk.fulfilled, (state, action) => {
        state.saveContactStates.loading = false;
        state.saveContactStates.error = false;
        state.saveContactStates.success = true;
        state.saveContactStates.result = action.payload;
      })

      //get chat history

      .addCase(getChatHistoryThunk.pending, (state, action) => {
        state.getChatHistoryStates.loading = true;
      })
      .addCase(getChatHistoryThunk.rejected, (state, action) => {
        state.getChatHistoryStates.loading = false;
        state.getChatHistoryStates.error = true;
        state.getChatHistoryStates.result = action.payload;
      })
      .addCase(getChatHistoryThunk.fulfilled, (state, action) => {
        state.getChatHistoryStates.loading = false;
        state.getChatHistoryStates.error = false;
        state.getChatHistoryStates.success = true;
        state.getChatHistoryStates.result = action.payload;
        state.messages = action.payload;
      });
  },
});

export const {
  setOnlineContact,
  setContected,
  setSokcetConnetingError,
  setSokcetError,
  updateSingleUserStatus,
  resetSaveContactStates,
  resetSocketStates,
  resetGetChatHistory,
  appendMessage,
  setActiveChat,
  appendNewContact,
  updateMessageStatus,
  updateContactLastMessage,
} = socketSlice.actions;

export default socketSlice.reducer;
