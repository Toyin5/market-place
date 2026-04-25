import { z } from 'zod';

import {
  fabricTypesSchema,
  nigerianStateSchema,
  phoneNumberSchema,
  requiredText,
} from '../../utils/schemas';

const optionalNullablePriceSchema = z.union([
  z.number().nonnegative('Price must be zero or greater'),
  z.null(),
]);

export const producerRegistrationFieldsSchema = z.object({
  businessName: requiredText('businessName', 2, 120),
  description: requiredText('description', 10, 1000),
  locationState: nigerianStateSchema,
  locationCity: requiredText('locationCity', 2, 120),
  address: requiredText('address', 5, 255),
  fabricTypes: fabricTypesSchema,
  minimumOrderQuantity: z
    .number({
      required_error: 'minimumOrderQuantity is required',
      invalid_type_error: 'minimumOrderQuantity must be a number',
    })
    .int('minimumOrderQuantity must be an integer')
    .positive('minimumOrderQuantity must be greater than zero'),
  deliveryAvailable: z.boolean({
    required_error: 'deliveryAvailable is required',
    invalid_type_error: 'deliveryAvailable must be a boolean',
  }),
  whatsappNumber: phoneNumberSchema('whatsappNumber'),
});

export const updateProducerProfileSchema = z
  .object({
    businessName: requiredText('businessName', 2, 120).optional(),
    description: requiredText('description', 10, 1000).optional(),
    locationState: nigerianStateSchema.optional(),
    locationCity: requiredText('locationCity', 2, 120).optional(),
    address: requiredText('address', 5, 255).optional(),
    fabricTypes: fabricTypesSchema.optional(),
    priceRangeMin: optionalNullablePriceSchema.optional(),
    priceRangeMax: optionalNullablePriceSchema.optional(),
    minimumOrderQuantity: z
      .number({
        invalid_type_error: 'minimumOrderQuantity must be a number',
      })
      .int('minimumOrderQuantity must be an integer')
      .positive('minimumOrderQuantity must be greater than zero')
      .optional(),
    deliveryAvailable: z.boolean({
      invalid_type_error: 'deliveryAvailable must be a boolean',
    }).optional(),
    whatsappNumber: phoneNumberSchema('whatsappNumber').optional(),
    profileImageUrl: z
      .union([
        z.string().url('profileImageUrl must be a valid URL'),
        z.null(),
      ])
      .optional(),
  })
  .superRefine((value, context) => {
    if (!Object.values(value).some((fieldValue) => fieldValue !== undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided for update',
      });
    }

    if (
      value.priceRangeMin !== undefined &&
      value.priceRangeMax !== undefined &&
      value.priceRangeMin !== null &&
      value.priceRangeMax !== null &&
      value.priceRangeMin > value.priceRangeMax
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceRangeMax'],
        message: 'priceRangeMax must be greater than or equal to priceRangeMin',
      });
    }
  });

export type UpdateProducerProfileInput = z.infer<typeof updateProducerProfileSchema>;
