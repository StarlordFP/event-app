import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

// Factory: returns a middleware that validates req.body against a Zod schema
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data; // replace with parsed/coerced data
    next();
  };