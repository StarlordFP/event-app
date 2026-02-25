import { EventsRepository } from './events.repository';
import { TagsRepository } from '../tags/tags.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import type { EventQuery, CreateEventDto, UpdateEventDto } from './events.schema';
import type { EventWithTags } from './events.repository';

/**
 * Business logic for events: visibility rules, creator checks, tag sync.
 * Orchestrates repositories; no HTTP or raw DB here.
 */
export class EventsService {
  private repo = new EventsRepository();
  private tagsRepo = new TagsRepository();

  async list(query: EventQuery, requesterId?: number): Promise<{ data: EventWithTags[]; total: number }> {
    const { data, total } = await this.repo.findAll({
      page: query.page,
      limit: query.limit,
      filter: query.filter,
      tag: query.tag,
      event_type: query.event_type,
      requesterId,
    });
    const withTags = await this.repo.attachTags(data);
    return { data: withTags, total };
  }

  async getById(id: number, requesterId?: number): Promise<EventWithTags> {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError(`Event ${id} not found`);
    if (event.event_type === 'private' && event.user_id !== requesterId) {
      throw new NotFoundError('Event not found');
    }
    const [withTags] = await this.repo.attachTags([event]);
    return withTags;
  }

  async create(dto: CreateEventDto, userId: number): Promise<EventWithTags> {
    const { tags, ...eventData } = dto;
    const eventId = await this.repo.create({
      user_id: userId,
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.event_date,
      location: eventData.location,
      event_type: eventData.event_type ?? 'public',
    });
    if (tags?.length) await this.tagsRepo.syncEventTags(eventId, tags);
    const event = await this.repo.findById(eventId);
    const [withTags] = await this.repo.attachTags([event!]);
    return withTags;
  }

  async update(id: number, dto: UpdateEventDto, requesterId: number): Promise<EventWithTags> {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError(`Event ${id} not found`);
    if (event.user_id !== requesterId) throw new ForbiddenError('Only the event creator can edit this event');
    const { tags, ...rest } = dto;
    if (Object.keys(rest).length) await this.repo.update(id, rest);
    if (tags !== undefined) await this.tagsRepo.syncEventTags(id, tags);
    const updated = await this.repo.findById(id);
    const [withTags] = await this.repo.attachTags([updated!]);
    return withTags;
  }

  async delete(id: number, requesterId: number): Promise<void> {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError(`Event ${id} not found`);
    if (event.user_id !== requesterId) throw new ForbiddenError('Only the event creator can delete this event');
    await this.repo.delete(id);
  }
}
