import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

// Central error handler — attach to app LAST
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({ message });
};

// Helper to create errors with a status code
export const createError = (message: string, statusCode: number): AppError => {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  return err;
};