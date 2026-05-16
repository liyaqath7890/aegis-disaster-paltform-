import { sendSuccess } from '../../utils/apiResponse.js';

export function moduleStatus(moduleName) {
  return (_req, res) => {
    sendSuccess(res, { module: moduleName, status: 'scaffolded' }, `${moduleName} module ready`);
  };
}
