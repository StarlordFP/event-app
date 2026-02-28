import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, token, logout } = useAuth();

  return (
    <div>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem',
        background: 'var(--surface)',
      }}>
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)' }}>
            Event Planner
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" className="btn btn-ghost">Events</Link>
            {token ? (
              <>
                {/* Only organizers and admins see New Event */}
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <Link to="/events/new" className="btn btn-primary">New Event</Link>
                )}

                {/* Admin dashboard link */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-ghost" style={{ color: 'var(--primary)' }}>
                    Admin
                  </Link>
                )}

                {/* User name + role badge */}
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {user?.name}
                  {user?.role !== 'attendee' && (
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '1px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: user?.role === 'admin' ? '#fee2e2' : '#dbeafe',
                      color: user?.role === 'admin' ? '#dc2626' : '#2563eb',
                    }}>
                      {user?.role}
                    </span>
                  )}
                </span>

                <button type="button" className="btn btn-ghost" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log in</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}