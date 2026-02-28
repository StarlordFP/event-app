import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';


export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Operational errors (our AppError subclasses)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  // MySQL duplicate entry
  if ((err as NodeJS.ErrnoException).code === 'ER_DUP_ENTRY') {
    res.status(409).json({
      error: 'A resource with this value already exists',
      code: 'CONFLICT',
    });
    return;
  }

  // Unknown / programming errors
  console.error('Unhandled error', err.message, err.stack);
  res.status(500).json({
    error: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
  });
}

// unknown routes
export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found', path: req.path });
}
