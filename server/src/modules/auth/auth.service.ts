import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { config } from '../../config';
import { AuthRepository } from './auth.repository';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../../shared/errors';
import { sendVerificationEmail } from '../../shared/mailer';
import type { SignupDto, LoginDto } from './auth.schema';

const SALT_ROUNDS = 12;
const VERIFICATION_TOKEN_EXPIRES_HOURS = 24;

function hashRefreshToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export interface AuthResult {
  user: { id: number; email: string; name: string; role: string };
  token: string;
  refreshToken: string;
}

export interface LoginResult {
  requires2FA: boolean;
  userId?: number;
  user?: { id: number; email: string; name: string, role: string };
  token?: string;
  refreshToken?: string;
}

/**
 * Auth business logic: signup, login, refresh, logout,
 * email verification, and 2FA.
 */
export class AuthService {
  private repo = new AuthRepository();

  // Signup creates a new user, generates a verification token, and sends a verification email.

  async signup(dto: SignupDto): Promise<{ message: string }> {
    const existing = await this.repo.findUserByEmail(dto.email);
    if (existing) throw new ConflictError('An account with this email already exists');

    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const userId = await this.repo.createUser({
      email: dto.email,
      name: dto.name,
      password_hash,
    });

    // generate verification token and send email
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
    );
    await this.repo.createVerificationToken({ user_id: userId, token, expires_at: expiresAt });
    await sendVerificationEmail(dto.email, token);

    return { message: 'Account created. Please verify your email.' };
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedError('Invalid email or password');

    // block login if email not verified
    if (!user.is_verified) {
      throw new UnauthorizedError('Please verify your email before logging in');
    }


    const result = await this.issueTokens(user);
    return { requires2FA: false, ...result };
  }

  // Refresh simply issues a new access token if the refresh token is valid.

  async refresh(rawRefreshToken: string): Promise<AuthResult> {
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const stored = await this.repo.findRefreshToken(tokenHash);
    if (!stored) throw new UnauthorizedError('Invalid or expired refresh token');

    await this.repo.deleteRefreshToken(stored.id);
    const user = await this.repo.findUserById(stored.user_id);
    if (!user) throw new UnauthorizedError('User not found');

    return this.issueTokens(user);
  }

  // Logout simply deletes the refresh token, effectively invalidating it

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = hashRefreshToken(rawRefreshToken);
      await this.repo.deleteRefreshTokenByHash(tokenHash);
    }
  }

  // Email Verification

  async verifyEmail(token: string): Promise<{ message: string }> {
    const record = await this.repo.findVerificationToken(token);

    if (!record) throw new NotFoundError('Invalid verification token');
    if (record.is_used) throw new BadRequestError('Token already used');
    if (new Date() > new Date(record.expires_at)) {
      throw new BadRequestError('Token has expired');
    }

    await this.repo.markTokenAsUsed(token);
    await this.repo.updateIsVerified(record.user_id);

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.repo.findUserByEmail(email);
    if (!user) throw new NotFoundError('User not found');
    if (user.is_verified) throw new BadRequestError('Email already verified');

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000
    );
    await this.repo.createVerificationToken({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });
    await sendVerificationEmail(email, token);

    return { message: 'Verification email resent' };
  }


  // Private

  private async issueTokens(user: {
    id: number;
    email: string;
    name: string;
    role: string;   
  }): Promise<AuthResult> {
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, 
      config.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: config.ACCESS_TOKEN_TTL } as jwt.SignOptions
    );
    const refreshRaw = crypto.randomBytes(64).toString('hex');
    const refreshHash = hashRefreshToken(refreshRaw);
    const expiresAt = new Date(
      Date.now() + config.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
    );
    await this.repo.createRefreshToken({
      user_id: user.id,
      token_hash: refreshHash,
      expires_at: expiresAt,
    });
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
      refreshToken: refreshRaw,
    };
  }
}