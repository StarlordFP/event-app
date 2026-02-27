import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import {
  SignupSchema,
  LoginSchema,
  VerifyEmailSchema,
  ResendVerificationSchema,
  Enable2FASchema,
  Verify2FASchema,
  Disable2FASchema,
} from './auth.schema';

const router = Router();
const ctrl = new AuthController();


router.post('/signup', validate('body', SignupSchema), ctrl.signup);
router.post('/login', validate('body', LoginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

// Email verification
router.post('/verify-email', validate('body', VerifyEmailSchema), ctrl.verifyEmail);
router.post('/resend-verification', validate('body', ResendVerificationSchema), ctrl.resendVerification);

// 2FA
router.post('/2fa/setup', authenticate, ctrl.setup2FA);
router.post('/2fa/enable', authenticate, validate('body', Enable2FASchema), ctrl.enable2FA);
router.post('/2fa/verify', validate('body', Verify2FASchema), ctrl.verify2FA);
router.post('/2fa/disable', authenticate, validate('body', Disable2FASchema), ctrl.disable2FA);

export { router as authRouter };