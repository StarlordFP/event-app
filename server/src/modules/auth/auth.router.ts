import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { AuthController } from './auth.controller';
import {
  SignupSchema,
  LoginSchema,
  VerifyEmailSchema,
  ResendVerificationSchema,
} from './auth.schema';

const router = Router();
const ctrl = new AuthController();

router.post('/signup', validate('body', SignupSchema), ctrl.signup);
router.post('/login', validate('body', LoginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

router.post('/verify-email', validate('body', VerifyEmailSchema), ctrl.verifyEmail);
router.post('/resend-verification', validate('body', ResendVerificationSchema), ctrl.resendVerification);

export { router as authRouter };