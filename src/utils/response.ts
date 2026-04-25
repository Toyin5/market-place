import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

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
    statusCode as ContentfulStatusCode,
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
    statusCode as ContentfulStatusCode,
  );
};
