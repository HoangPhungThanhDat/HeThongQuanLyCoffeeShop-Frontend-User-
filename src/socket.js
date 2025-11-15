import { io } from "socket.io-client";

// ✅ Sửa từ import.meta.env thành process.env cho Create React App
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

if (!window.socket) {
  window.socket = io(SOCKET_URL, {
    transports: ["websocket"],
  });
}

const socket = window.socket;
export default socket;