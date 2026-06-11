import dotenv from 'dotenv';

dotenv.config();

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const frontendUrl = trimTrailingSlash(process.env.FRONTEND_URL || process.env.PUBLIC_BASE_URL || 'http://localhost:5173');
const publicBaseUrl = trimTrailingSlash(process.env.PUBLIC_BASE_URL || frontendUrl);

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: frontendUrl,
  PUBLIC_BASE_URL: publicBaseUrl
};
