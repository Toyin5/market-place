import { z, ZodError, type ZodTypeAny } from 'zod';

import { AppError } from './app-error';

export const formatZodErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

export const validateSchema = <TSchema extends ZodTypeAny>(
  schema: TSchema,
  payload: unknown,
): z.infer<TSchema> => {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError(400, 'Validation failed', formatZodErrors(parsed.error));
  }

  return parsed.data;
};

export const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
};

export const optionalTrimmedStringQuery = (fieldName: string) =>
  z.preprocess(
    emptyStringToUndefined,
    z
      .string({
        invalid_type_error: `${fieldName} must be a string`,
      })
      .trim()
      .min(1, `${fieldName} cannot be empty`)
      .optional(),
  );

export const optionalNumberQuery = (fieldName: string) =>
  z.preprocess(
    emptyStringToUndefined,
    z.coerce
      .number({
        invalid_type_error: `${fieldName} must be a number`,
      })
      .nonnegative(`${fieldName} must be zero or greater`)
      .optional(),
  );

export const optionalIntegerQuery = (fieldName: string, defaultValue?: number) => {
  const baseSchema = z.coerce
    .number({
      invalid_type_error: `${fieldName} must be a number`,
    })
    .int(`${fieldName} must be an integer`)
    .positive(`${fieldName} must be greater than zero`);

  return z.preprocess(
    emptyStringToUndefined,
    defaultValue === undefined ? baseSchema.optional() : baseSchema.default(defaultValue),
  );
};

export const optionalBooleanQuery = (fieldName: string) =>
  z.preprocess((value) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalizedValue = value.trim().toLowerCase();

      if (normalizedValue === '') {
        return undefined;
      }

      if (normalizedValue === 'true') {
        return true;
      }

      if (normalizedValue === 'false') {
        return false;
      }
    }

    return value;
  }, z.boolean({ invalid_type_error: `${fieldName} must be either true or false` }).optional());
