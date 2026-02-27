import { z } from 'zod';

export const EventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  filter: z.enum(['upcoming', 'past']).optional(),
  tag: z.string().trim().optional(),
  event_type: z.enum(['public', 'private']).optional(),
  search: z.string().trim().optional(), // for searching in title/description
  sort_by: z.enum(['date', 'popularity', 'created_at']).optional(),  
  sort_order: z.enum(['asc', 'desc']).optional(),
});
export type EventQuery = z.infer<typeof EventQuerySchema>;

export const CreateEventSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  event_date: z.string().min(1, 'Valid date/time is required'),
  location: z.string().trim().optional(),
  event_type: z.enum(['public', 'private']).default('public'),
  tags: z.array(z.string().trim()).optional(),
});
export type CreateEventDto = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  event_date: z.string().min(1).optional(),
  location: z.string().trim().optional(),
  event_type: z.enum(['public', 'private']).optional(),
  tags: z.array(z.string().trim()).optional(),
});
export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;

export const EventIdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});
export type EventIdParam = z.infer<typeof EventIdParamSchema>;