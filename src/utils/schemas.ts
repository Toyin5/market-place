import { z } from 'zod';

import {
  normalizeEmail,
  normalizePhoneNumber,
  normalizeStringList,
  normalizeWhitespace,
} from './normalizers';
import { normalizeNigerianState } from './nigerian-states';

export const requiredText = (fieldName: string, minLength = 2, maxLength = 255) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .transform(normalizeWhitespace)
    .pipe(
      z
        .string()
        .min(minLength, `${fieldName} must be at least ${minLength} characters`)
        .max(maxLength, `${fieldName} must be at most ${maxLength} characters`),
    );

export const emailSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .email('A valid email address is required')
  .transform(normalizeEmail);

export const passwordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[A-Za-z]/, 'Password must include at least one letter')
  .regex(/\d/, 'Password must include at least one number');

export const phoneNumberSchema = (fieldName: string) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .transform(normalizePhoneNumber)
    .pipe(
      z
        .string()
        .min(10, `${fieldName} must be at least 10 characters`)
        .max(20, `${fieldName} must be at most 20 characters`),
    );

export const nigerianStateSchema = z
  .string({
    required_error: 'locationState is required',
    invalid_type_error: 'locationState must be a string',
  })
  .transform((value, context) => {
    const normalizedState = normalizeNigerianState(value);

    if (!normalizedState) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'locationState must be a valid Nigerian state',
      });
      return z.NEVER;
    }

    return normalizedState;
  });

export const fabricTypesSchema = z
  .array(requiredText('fabric type', 2, 80), {
    invalid_type_error: 'fabricTypes must be an array of strings',
    required_error: 'fabricTypes is required',
  })
  .min(1, 'At least one fabric type is required')
  .transform(normalizeStringList);
