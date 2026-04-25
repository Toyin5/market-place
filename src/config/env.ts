import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  CORS_ORIGIN: z.string().default('*'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Application failed to start because environment variables are invalid.');
}

export const env = parsedEnv.data;
