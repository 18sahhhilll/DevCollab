
import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (socket) socket.disconnect();

  // 🔥 Get backend URL from env
  const SOCKET_URL = import.meta.env.VITE_API_URL.replace('/api', '');

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
