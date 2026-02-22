// ─── EventDetailPage ─────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsApi } from '../api/events';
import type { Event } from '../types/index';
import { useAuth } from '../context/AuthContext';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    eventsApi.get(Number(id)).then(setEvent);
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this event?')) return;
    await eventsApi.delete(Number(id));
    navigate('/events');
  };

  if (!event) return <p>Loading...</p>;

  const isOwner = user?.id === event.creator_id;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <Link to="/events">← Back</Link>
      <h1>{event.title}</h1>
      <p>📍 {event.location}</p>
      <p>🗓 {new Date(event.start_at).toLocaleString()}</p>
      <p>{event.type === 'public' ? '🌐 Public' : '🔒 Private'} · By {event.creator_name}</p>
      <p>{event.description}</p>
      <div>{event.tags.map(t => <span key={t.id} style={{ marginRight: 4, background: '#eee', padding: '2px 8px', borderRadius: 12 }}>{t.name}</span>)}</div>
      {isOwner && (
        <div style={{ marginTop: 16 }}>
          <Link to={`/events/${event.id}/edit`}><button>Edit</button></Link>{' '}
          <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;