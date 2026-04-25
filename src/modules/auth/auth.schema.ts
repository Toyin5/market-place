import { UserRole } from '@prisma/client';
import { z } from 'zod';

import { producerRegistrationFieldsSchema } from '../producers/producers.schema';
import { emailSchema, passwordSchema, phoneNumberSchema, requiredText } from '../../utils/schemas';

const authCommonSchema = z.object({
  fullName: requiredText('fullName', 2, 120),
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneNumberSchema('phoneNumber'),
});

const designerRegisterSchema = authCommonSchema.extend({
  role: z.literal(UserRole.DESIGNER),
});

const producerRegisterSchema = authCommonSchema.extend({
  role: z.literal(UserRole.PRODUCER),
  ...producerRegistrationFieldsSchema.shape,
});

export const registerSchema = z.discriminatedUnion('role', [
  designerRegisterSchema,
  producerRegisterSchema,
]);

export const loginSchema = z.object({
  email: emailSchema,
  password: requiredText('password', 8, 72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
