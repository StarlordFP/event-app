import { Router } from 'express';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';
import { RsvpController } from './rsvp.controller';

// Note: This router is mounted under /api/events/:id
// So routes here are relative to that
const router = Router({ mergeParams: true }); // mergeParams lets us access :id from parent
const ctrl = new RsvpController();

// Public — anyone can see counts
router.get('/rsvp-counts', ctrl.getRsvpCounts);

// Authenticated — must be logged in
router.get('/rsvp', authenticate, ctrl.getMyRsvp);
router.post('/rsvp', authenticate, ctrl.upsertRsvp);
router.delete('/rsvp', authenticate, ctrl.deleteRsvp);

// Organizer/Admin only — see all RSVPs
router.get('/rsvps', authenticate, ctrl.getAllRsvps);

export { router as rsvpRouter };
