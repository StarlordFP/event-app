import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email is required').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type SignupDto = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});
export type LoginDto = z.infer<typeof LoginSchema>;

// Email Verification
export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const ResendVerificationSchema = z.object({
  email: z.string().email(),
});

// 2FA
export const Verify2FASchema = z.object({
  userId: z.number().int().min(1),
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const Enable2FASchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const Disable2FASchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});