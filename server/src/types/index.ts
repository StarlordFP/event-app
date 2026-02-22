// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserPayload {
  id: number;
  name: string;
  email: string;
}

// ─── Event ──────────────────────────────────────────────────────────────────
export type EventType = 'public' | 'private';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_at: Date;       // event date/time
  type: EventType;
  creator_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface EventWithTags extends Event {
  tags: Tag[];
  creator_name?: string;
}

// ─── Tag ────────────────────────────────────────────────────────────────────
export interface Tag {
  id: number;
  name: string;
}

// ─── Request Bodies ──────────────────────────────────────────────────────────
export interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateEventBody {
  title: string;
  description: string;
  location: string;
  start_at: string;    // ISO date string from client
  type: EventType;
  tag_ids?: number[];
}

export interface UpdateEventBody extends Partial<CreateEventBody> {}

// ─── Express Augmentation ────────────────────────────────────────────────────
import type { Request } from 'express';

export interface AuthRequest extends Request {
  user?: UserPayload;
}