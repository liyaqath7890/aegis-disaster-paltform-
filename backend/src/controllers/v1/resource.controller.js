import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { createResource, listResources, updateResource } from '../../services/resource.service.js';

export const getResources = asyncHandler(async (_req, res) => {
  sendSuccess(res, await listResources(), 'Resources loaded');
});

export const postResource = asyncHandler(async (req, res) => {
  sendSuccess(res, await createResource(req.user.id, req.body), 'Resource created', 201);
});

export const patchResource = asyncHandler(async (req, res) => {
  sendSuccess(res, await updateResource(req.params.id, req.body), 'Resource updated');
});
