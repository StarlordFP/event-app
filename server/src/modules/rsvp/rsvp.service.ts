import { RsvpRepository, RsvpStatus } from './rsvp.repository';
import { EventsRepository } from '../events/events.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';

export class RsvpService {
  private repo = new RsvpRepository();
  private eventsRepo = new EventsRepository();

  // Get current user's RSVP status for an event
  async getMyRsvp(eventId: number, userId: number) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundError('Event not found');

    const rsvp = await this.repo.findByEventAndUser(eventId, userId);
    return { status: rsvp?.status ?? null };
  }

  // Create or update RSVP
  async upsertRsvp(eventId: number, userId: number, status: RsvpStatus) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundError('Event not found');

    // Creator cannot RSVP to their own event
    if (event.user_id === userId) {
      throw new ForbiddenError('You cannot RSVP to your own event');
    }

    await this.repo.upsert(eventId, userId, status);
    const counts = await this.repo.getCountsByEvent(eventId);
    return { status, counts };
  }

  // Remove RSVP
  async deleteRsvp(eventId: number, userId: number) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundError('Event not found');
    await this.repo.delete(eventId, userId);
    const counts = await this.repo.getCountsByEvent(eventId);
    return { message: 'RSVP removed', counts };
  }

  // Get all RSVPs for an event (organizer/admin only)
  async getAllRsvps(eventId: number, requesterId: number, requesterRole: string) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundError('Event not found');

    // Only creator or admin can see all RSVPs
    if (event.user_id !== requesterId && requesterRole !== 'admin') {
      throw new ForbiddenError('Only the event creator can view RSVPs');
    }

    const rsvps = await this.repo.findAllByEvent(eventId);
    const counts = await this.repo.getCountsByEvent(eventId);
    return { rsvps, counts };
  }

  // Get RSVP counts for an event (public)
  async getRsvpCounts(eventId: number) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundError('Event not found');
    return this.repo.getCountsByEvent(eventId);
  }
}
