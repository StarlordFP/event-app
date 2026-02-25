import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME || 'refreshToken',
  REFRESH_TOKEN_DAYS: Number(process.env.REFRESH_TOKEN_DAYS) || 7,

  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'event_app',
} as const;
