import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export {};