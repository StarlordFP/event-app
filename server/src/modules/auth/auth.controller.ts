import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { AuthService } from './auth.service';
import { UnauthorizedError } from '../../shared/errors';

export class AuthController {
  private service = new AuthService();

  private setRefreshCookie(res: Response, raw: string): void {
    res.cookie(config.REFRESH_COOKIE_NAME, raw, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: config.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(config.REFRESH_COOKIE_NAME, { path: '/', httpOnly: true });
  }

  // ─── Existing ─────────────────────────────────────────────

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.signup(req.body);
      res.status(201).json(result); // just returns { message }
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(req.body);
      // if 2FA required, don't set cookie yet
      if (result.requires2FA) {
        res.json({ requires2FA: true, userId: result.userId });
        return;
      }
      this.setRefreshCookie(res, result.refreshToken!);
      res.json({ user: result.user, token: result.token });
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = req.cookies?.[config.REFRESH_COOKIE_NAME];
      if (!raw) throw new UnauthorizedError('Refresh token required');
      const { user, token, refreshToken } = await this.service.refresh(raw);
      this.setRefreshCookie(res, refreshToken);
      res.json({ user, token });
    } catch (err) {
      this.clearRefreshCookie(res);
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = req.cookies?.[config.REFRESH_COOKIE_NAME];
      await this.service.logout(raw);
      this.clearRefreshCookie(res);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  // ─── Email Verification ───────────────────────────────────

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.verifyEmail(req.body.token);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.resendVerification(req.body.email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}