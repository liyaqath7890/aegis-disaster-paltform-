import { SOCKET_EVENTS } from './socketEvents.js';

let socketServer = null;

export function setSocketServer(io) {
  socketServer = io;
}

export function emitSosCreated(incident) {
  socketServer?.to('authorities').emit(SOCKET_EVENTS.SOS_CREATED, incident);
}

export function emitAlertBroadcast(alert) {
  socketServer?.emit(SOCKET_EVENTS.ALERT_BROADCAST, alert);
}

export function emitTrackingUpdate(payload) {
  socketServer?.to(payload.room || 'tracking').emit(SOCKET_EVENTS.TRACKING_UPDATE, payload);
}
