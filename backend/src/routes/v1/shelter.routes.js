import { Router } from 'express';
import { getShelters, patchShelter, postShelter } from '../../controllers/v1/shelter.controller.js';
import { allowRoles, requireAuth } from '../../middleware/authMiddleware.js';

export const shelterRouter = Router();

shelterRouter.use(requireAuth);
shelterRouter.get('/', getShelters);
shelterRouter.post('/', allowRoles('admin', 'authority'), postShelter);
shelterRouter.patch('/:id', allowRoles('admin', 'authority'), patchShelter);
