import { Request, Response, NextFunction } from 'express';
import { RsvpService } from './rsvp.service';

export class RsvpController {
  private service = new RsvpService();

  // GET /api/events/:id/rsvp — get my RSVP status
  getMyRsvp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Number(req.params.id);
      const result = await this.service.getMyRsvp(eventId, req.userId!);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // POST /api/events/:id/rsvp — create or update RSVP
  upsertRsvp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Number(req.params.id);
      const { status } = req.body;
      const result = await this.service.upsertRsvp(eventId, req.userId!, status);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/events/:id/rsvp — remove RSVP
  deleteRsvp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Number(req.params.id);
      const result = await this.service.deleteRsvp(eventId, req.userId!);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/events/:id/rsvps — get all RSVPs (organizer/admin only)
  getAllRsvps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Number(req.params.id);
      const result = await this.service.getAllRsvps(eventId, req.userId!, req.user!.role);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/events/:id/rsvp-counts — public RSVP counts
  getRsvpCounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Number(req.params.id);
      const counts = await this.service.getRsvpCounts(eventId);
      res.json(counts);
    } catch (err) {
      next(err);
    }
  };
}
