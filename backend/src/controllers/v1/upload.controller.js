import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const uploadSingleFile = asyncHandler(async (req, res) => {
  sendSuccess(
    res,
    {
      originalName: req.file?.originalname,
      mimeType: req.file?.mimetype,
      size: req.file?.size,
      storage: 'memory',
      cloudinaryReady: true
    },
    'File accepted for upload processing',
    201
  );
});
