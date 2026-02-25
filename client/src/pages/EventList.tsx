import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type EventListResponse, type EventItem, type TagItem } from '../api/client';

type Filter = 'upcoming' | 'past' | '';

export default function EventList() {
  const [data, setData] = useState<EventListResponse | null>(null);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [tagFilter, setTagFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ tags: TagItem[] }>('/tags').then((res) => res.data && setTags(res.data.tags));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '10');
    if (filter) params.set('filter', filter);
    if (tagFilter) params.set('tag', tagFilter);
    if (eventTypeFilter) params.set('event_type', eventTypeFilter);
    api<EventListResponse>(`/events?${params}`).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.data) {
        setData(res.data);
        setError('');
      }
    });
  }, [page, filter, tagFilter, eventTypeFilter]);

  const events = data?.events ?? [];
  const pagination = data?.pagination;

  return (
    <div className="app-container">
      <h1 className="page-header">Events</h1>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Show</label>
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value as Filter); setPage(1); }}
              style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="">All</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Tag</label>
            <select
              value={tagFilter}
              onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}
              style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
            >
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Type</label>
            <select
              value={eventTypeFilter}
              onChange={(e) => { setEventTypeFilter(e.target.value); setPage(1); }}
              style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
            >
              <option value="">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No events found. Create one when signed in.</p>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map((event: EventItem) => (
          <Link key={event.id} to={`/events/${event.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="card">
              <h2 className="card-title">{event.title}</h2>
              <p className="card-meta">
                {new Date(event.event_date).toLocaleString()} · {event.location || 'No location'} · {event.event_type}
              </p>
              {event.creator_name && <p className="card-meta">by {event.creator_name}</p>}
              {event.tags && event.tags.length > 0 && (
                <div className="tags-list">
                  {event.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span>Page {page} of {pagination.totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
