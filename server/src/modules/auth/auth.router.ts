import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { AuthController } from './auth.controller';
import { SignupSchema, LoginSchema } from './auth.schema';

const router = Router();
const ctrl = new AuthController();

router.post('/signup', validate('body', SignupSchema), ctrl.signup);
router.post('/login', validate('body', LoginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

export { router as authRouter };
