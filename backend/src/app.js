import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiV1Router } from './routes/v1/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { securityHeaders } from './middleware/securityHeaders.js';

export const app = express();

app.use(helmet());
app.use(securityHeaders);
const allowedOrigins = [
  ...(Array.isArray(env.clientOrigin) ? env.clientOrigin : [env.clientOrigin]),
  'http://localhost:5180',
  'http://127.0.0.1:5180'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (env.allowAnyOrigin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'aegis-api' });
});

app.use('/api/v1', apiV1Router);
app.use(notFoundHandler);
app.use(errorHandler);
