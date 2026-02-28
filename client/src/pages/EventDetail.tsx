import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, type EventItem } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Card, ConfirmModal } from '../components/ui';

type RsvpStatus = 'yes' | 'no' | 'maybe' | null;
type RsvpCounts = { yes: number; no: number; maybe: number };

const rsvpButtons: { status: 'yes' | 'no' | 'maybe'; label: string; emoji: string }[] = [
  { status: 'yes', label: 'Going', emoji: '✅' },
  { status: 'maybe', label: 'Maybe', emoji: '🤔' },
  { status: 'no', label: 'Not Going', emoji: '❌' },
];

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // RSVP state
  const [myRsvp, setMyRsvp] = useState<RsvpStatus>(null);
  const [rsvpCounts, setRsvpCounts] = useState<RsvpCounts>({ yes: 0, no: 0, maybe: 0 });
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api<EventItem>(`/events/${id}`).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.data) setEvent(res.data);
    });

    // Fetch RSVP counts (public)
    api<RsvpCounts>(`/events/${id}/rsvp-counts`).then((res) => {
      if (res.data) setRsvpCounts(res.data);
    });

    // Fetch my RSVP status (only if logged in)
    if (token) {
      api<{ status: RsvpStatus }>(`/events/${id}/rsvp`).then((res) => {
        if (res.data) setMyRsvp(res.data.status);
      });
    }
  }, [id, token]);

  async function handleRsvp(status: 'yes' | 'no' | 'maybe') {
    if (!id) return;
    setRsvpLoading(true);

    // If clicking same status → remove RSVP
    if (myRsvp === status) {
      const res = await api(`/events/${id}/rsvp`, { method: 'DELETE' });
      if (!res.error) {
        setMyRsvp(null);
        if (res.data) setRsvpCounts((res.data as any).counts);
      }
    } else {
      // Create or update RSVP
      const res = await api(`/events/${id}/rsvp`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (!res.error && res.data) {
        setMyRsvp((res.data as any).status);
        setRsvpCounts((res.data as any).counts);
      }
    }
    setRsvpLoading(false);
  }

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    const res = await api(`/events/${id}`, { method: 'DELETE' });
    setDeleting(false);
    setDeleteModalOpen(false);
    if (res.error) setError(res.error);
    else navigate('/', { replace: true });
  }

  if (loading) return <div className="app-container">Loading...</div>;
  if (error || !event) {
    return (
      <div className="app-container">
        <p className="error-message">{error || 'Event not found'}</p>
        <Link to="/">Back to events</Link>
      </div>
    );
  }

  const isCreator = token && user && event.user_id === user.id;
  const isAdmin = user?.role === 'admin';
  const canRsvp = token && !isCreator; // logged in and not the creator

  return (
    <div className="app-container">
      <Card>
        <h1 className="page-header" style={{ marginBottom: '0.5rem' }}>{event.title}</h1>
        <p className="card-meta">
          {new Date(event.event_date).toLocaleString()} · {event.location || 'No location'} · 
          <span className={`event-type ${event.event_type}`}>{event.event_type}</span>
        </p>
        {event.creator_name && <p className="card-meta">by {event.creator_name}</p>}
        {event.tags && event.tags.length > 0 && (
          <div className="tags-list" style={{ marginBottom: '1rem' }}>
            {event.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          
        )}
        {/* ── Private badge ── ADD HERE */}
        {event.event_type === 'private' && isCreator && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.8rem',
            padding: '2px 10px',
            borderRadius: '4px',
            background: '#fef3c7',
            color: '#92400e',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}>
            🔒 Private — Only visible to you
          </span>
        )}
        {event.description && (
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{event.description}</p>
        )}

        {/* ── RSVP Section ── */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          {/* RSVP counts */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ✅ <strong>{rsvpCounts.yes}</strong> Going
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              🤔 <strong>{rsvpCounts.maybe}</strong> Maybe
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ❌ <strong>{rsvpCounts.no}</strong> Not Going
            </span>
          </div>

          {/* RSVP buttons — only for logged-in non-creators */}
          {canRsvp && (
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {myRsvp ? 'Your response (click to change or cancel):' : 'Will you attend?'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {rsvpButtons.map(({ status, label, emoji }) => (
                  <button
                    key={status}
                    onClick={() => handleRsvp(status)}
                    disabled={rsvpLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius)',
                      border: '2px solid',
                      borderColor: myRsvp === status ? 'var(--primary)' : 'var(--border)',
                      background: myRsvp === status ? 'var(--primary)' : 'transparent',
                      color: myRsvp === status ? '#fff' : 'var(--text)',
                      cursor: rsvpLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Not logged in message */}
          {!token && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Link to="/login">Log in</Link> to RSVP to this event.
            </p>
          )}

          {/* Creator message */}
          {isCreator && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              You are the organizer of this event.
            </p>
          )}
        </div>

        {/* Edit/Delete buttons for creator or admin */}
        {(isCreator || isAdmin) && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            {isCreator && (
              <Link to={`/events/${event.id}/edit`}>
                <Button variant="primary">Edit</Button>
              </Link>
            )}
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </Card>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/">← Back to events</Link>
      </p>

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete event"
        message="Are you sure you want to delete this event? This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
}