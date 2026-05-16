import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { createMissingPerson, listMissingPersons, updateMissingPersonStatus } from '../../services/missingPerson.service.js';

export const getMissingPersons = asyncHandler(async (_req, res) => {
  sendSuccess(res, await listMissingPersons(), 'Missing person reports loaded');
});

export const postMissingPerson = asyncHandler(async (req, res) => {
  sendSuccess(res, await createMissingPerson(req.user.id, req.body), 'Missing person report created', 201);
});

export const patchMissingPersonStatus = asyncHandler(async (req, res) => {
  sendSuccess(res, await updateMissingPersonStatus(req.params.id, req.body.status), 'Missing person status updated');
});
