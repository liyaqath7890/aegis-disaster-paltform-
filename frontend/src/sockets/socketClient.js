import { io } from 'socket.io-client';

function trimTrailingSlash(value) {
  return value ? value.replace(/\/+$/, '') : value;
}

const socketUrl =
  trimTrailingSlash(import.meta.env.VITE_SOCKET_URL) ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : trimTrailingSlash(window.location.origin));

export const socket = io(socketUrl, {
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
