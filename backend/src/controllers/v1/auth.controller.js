import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { env } from '../../config/env.js';
import { loginUser, refreshAuthSession, registerUser, revokeAuthSession } from '../../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.validated.body, getRequestContext(req));
  setRefreshCookie(res, data.refreshToken);
  sendSuccess(res, { user: data.user, accessToken: data.accessToken }, 'Registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.validated.body, getRequestContext(req));
  setRefreshCookie(res, data.refreshToken);
  sendSuccess(res, { user: data.user, accessToken: data.accessToken }, 'Logged in successfully');
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user }, 'Current user loaded');
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await refreshAuthSession(req.cookies?.[env.refreshCookieName], getRequestContext(req));
  setRefreshCookie(res, data.refreshToken);
  sendSuccess(res, { user: data.user, accessToken: data.accessToken }, 'Session refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  await revokeAuthSession(req.cookies?.[env.refreshCookieName]);
  clearRefreshCookie(res);
  sendSuccess(res, null, 'Logged out successfully');
});

function getRequestContext(req) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip
  };
}

function setRefreshCookie(res, refreshToken) {
  res.cookie(env.refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production'
  });
}
