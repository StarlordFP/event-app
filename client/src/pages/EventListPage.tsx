import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../api/events';
import type { Event } from '../types/index';
import { useAuth } from '../context/AuthContext';

export default function EventListPage() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    eventsApi.list({ view }).then(setEvents);
  }, [view]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Events</h1>
        <div>
          {user ? (
            <>
              <span>Hi, {user.name}</span>{' '}
              <Link to="/events/new"><button>+ New Event</button></Link>{' '}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login"><button>Login</button></Link>
          )}
        </div>
      </header>

      <div>
        <button onClick={() => setView('upcoming')} disabled={view === 'upcoming'}>Upcoming</button>
        <button onClick={() => setView('past')} disabled={view === 'past'}>Past</button>
      </div>

      {events.length === 0 && <p>No events found.</p>}
      {events.map((event) => (
        <div key={event.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginTop: 16 }}>
          <h2><Link to={`/events/${event.id}`}>{event.title}</Link></h2>
          <p>📍 {event.location} | 🗓 {new Date(event.start_at).toLocaleString()}</p>
          <p>{event.type === 'public' ? '🌐 Public' : '🔒 Private'} · By {event.creator_name}</p>
          <div>{event.tags.map(t => <span key={t.id} style={{ marginRight: 4, background: '#eee', padding: '2px 8px', borderRadius: 12 }}>{t.name}</span>)}</div>
        </div>
      ))}
    </div>
  );
}