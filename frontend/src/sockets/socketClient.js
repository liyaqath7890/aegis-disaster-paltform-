import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false,
  transports: ['websocket']
});

export function connectSocket(token, user) {
  if (socket.connected) return;
  socket.auth = { token, name: user?.name };
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}
