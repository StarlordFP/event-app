import api from './client';
import type { Event, CreateEventPayload } from '../types/index';

export const eventsApi = {
  list: (params?: { view?: 'upcoming' | 'past'; type?: string; tag?: string }) =>
    api.get<Event[]>('/events', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Event>(`/events/${id}`).then((r) => r.data),

  create: (payload: CreateEventPayload) =>
    api.post<Event>('/events', payload).then((r) => r.data),

  update: (id: number, payload: Partial<CreateEventPayload>) =>
    api.put<Event>(`/events/${id}`, payload).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/events/${id}`),
};