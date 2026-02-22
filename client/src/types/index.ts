export type EventType = 'public' | 'private';

export interface Tag {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_at: string;
  type: EventType;
  creator_id: number;
  creator_name: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  start_at: string;
  type: EventType;
  tag_ids?: number[];
}

export interface AuthResponse {
  token: string;
  user: User;
}