function getToken(): string | null {
  return typeof window !== 'undefined' && window.__auth?.getToken ? window.__auth.getToken() : null;
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; details?: unknown }> {
  const url = path.startsWith('http') ? path : `/api${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  let token = getToken();
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  let res = await fetch(url, { ...options, headers, credentials: 'include' });
  let data = await res.json().catch(() => ({}));

  if (res.status === 401 && window.__auth?.refresh) {
    const ok = await window.__auth.refresh();
    if (ok) {
      token = getToken();
      if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      res = await fetch(url, { ...options, headers, credentials: 'include' });
      data = await res.json().catch(() => ({}));
    }
  }

  if (!res.ok) {
    return {
      error: data.error || (res.status === 401 ? 'Please sign in again' : 'Request failed'),
      details: data.details,
    };
  }
  return { data: data as T };
}

export type EventItem = {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  event_type: 'public' | 'private';
  user_id: number;
  creator_name: string | null;
  created_at: string;
  tags?: string[];
};

export type EventListResponse = {
  events: EventItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type TagItem = { id: number; name: string };
