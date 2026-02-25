import { Router } from 'express';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { EventsController } from './events.controller';
import {
  EventQuerySchema,
  CreateEventSchema,
  UpdateEventSchema,
  EventIdParamSchema,
} from './events.schema';

const router = Router();
const ctrl = new EventsController();

// Public / optional-auth routes
router.get('/', optionalAuth, validate('query', EventQuerySchema), ctrl.list);
router.get(
  '/:id',
  optionalAuth,
  validate('params', EventIdParamSchema),
  ctrl.getOne
);

// Protected routes
router.post(
  '/',
  authenticate,
  validate('body', CreateEventSchema),
  ctrl.create
);
router.patch(
  '/:id',
  authenticate,
  validate('params', EventIdParamSchema),
  validate('body', UpdateEventSchema),
  ctrl.update
);
router.delete(
  '/:id',
  authenticate,
  validate('params', EventIdParamSchema),
  ctrl.remove
);

export { router as eventsRouter };
