import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice"
import socketSlice from "../features/socket/socketSlice"
export const store = configureStore({
    reducer: {
        auth: authSlice,
        socket: socketSlice
    }
})