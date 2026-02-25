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
