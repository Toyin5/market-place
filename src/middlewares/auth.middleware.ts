import type { UserRole } from '@prisma/client';
import { createMiddleware } from 'hono/factory';

import type { AppBindings } from '../types/hono';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/app-error';

export const authMiddleware = createMiddleware<AppBindings>(async (context, next) => {
  const authorizationHeader = context.req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication is required');
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    const payload = await verifyAccessToken(token);

    if (!payload.sub || !payload.email || !payload.role) {
      throw new AppError(401, 'Invalid access token');
    }

    context.set('authUser', {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    await next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, 'Invalid or expired access token');
  }
});

export const requireRole = (roles: UserRole | UserRole[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return createMiddleware<AppBindings>(async (context, next) => {
    const authUser = context.get('authUser');

    if (!allowedRoles.includes(authUser.role)) {
      throw new AppError(403, 'You do not have permission to access this resource');
    }

    await next();
  });
};
