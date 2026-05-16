import { verifyAccessToken } from '../helpers/token.js';
import { createChatMessage } from '../services/chat.service.js';
import { SOCKET_EVENTS } from './socketEvents.js';
import { setSocketServer } from './emitters.js';

const roomUsers = new Map();

export function registerSocketHandlers(io) {
  setSocketServer(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next();
    }

    try {
      socket.user = verifyAccessToken(token);
      return next();
    } catch {
      return next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', (socket) => {
    socket.joinedChatRooms = new Set();

    if (['admin', 'authority'].includes(socket.user?.role)) {
      socket.join('authorities');
    }

    socket.on(SOCKET_EVENTS.CHAT_JOIN_ROOM, ({ roomId }) => {
      if (!roomId || !socket.user) return;
      socket.join(roomId);
      socket.joinedChatRooms.add(roomId);
      addRoomUser(roomId, socket);
      emitRoomUsers(io, roomId);
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async (payload, callback) => {
      try {
        if (!payload.roomId || !payload.content?.trim() || !socket.user?.sub) return;

        const message = await createChatMessage({
          roomId: payload.roomId,
          senderId: socket.user.sub,
          content: payload.content.trim(),
          metadata: payload.metadata || {}
        });

        io.to(payload.roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, message.toJSON());
        callback?.({ ok: true, message: message.toJSON() });
      } catch (error) {
        callback?.({ ok: false, error: error.message });
      }
    });

    socket.on(SOCKET_EVENTS.CHAT_TYPING, ({ roomId, user }) => {
      if (!roomId) return;
      socket.to(roomId).emit(SOCKET_EVENTS.CHAT_TYPING, {
        roomId,
        user: user || { id: socket.user?.sub, name: 'Responder' }
      });
    });

    socket.on(SOCKET_EVENTS.CHAT_STOP_TYPING, ({ roomId, user }) => {
      if (!roomId) return;
      socket.to(roomId).emit(SOCKET_EVENTS.CHAT_STOP_TYPING, {
        roomId,
        user: user || { id: socket.user?.sub, name: 'Responder' }
      });
    });

    socket.on(SOCKET_EVENTS.TRACKING_UPDATE, (payload) => {
      socket.broadcast.emit(SOCKET_EVENTS.TRACKING_UPDATE, payload);
    });

    socket.on('disconnect', () => {
      for (const roomId of socket.joinedChatRooms) {
        removeRoomUser(roomId, socket);
        emitRoomUsers(io, roomId);
      }
    });
  });
}

function addRoomUser(roomId, socket) {
  const users = roomUsers.get(roomId) || new Map();
  users.set(socket.id, {
    id: socket.user?.sub,
    socketId: socket.id,
    role: socket.user?.role,
    name: socket.handshake.auth?.name || 'Responder'
  });
  roomUsers.set(roomId, users);
}

function removeRoomUser(roomId, socket) {
  const users = roomUsers.get(roomId);
  if (!users) return;
  users.delete(socket.id);
  if (users.size === 0) {
    roomUsers.delete(roomId);
  }
}

function emitRoomUsers(io, roomId) {
  const users = Array.from(roomUsers.get(roomId)?.values() || []);
  io.to(roomId).emit(SOCKET_EVENTS.CHAT_ROOM_USERS, { roomId, users });
}
