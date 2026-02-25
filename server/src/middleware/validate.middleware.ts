import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ValidationError } from '../shared/errors';

type Location = 'body' | 'query' | 'params';

/**
 * Factory: validation middleware for a Zod schema.
 * Validates req[location] and replaces it with the parsed value.
 * On error, passes ValidationError to next() for the global error handler.
 */
export function validate(location: Location, schema: ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req[location] = await schema.parseAsync(req[location]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          new ValidationError(
            err.issues.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            }))
          )
        );
      } else {
        next(err);
      }
    }
  };
}
