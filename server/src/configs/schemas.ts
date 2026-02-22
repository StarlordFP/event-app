import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  location: z.string().min(1),
  start_at: z.string().datetime({ message: 'start_at must be an ISO datetime string' }),
  type: z.enum(['public', 'private']),
  tag_ids: z.array(z.number().int().positive()).optional(),
});

export const updateEventSchema = createEventSchema.partial();