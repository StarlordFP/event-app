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

 //Validates Bearer token and attaches user info. Rejects if invalid.

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

 //Attaches user info from Bearer token if present. Always allows request through.
 
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
