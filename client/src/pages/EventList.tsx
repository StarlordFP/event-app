import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type EventListResponse, type EventItem, type TagItem } from '../api/client';

type Filter = 'upcoming' | 'past' | '';
type SortBy = 'date' | 'created_at' | 'popularity' | '';
type SortOrder = 'asc' | 'desc';

const selectStyle: React.CSSProperties = {
  padding: '0.4rem 0.6rem',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  width: '100%',
};

export default function EventList() {
  const [data, setData] = useState<EventListResponse | null>(null);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [tagFilter, setTagFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
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
    if (search) params.set('search', search);
    if (sortBy) params.set('sort_by', sortBy);
    if (sortBy) params.set('sort_order', sortOrder);

    api<EventListResponse>(`/events?${params}`).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.data) {
        setData(res.data);
        setError('');
      }
    });
  }, [page, filter, tagFilter, eventTypeFilter, search, sortBy, sortOrder]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleClearSearch() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  const events = data?.events ?? [];
  const pagination = data?.pagination;

  return (
    <div className="app-container">
      <h1 className="page-header">Events</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, description or location..."
            style={{
              flex: 1,
              minWidth: 0,
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.95rem',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            Search
          </button>
          {search && (
            <button type="button" onClick={handleClearSearch} className="btn btn-ghost" style={{ flexShrink: 0 }}>
              Clear
            </button>
          )}
        </div>
        {search && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Showing results for "<strong>{search}</strong>"
          </p>
        )}
      </form>

      {/* Filters + Sort */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        {/* Row 1: Show, Tag, Type, Sort by — always 4 columns on tablet+ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
        }}
          className="filters-grid"
        >
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Show</label>
            <select value={filter} onChange={(e) => { setFilter(e.target.value as Filter); setPage(1); }} style={selectStyle}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="">All</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Tag</label>
            <select value={tagFilter} onChange={(e) => { setTagFilter(e.target.value); setPage(1); }} style={selectStyle}>
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Type</label>
            <select value={eventTypeFilter} onChange={(e) => { setEventTypeFilter(e.target.value); setPage(1); }} style={selectStyle}>
              <option value="">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Sort by</label>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortBy); setPage(1); }} style={selectStyle}>
              <option value="">Default</option>
              <option value="date">Event Date</option>
              <option value="created_at">Created Date</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>

        {/* Row 2: Order — only when sort selected */}
        {sortBy && (
          <div style={{ marginTop: '0.75rem', maxWidth: '200px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Order</label>
            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value as SortOrder); setPage(1); }} style={selectStyle}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>}

      {!loading && events.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>
          {search ? `No events found for "${search}".` : 'No events found. Create one when signed in.'}
        </p>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map((event: EventItem) => (
          <Link key={event.id} to={`/events/${event.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="card">
              <h2 className="card-title">{event.title}</h2>
              <p className="card-meta" style={{ wordBreak: 'break-word' }}>
                {new Date(event.event_date).toLocaleString()} · {event.location || 'No location'} ·{' '}
                <span className={`event-type ${event.event_type}`}>{event.event_type}</span>
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
          <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>Previous</button>
          <span>Page {page} of {pagination.totalPages}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages}>Next</button>
        </div>
      )}

      {/* Responsive filter grid */}
      <style>{`
        @media (max-width: 480px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}