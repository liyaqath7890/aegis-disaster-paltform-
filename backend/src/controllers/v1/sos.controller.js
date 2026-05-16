import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { createSosIncident, listSosIncidents } from '../../services/sos.service.js';
import { emitSosCreated } from '../../sockets/emitters.js';

export const createSos = asyncHandler(async (req, res) => {
  const incident = await createSosIncident(req.user.id, req.validated.body);
  emitSosCreated(incident.toJSON());
  sendSuccess(res, incident, 'SOS incident created', 201);
});

export const listSos = asyncHandler(async (_req, res) => {
  const incidents = await listSosIncidents();
  sendSuccess(res, incidents, 'SOS incidents loaded');
});
