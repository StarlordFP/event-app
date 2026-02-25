import { db } from '../../config/db';

export interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
}

/**
 * Users and refresh_tokens. Used only by AuthService.
 */
export class AuthRepository {
  async findUserByEmail(email: string): Promise<UserRow | undefined> {
    return db('users').where({ email }).first();
  }

  async findUserById(id: number): Promise<UserRow | undefined> {
    return db('users').where({ id }).first();
  }

  async createUser(data: { email: string; name: string; password_hash: string }): Promise<number> {
    const [id] = await db('users').insert(data);
    return id;
  }

  async findRefreshToken(tokenHash: string): Promise<{ id: number; user_id: number; expires_at: Date } | undefined> {
    return db('refresh_tokens')
      .where({ token_hash: tokenHash })
      .where('expires_at', '>', new Date())
      .first();
  }

  async createRefreshToken(data: { user_id: number; token_hash: string; expires_at: Date }): Promise<void> {
    await db('refresh_tokens').insert(data);
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await db('refresh_tokens').where({ id }).del();
  }

  async deleteRefreshTokenByHash(tokenHash: string): Promise<void> {
    await db('refresh_tokens').where({ token_hash: tokenHash }).del();
  }
}
