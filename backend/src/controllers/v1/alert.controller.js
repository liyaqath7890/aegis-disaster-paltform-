import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { createAlert, listAlerts } from '../../services/alert.service.js';
import { emitAlertBroadcast } from '../../sockets/emitters.js';

export const publishAlert = asyncHandler(async (req, res) => {
  const alert = await createAlert(req.user.id, req.body);
  emitAlertBroadcast(alert);
  sendSuccess(res, alert, 'Alert published', 201);
});

export const getAlerts = asyncHandler(async (_req, res) => {
  const alerts = await listAlerts();
  sendSuccess(res, alerts, 'Alerts loaded');
});
