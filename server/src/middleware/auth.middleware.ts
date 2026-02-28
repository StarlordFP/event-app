import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError } from '../shared/errors';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// export type Role = 'admin' | 'organizer' | 'attendee';

// export function authorize(...roles: Role[]) {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       next(new UnauthorizedError('Authentication required'));
//       return;
//     }
//     if (!roles.includes(req.user.role as Role)) {
//       next(new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`));
//       return;
//     }
//     next();
//   };
// }

/**
 * Require valid Bearer token. Sets req.user and req.userId. Passes UnauthorizedError to next() otherwise.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or invalid Authorization header'));
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = { id: payload.userId, email: payload.email, role: payload.role  };
    req.userId = payload.userId;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired access token'));
  }
}

/**
 * Optional auth: attach user if valid token present; never reject.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), config.JWT_SECRET) as JwtPayload;
      req.user = { id: payload.userId, email: payload.email, role: payload.role  };
      req.userId = payload.userId;
    } catch {
      // ignore
    }
  }
  next();
}
