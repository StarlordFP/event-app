import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { AdminController } from './admin.controller';

const router = Router();
const ctrl = new AdminController();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// ─── Users ────────────────────────────────────────────────
router.get('/users', ctrl.getAllUsers);
router.patch('/users/:id/role', ctrl.updateUserRole);
router.delete('/users/:id', ctrl.deleteUser);

// ─── Events ───────────────────────────────────────────────
router.get('/events', ctrl.getAllEvents);
router.delete('/events/:id', ctrl.deleteEvent);

export { router as adminRouter };
