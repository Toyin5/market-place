import { Prisma } from '@prisma/client';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { AppError } from '../utils/app-error';
import { errorResponse } from '../utils/response';
import { formatZodErrors } from '../utils/validation';

export const errorHandler = (error: Error, context: Context) => {
  if (error instanceof AppError) {
    return errorResponse(context, error.message, error.errors, error.statusCode);
  }

  if (error instanceof ZodError) {
    return errorResponse(context, 'Validation failed', formatZodErrors(error), 400);
  }

  if (error instanceof HTTPException) {
    return errorResponse(context, error.message || 'Request failed', [], error.status);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return errorResponse(context, 'A resource with the provided unique field already exists', [], 409);
    }
  }

  console.error(error);
  return errorResponse(context, 'An unexpected error occurred', [], 500);
};

export const notFoundHandler = (context: Context) => {
  return errorResponse(context, 'Resource not found', [], 404);
};
