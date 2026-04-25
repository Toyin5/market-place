import { z } from 'zod';

import { nigerianStateSchema } from '../../utils/schemas';
import {
  optionalBooleanQuery,
  optionalIntegerQuery,
  optionalNumberQuery,
  optionalTrimmedStringQuery,
} from '../../utils/validation';

export const marketplaceSearchSchema = z
  .object({
    locationState: z.preprocess(
      (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
      nigerianStateSchema.optional(),
    ),
    locationCity: optionalTrimmedStringQuery('locationCity'),
    fabricType: optionalTrimmedStringQuery('fabricType'),
    deliveryAvailable: optionalBooleanQuery('deliveryAvailable'),
    minPrice: optionalNumberQuery('minPrice'),
    maxPrice: optionalNumberQuery('maxPrice'),
    search: optionalTrimmedStringQuery('search'),
    page: optionalIntegerQuery('page', 1),
    limit: optionalIntegerQuery('limit', 20).refine((value) => value <= 100, {
      message: 'limit must not exceed 100',
    }),
    sortBy: z
      .enum(['newest', 'rating', 'businessName'], {
        invalid_type_error: 'sortBy must be one of newest, rating, or businessName',
      })
      .default('newest'),
  })
  .superRefine((value, context) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxPrice'],
        message: 'maxPrice must be greater than or equal to minPrice',
      });
    }
  });

export type MarketplaceSearchInput = z.infer<typeof marketplaceSearchSchema>;
