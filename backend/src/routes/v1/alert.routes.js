import { Router } from 'express';
import { getAlerts, publishAlert } from '../../controllers/v1/alert.controller.js';
import { allowRoles, requireAuth } from '../../middleware/authMiddleware.js';

export const alertRouter = Router();

alertRouter.use(requireAuth);
alertRouter.get('/', getAlerts);
alertRouter.post('/', allowRoles('admin', 'authority'), publishAlert);
