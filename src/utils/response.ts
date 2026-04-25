import type { Context } from 'hono';

export const successResponse = <T>(
  context: Context,
  message: string,
  data: T = {} as T,
  statusCode = 200,
) => {
  return context.json(
    {
      success: true,
      message,
      data,
    },
    statusCode,
  );
};

export const errorResponse = (
  context: Context,
  message: string,
  errors: unknown[] = [],
  statusCode = 400,
) => {
  return context.json(
    {
      success: false,
      message,
      errors,
    },
    statusCode,
  );
};
