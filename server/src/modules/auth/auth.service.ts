import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AuthRepository } from './auth.repository';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import type { SignupDto, LoginDto } from './auth.schema';

const SALT_ROUNDS = 12;

function hashRefreshToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export interface AuthResult {
  user: { id: number; email: string; name: string };
  token: string;
  refreshToken: string;
}

/**
 * Auth business logic: signup, login, refresh, logout.
 * Token generation and refresh token rotation.
 */
export class AuthService {
  private repo = new AuthRepository();

  async signup(dto: SignupDto): Promise<AuthResult> {
    const existing = await this.repo.findUserByEmail(dto.email);
    if (existing) throw new ConflictError('An account with this email already exists');
    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const userId = await this.repo.createUser({
      email: dto.email,
      name: dto.name,
      password_hash,
    });
    const user = await this.repo.findUserById(userId);
    if (!user) throw new Error('User not found after create');
    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedError('Invalid email or password');
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedError('Invalid email or password');
    return this.issueTokens(user);
  }

  async refresh(rawRefreshToken: string): Promise<AuthResult> {
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const stored = await this.repo.findRefreshToken(tokenHash);
    if (!stored) throw new UnauthorizedError('Invalid or expired refresh token');
    await this.repo.deleteRefreshToken(stored.id);
    const user = await this.repo.findUserById(stored.user_id);
    if (!user) throw new UnauthorizedError('User not found');
    return this.issueTokens(user);
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = hashRefreshToken(rawRefreshToken);
      await this.repo.deleteRefreshTokenByHash(tokenHash);
    }
  }

  private async issueTokens(user: { id: number; email: string; name: string }): Promise<AuthResult> {
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: config.ACCESS_TOKEN_TTL } as jwt.SignOptions
    );
    const refreshRaw = crypto.randomBytes(64).toString('hex');
    const refreshHash = hashRefreshToken(refreshRaw);
    const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
    await this.repo.createRefreshToken({
      user_id: user.id,
      token_hash: refreshHash,
      expires_at: expiresAt,
    });
    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
      refreshToken: refreshRaw,
    };
  }
}
