import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, type EventItem } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Card, ConfirmModal } from '../components/ui';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api<EventItem>(`/events/${id}`).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.data) setEvent(res.data);
    });
  }, [id]);

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

  return (
    <div className="app-container">
      <Card>
        <h1 className="page-header" style={{ marginBottom: '0.5rem' }}>{event.title}</h1>
        <p className="card-meta">
          {new Date(event.event_date).toLocaleString()} · {event.location || 'No location'} · {event.event_type}
        </p>
        {event.creator_name && <p className="card-meta">by {event.creator_name}</p>}
        {event.tags && event.tags.length > 0 && (
          <div className="tags-list" style={{ marginBottom: '1rem' }}>
            {event.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        {event.description && (
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{event.description}</p>
        )}

        {isCreator && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <Link to={`/events/${event.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
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
