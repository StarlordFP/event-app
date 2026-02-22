import { Router } from 'express';
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createEventSchema, updateEventSchema } from '../configs/schemas.js';

const router = Router();

router.get('/', listEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', authenticate, validate(createEventSchema), createEvent);
router.put('/:id', authenticate, validate(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;