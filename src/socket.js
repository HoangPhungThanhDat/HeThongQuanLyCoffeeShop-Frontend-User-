import { io } from "socket.io-client";

// ✅ Dùng biến môi trường cho production
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

if (!window.socket) {
  window.socket = io(SOCKET_URL, {
    transports: ["websocket"],
  });
}

const socket = window.socket;
export default socket;