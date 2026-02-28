import { db } from '../../config/db';

export interface AdminUserRow {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'attendee';
  is_verified: boolean;
  created_at: string;
}

/**
 * Admin-only DB queries.
 * Handles user management and full event visibility.
 */
export class AdminRepository {

  // ─── Users ────────────────────────────────────────────────

  async findAllUsers(): Promise<AdminUserRow[]> {
    return db('users').select('id', 'email', 'name', 'role', 'is_verified', 'created_at')
      .orderBy('created_at', 'desc');
  }

  async findUserById(id: number): Promise<AdminUserRow | undefined> {
    return db('users')
      .select('id', 'email', 'name', 'role', 'is_verified', 'created_at')
      .where({ id })
      .first();
  }

  async updateUserRole(
    userId: number,
    role: 'admin' | 'organizer' | 'attendee'
  ): Promise<void> {
    await db('users').where({ id: userId }).update({ role });
  }

  async deleteUser(userId: number): Promise<void> {
    await db('users').where({ id: userId }).del();
  }

  // ─── Events ───────────────────────────────────────────────

  async findAllEvents(): Promise<any[]> {
    return db('events')
      .leftJoin('users', 'users.id', 'events.user_id')
      .select(
        'events.id',
        'events.title',
        'events.description',
        'events.event_date',
        'events.location',
        'events.event_type',
        'events.user_id',
        'events.created_at',
        'users.name as creator_name'
      )
      .orderBy('events.created_at', 'desc');
  }

  async deleteEvent(eventId: number): Promise<void> {
    await db('events').where({ id: eventId }).del();
  }
}
