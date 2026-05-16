import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { createShelter, listShelters, updateShelter } from '../../services/shelter.service.js';

export const getShelters = asyncHandler(async (_req, res) => {
  sendSuccess(res, await listShelters(), 'Shelters loaded');
});

export const postShelter = asyncHandler(async (req, res) => {
  sendSuccess(res, await createShelter(req.body), 'Shelter created', 201);
});

export const patchShelter = asyncHandler(async (req, res) => {
  sendSuccess(res, await updateShelter(req.params.id, req.body), 'Shelter updated');
});
