import type { UserRole } from '@prisma/client';
import { sign, verify } from 'hono/jwt';
import { z } from 'zod';

import { env } from '../config/env';
import type { AuthTokenPayload } from '../types/auth';
import { AppError } from './app-error';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.custom<UserRole>(),
  iat: z.number(),
  exp: z.number(),
});

const parseJwtExpirationToSeconds = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();
  const durationMatch = normalizedValue.match(/^(\d+)([smhd])$/);

  if (durationMatch) {
    const [, rawAmount, rawUnit] = durationMatch;

    if (!rawAmount || !rawUnit) {
      throw new AppError(500, 'JWT_EXPIRES_IN must be a positive number or duration like 7d');
    }

    const amount = Number(rawAmount);

    const unitToSecondsMap: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
    };

    const seconds = unitToSecondsMap[rawUnit];

    if (!seconds) {
      throw new AppError(500, 'JWT_EXPIRES_IN must be a positive number or duration like 7d');
    }

    return amount * seconds;
  }

  const rawSeconds = Number(normalizedValue);

  if (!Number.isNaN(rawSeconds) && rawSeconds > 0) {
    return rawSeconds;
  }

  throw new AppError(500, 'JWT_EXPIRES_IN must be a positive number or duration like 7d');
};

export const createAccessToken = async (payload: AuthTokenPayload) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseJwtExpirationToSeconds(env.JWT_EXPIRES_IN);

  return sign(
    {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
      iat: now,
      exp,
    },
    env.JWT_SECRET,
    'HS256',
  );
};

export const verifyAccessToken = async (token: string) => {
  const payload = await verify(token, env.JWT_SECRET, 'HS256');

  return jwtPayloadSchema.parse(payload) as JwtPayload;
};
