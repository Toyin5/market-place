import { Hono } from 'hono';

import type { AppBindings } from '../../types/hono';
import { successResponse } from '../../utils/response';
import { validateSchema } from '../../utils/validation';
import { marketplaceSearchSchema } from './marketplace.schema';
import { marketplaceService } from './marketplace.service';

export const marketplaceRoutes = new Hono<AppBindings>();

marketplaceRoutes.get('/producers', async (context) => {
  const filters = validateSchema(marketplaceSearchSchema, context.req.query());
  const result = await marketplaceService.searchProducers(filters);

  return successResponse(context, 'Marketplace producers fetched successfully', result);
});
