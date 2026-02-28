import { db } from '../../config/db';

export type RsvpStatus = 'yes' | 'no' | 'maybe';

export interface RsvpRow {
  id: number;
  event_id: number;
  user_id: number;
  status: RsvpStatus;
  created_at: string;
  updated_at: string;
}

export interface RsvpWithUser extends RsvpRow {
  user_name: string;
  user_email: string;
}

export class RsvpRepository {

  // Get a single user's RSVP for an event
  async findByEventAndUser(eventId: number, userId: number): Promise<RsvpRow | undefined> {
    return db('rsvps').where({ event_id: eventId, user_id: userId }).first();
  }

  // Get all RSVPs for an event with user info
  async findAllByEvent(eventId: number): Promise<RsvpWithUser[]> {
    return db('rsvps')
      .join('users', 'users.id', 'rsvps.user_id')
      .where('rsvps.event_id', eventId)
      .select(
        'rsvps.id',
        'rsvps.event_id',
        'rsvps.user_id',
        'rsvps.status',
        'rsvps.created_at',
        'rsvps.updated_at',
        'users.name as user_name',
        'users.email as user_email'
      );
  }

  // Get RSVP counts grouped by status for an event
  async getCountsByEvent(eventId: number): Promise<{ yes: number; no: number; maybe: number }> {
    const rows = await db('rsvps')
      .where({ event_id: eventId })
      .groupBy('status')
      .select('status')
      .count('* as count');

    const counts = { yes: 0, no: 0, maybe: 0 };
    for (const row of rows as any[]) {
      counts[row.status as RsvpStatus] = Number(row.count);
    }
    return counts;
  }

  // Create or update RSVP (upsert)
  async upsert(eventId: number, userId: number, status: RsvpStatus): Promise<void> {
    const existing = await this.findByEventAndUser(eventId, userId);
    if (existing) {
      await db('rsvps')
        .where({ event_id: eventId, user_id: userId })
        .update({ status, updated_at: new Date() });
    } else {
      await db('rsvps').insert({ event_id: eventId, user_id: userId, status });
    }
  }

  // Delete RSVP
  async delete(eventId: number, userId: number): Promise<void> {
    await db('rsvps').where({ event_id: eventId, user_id: userId }).del();
  }

  // Get total RSVP count for popularity sorting
  async getRsvpCountsByEventIds(eventIds: number[]): Promise<Record<number, number>> {
    if (!eventIds.length) return {};
    const rows = await db('rsvps')
      .whereIn('event_id', eventIds)
      .where('status', 'yes')
      .groupBy('event_id')
      .select('event_id')
      .count('* as count');

    const result: Record<number, number> = {};
    for (const row of rows as any[]) {
      result[row.event_id] = Number(row.count);
    }
    return result;
  }
}
