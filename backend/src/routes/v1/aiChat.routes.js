import { Router } from 'express';
import * as aiChatController from '../../controllers/v1/aiChat.controller.js';

const router = Router();

// Public route — emergency guidance must be accessible without login
router.post('/guidance', aiChatController.getEmergencyGuidance);

export default router;
