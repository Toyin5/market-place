import { UserRole } from '@prisma/client';
import { Hono } from 'hono';

import { authMiddleware, requireRole } from '../../middlewares/auth.middleware';
import type { AppBindings } from '../../types/hono';
import { successResponse } from '../../utils/response';
import { validateSchema } from '../../utils/validation';
import { producersService } from './producers.service';
import { updateProducerProfileSchema } from './producers.schema';

export const producersRoutes = new Hono<AppBindings>();

producersRoutes.get('/me', authMiddleware, requireRole(UserRole.PRODUCER), async (context) => {
  const result = await producersService.getMyProfile(context.get('authUser'));

  return successResponse(context, 'Producer profile fetched successfully', result);
});

producersRoutes.put('/me', authMiddleware, requireRole(UserRole.PRODUCER), async (context) => {
  const payload = validateSchema(updateProducerProfileSchema, await context.req.json());
  const result = await producersService.updateMyProfile(context.get('authUser'), payload);

  return successResponse(context, 'Producer profile updated successfully', result);
});

producersRoutes.get('/:id', async (context) => {
  const result = await producersService.getProducerById(context.req.param('id'));

  return successResponse(context, 'Producer profile fetched successfully', result);
});
