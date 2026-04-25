import { Hono } from 'hono';

import { authMiddleware } from '../../middlewares/auth.middleware';
import type { AppBindings } from '../../types/hono';
import { successResponse } from '../../utils/response';
import { validateSchema } from '../../utils/validation';
import { authService } from './auth.service';
import { loginSchema, registerSchema } from './auth.schema';

export const authRoutes = new Hono<AppBindings>();

authRoutes.post('/register', async (context) => {
  const payload = validateSchema(registerSchema, await context.req.json());
  const result = await authService.register(payload);

  return successResponse(context, 'Registration successful', result, 201);
});

authRoutes.post('/login', async (context) => {
  const payload = validateSchema(loginSchema, await context.req.json());
  const result = await authService.login(payload);

  return successResponse(context, 'Login successful', result);
});

authRoutes.get('/me', authMiddleware, async (context) => {
  const result = await authService.getCurrentUser(context.get('authUser'));

  return successResponse(context, 'Current user fetched successfully', result);
});
