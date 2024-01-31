import { config } from 'dotenv';

config();

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRED: process.env.JWT_EXPIRES_IN,
  DATABASE_URL: process.env.DATABASE_URL,
  BACKEND_URL: process.env.BACKEND_URL,
};
