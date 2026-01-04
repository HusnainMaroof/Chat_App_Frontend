import { io } from "socket.io-client";

let socket = null;
let origin = import.meta.env.VITE_BACKEND_ORIGIN
export const initSocket = () => {
    if (!socket) {
        socket = io(origin, {
            withCredentials: true,
            autoConnect: false
        })

    }
    return socket
}

export const getSocket = () => socket