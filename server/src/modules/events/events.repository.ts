import { db } from '../../config/db';
import { TagsRepository } from '../tags/tags.repository';

export interface EventRow {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  event_type: string;
  user_id: number;
  created_at: string;
  creator_name?: string;
}

export interface EventWithTags extends EventRow {
  tags: string[];
}

interface ListQuery {
  page: number;
  limit: number;
  filter?: 'upcoming' | 'past';
  tag?: string;
  event_type?: string;
  requesterId?: number;
  search?: string;                              
  sort_by?: 'date' | 'popularity' | 'created_at'; 
  sort_order?: 'asc' | 'desc';
}

/**
 * Events table and event-tag joins. All Knex queries live here.
 */
export class EventsRepository {
  private readonly TABLE = 'events';
  private tagsRepo = new TagsRepository();

  private baseSelect() {
    return db(this.TABLE)
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
      );
  }

  async findAll(query: ListQuery): Promise<{ data: EventRow[]; total: number }> {
    const { page, limit, filter, tag, event_type, requesterId, search, sort_by, sort_order } = query;
    const offset = (page - 1) * limit;
    let q = this.baseSelect();

    const now = new Date().toISOString();
    if (filter === 'upcoming') q = q.where('events.event_date', '>=', now);
    else if (filter === 'past') q = q.where('events.event_date', '<', now);
    if (event_type) q = q.where('events.event_type', event_type);

    if (requesterId != null) {
      q = q.andWhere(function (this: any) {
        this.where('events.event_type', 'public').orWhere('events.user_id', requesterId);
      });
    } else {
      q = q.where('events.event_type', 'public');
    }

    if (tag) {
      const tagRow = await this.tagsRepo.findByName(tag);
      if (tagRow) {
        q = q.whereIn(
          'events.id',
          db('event_tags').select('event_id').where('tag_id', tagRow.id)
        );
      }
    }

    // Search in title, description, and location for the search term
    if (search) {
      q = q.andWhere(function (this: any) {
        this.whereILike('events.title', `%${search}%`)
          .orWhereILike('events.description', `%${search}%`)
          .orWhereILike('events.location', `%${search}%`);
      });
    }

    // Sorting 
    const order = sort_order ?? 'desc';
    if (sort_by === 'date') {
      q = q.orderBy('events.event_date', order);
    } else if (sort_by === 'created_at') {
      q = q.orderBy('events.created_at', order);
    } else {
      // default
      q = q.orderBy('events.event_date', 'asc');
    }

    const countQ = q.clone().clearSelect().clearOrder().count('* as count').first();
    const [data, countResult] = await Promise.all([
      q.limit(limit).offset(offset),
      countQ,
    ]);
    const total = Number((countResult as any)?.count ?? 0);
    return { data: data as EventRow[], total };
  }

  async findById(id: number): Promise<EventRow | undefined> {
    return this.baseSelect().where('events.id', id).first() as Promise<EventRow | undefined>;
  }

  async create(payload: {
    user_id: number;
    title: string;
    description?: string | null;
    event_date: string;
    location?: string | null;
    event_type: string;
  }): Promise<number> {
    const [id] = await db(this.TABLE).insert({
      user_id: payload.user_id,
      title: payload.title,
      description: payload.description ?? null,
      event_date: payload.event_date,
      location: payload.location ?? null,
      event_type: payload.event_type || 'public',
    });
    return id as number;
  }

  async update(
    id: number,
    payload: Partial<{
      title: string;
      description: string | null;
      event_date: string;
      location: string | null;
      event_type: string;
    }>
  ): Promise<void> {
    if (Object.keys(payload).length) {
      await db(this.TABLE).where({ id }).update(payload);
    }
  }

  async delete(id: number): Promise<void> {
    await db(this.TABLE).where({ id }).del();
  }

  async attachTags(events: EventRow[]): Promise<EventWithTags[]> {
    if (!events.length) return [];
    const ids = events.map((e) => e.id);
    const byEvent = await this.tagsRepo.getTagNamesByEventIds(ids);
    return events.map((e) => ({ ...e, tags: byEvent[e.id] || [] }));
  }
}
