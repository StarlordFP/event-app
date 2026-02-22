import type { Response, NextFunction } from 'express';
import db from '../configs/db.js';
import type { AuthRequest, CreateEventBody, UpdateEventBody, Event, EventWithTags, Tag } from '../types/index.js';
import { createError } from '../middleware/errorHandler.js';

// Helper: attach tags to a list of events
const attachTags = async (events: Event[]): Promise<EventWithTags[]> => {
  if (events.length === 0) return [];
  const eventIds = events.map((e) => e.id);

  const tagRows = await db('event_tags as et')
    .join('tags as t', 'et.tag_id', 't.id')
    .whereIn('et.event_id', eventIds)
    .select('et.event_id', 't.id', 't.name');

  const tagMap: Record<number, Tag[]> = {};
    tagRows.forEach((row) => {
    tagMap[row.event_id] ??= [];
    tagMap[row.event_id]!.push({ id: row.id, name: row.name });
    });

  return events.map((e) => ({ ...e, tags: tagMap[e.id] || [] }));
};

// GET /events?type=public|private&tag=1,2
export const listEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, tag, view } = req.query as Record<string, string>;
    const now = new Date();

    let query = db<Event>('events as e')
      .join('users as u', 'e.creator_id', 'u.id')
      .select('e.*', 'u.name as creator_name');

    if (type) query = query.where('e.type', type);

    // upcoming vs past
    if (view === 'past') {
      query = query.where('e.start_at', '<', now).orderBy('e.start_at', 'desc');
    } else {
      query = query.where('e.start_at', '>=', now).orderBy('e.start_at', 'asc');
    }

    // filter by tag ids (comma-separated)
    if (tag) {
      const tagIds = tag.split(',').map(Number);
      query = query.whereIn('e.id', function () {
        this.select('event_id').from('event_tags').whereIn('tag_id', tagIds);
      });
    }

    const events = await query;
    const result = await attachTags(events as Event[]);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /events/:id
export const getEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await db<Event>('events as e')
      .join('users as u', 'e.creator_id', 'u.id')
      .select('e.*', 'u.name as creator_name')
      .where('e.id', req.params.id)
      .first();

    if (!event) return next(createError('Event not found', 404));

    const [withTags] = await attachTags([event as Event]);
    res.json(withTags);
  } catch (err) {
    next(err);
  }
};

// POST /events
export const createEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, location, start_at, type, tag_ids } = req.body as CreateEventBody;
    const creator_id = req.user!.id;

    const [id] = await db<Event>('events').insert({
      title,
      description,
      location,
      start_at: new Date(start_at),
      type,
      creator_id,
    });

    if (tag_ids && tag_ids.length > 0) {
      const pivotRows = tag_ids.map((tag_id) => ({ event_id: id, tag_id }));
      await db('event_tags').insert(pivotRows);
    }

    const [event] = await attachTags([{ id } as Event]);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// PUT /events/:id
export const updateEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const event = await db<Event>('events').where({ id }).first();
    if (!event) return next(createError('Event not found', 404));
    if (event.creator_id !== req.user!.id) return next(createError('Forbidden', 403));

    const { tag_ids, start_at, ...rest } = req.body as UpdateEventBody;
    const updates: Partial<Event> = { ...rest } as any;
    if (start_at) updates.start_at = new Date(start_at);

    await db<Event>('events').where({ id }).update(updates);

    if (tag_ids !== undefined) {
      await db('event_tags').where({ event_id: id }).delete();
      if (tag_ids.length > 0) {
        const pivotRows = tag_ids.map((tag_id) => ({ event_id: id, tag_id }));
        await db('event_tags').insert(pivotRows);
      }
    }

    const updated = await db<Event>('events').where({ id }).first();
    const [withTags] = await attachTags([updated as Event]);
    res.json(withTags);
  } catch (err) {
    next(err);
  }
};

// DELETE /events/:id
export const deleteEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const event = await db<Event>('events').where({ id }).first();
    if (!event) return next(createError('Event not found', 404));
    if (event.creator_id !== req.user!.id) return next(createError('Forbidden', 403));

    await db('event_tags').where({ event_id: id }).delete();
    await db<Event>('events').where({ id }).delete();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};