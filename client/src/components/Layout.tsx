import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, token, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when window resizes to desktop width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 640) setMenuOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--text)',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            Event Planner
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <Link to="/" className="btn btn-ghost">Events</Link>
            {token ? (
              <>
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <Link to="/events/new" className="btn btn-primary">New Event</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-ghost" style={{ color: 'var(--accent)' }}>
                    Admin
                  </Link>
                )}
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}>
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

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius)',
              lineHeight: 1,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            maxWidth: 960,
            margin: '0.75rem auto 0',
            borderTop: '1px solid var(--border)',
            paddingTop: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
            onClick={() => setMenuOpen(false)}
          >
            <Link to="/" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              Events
            </Link>
            {token ? (
              <>
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  // Not highlighted — ghost style like other items
                  <Link to="/events/new" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    New Event
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-ghost" style={{ color: 'var(--accent)', justifyContent: 'flex-start' }}>
                    Admin
                  </Link>
                )}
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  padding: '0.25rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
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
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={logout}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Log in</Link>
                <Link to="/signup" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}