import { db } from '../../config/db';

export interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  is_verified: boolean;
  role: 'admin' | 'organizer' | 'attendee';
}

export interface EmailVerificationRow {
  id: number;
  user_id: number;
  token: string;
  is_used: boolean;
  expires_at: Date;
}

export interface TwoFARow {
  id: number;
  user_id: number;
  secret: string;
  is_enabled: boolean;
}

/**
 * Users, refresh_tokens, email_verifications, user_2fa
 * Used only by AuthService.
 */
export class AuthRepository {
  // ─── existing user methods ───────────────────────────────

  async findUserByEmail(email: string): Promise<UserRow | undefined> {
    return db('users').where({ email }).first();
  }

  async findUserById(id: number): Promise<UserRow | undefined> {
    return db('users').where({ id }).first();
  }

  async createUser(data: {
    email: string;
    name: string;
    password_hash: string;
  }): Promise<number> {
    const [id] = await db('users').insert(data);
    return id;
  }

  async updateIsVerified(userId: number): Promise<void> {
    await db('users').where({ id: userId }).update({ is_verified: true });
  }

  // ─── existing refresh token methods ──────────────────────

  async findRefreshToken(
    tokenHash: string
  ): Promise<{ id: number; user_id: number; expires_at: Date } | undefined> {
    return db('refresh_tokens')
      .where({ token_hash: tokenHash })
      .where('expires_at', '>', new Date())
      .first();
  }

  async createRefreshToken(data: {
    user_id: number;
    token_hash: string;
    expires_at: Date;
  }): Promise<void> {
    await db('refresh_tokens').insert(data);
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await db('refresh_tokens').where({ id }).del();
  }

  async deleteRefreshTokenByHash(tokenHash: string): Promise<void> {
    await db('refresh_tokens').where({ token_hash: tokenHash }).del();
  }

  // ─── email verification methods ──────────────────────────

  async createVerificationToken(data: {
    user_id: number;
    token: string;
    expires_at: Date;
  }): Promise<void> {
    await db('email_verifications').insert(data);
  }

  async findVerificationToken(
    token: string
  ): Promise<EmailVerificationRow | undefined> {
    return db('email_verifications').where({ token }).first();
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await db('email_verifications')
      .where({ token })
      .update({ is_used: true });
  }


}