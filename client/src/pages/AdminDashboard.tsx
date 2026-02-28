import { useState, useEffect } from 'react';
import { api, type EventItem } from '../api/client';
import { Card } from '../components/ui';

type Role = 'admin' | 'organizer' | 'attendee';

type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
  is_verified: boolean;
  created_at: string;
};

type Tab = 'users' | 'events';

// ── Role Change Confirmation Modal ─────────────────────────
function RoleConfirmModal({
  user,
  newRole,
  onConfirm,
  onCancel,
}: {
  user: AdminUser;
  newRole: Role;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)',
        padding: '2rem', maxWidth: 400, width: '90%',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Change Role</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Are you sure you want to change <strong>{user.name}</strong>'s role from{' '}
          <strong>{user.role}</strong> to <strong>{newRole}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text)', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem', borderRadius: 'var(--radius)',
              border: 'none', background: 'var(--primary)',
              color: '#fff', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: AdminUser;
    newRole: Role;
  } | null>(null);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    else fetchEvents();
  }, [tab]);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    const res = await api<{ users: AdminUser[] }>('/admin/users');
    setLoading(false);
    if (res.error) setError(res.error);
    else if (res.data) setUsers(res.data.users);
  }

  async function fetchEvents() {
    setLoading(true);
    setError('');
    const res = await api<{ events: EventItem[] }>('/admin/events');
    setLoading(false);
    if (res.error) setError(res.error);
    else if (res.data) setEvents(res.data.events);
  }

  // Show modal instead of immediately changing role
  function handleRoleSelectChange(user: AdminUser, newRole: Role) {
    if (newRole === user.role) return;
    setPendingRoleChange({ user, newRole });
  }

  // Called when admin confirms modal
  async function confirmRoleChange() {
    if (!pendingRoleChange) return;
    const { user, newRole } = pendingRoleChange;
    setPendingRoleChange(null);
    const res = await api(`/admin/users/${user.id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });
    if (res.error) { setError(res.error); return; }
    setMessage(`${user.name}'s role updated to ${newRole}`);
    fetchUsers();
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await api(`/admin/users/${userId}`, { method: 'DELETE' });
    if (res.error) { setError(res.error); return; }
    setMessage('User deleted');
    fetchUsers();
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleDeleteEvent(eventId: number) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const res = await api(`/admin/events/${eventId}`, { method: 'DELETE' });
    if (res.error) { setError(res.error); return; }
    setMessage('Event deleted');
    fetchEvents();
    setTimeout(() => setMessage(''), 3000);
  }

  const tabStyle = (t: Tab) => ({
    padding: '0.5rem 1.25rem',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    background: tab === t ? 'var(--primary)' : 'transparent',
    color: tab === t ? '#fff' : 'var(--text-muted)',
  });

  return (
    <div className="app-container" style={{ paddingTop: '2rem' }}>
      <h1 className="page-header">Admin Dashboard</h1>

      {/* Role change confirmation modal */}
      {pendingRoleChange && (
        <RoleConfirmModal
          user={pendingRoleChange.user}
          newRole={pendingRoleChange.newRole}
          onConfirm={confirmRoleChange}
          onCancel={() => setPendingRoleChange(null)}
        />
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button style={tabStyle('users')} onClick={() => setTab('users')}>Users</button>
        <button style={tabStyle('events')} onClick={() => setTab('events')}>Events</button>
      </div>

      {message && (
        <p style={{ color: 'green', marginBottom: '1rem', fontWeight: 500 }}>✓ {message}</p>
      )}
      {error && <p className="error-message">{error}</p>}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {/* Users Tab */}
      {tab === 'users' && !loading && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {users.map((u) => (
            <Card key={u.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{u.name}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{u.email}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {u.is_verified ? '✓ Verified' : '✗ Not verified'} · Joined {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleSelectChange(u, e.target.value as Role)}
                    disabled={u.role === 'admin'}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: u.role === 'admin' ? 'var(--text-muted)' : 'var(--text)',
                      fontWeight: 600,
                      cursor: u.role === 'admin' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {tab === 'events' && !loading && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {events.map((e) => (
            <Card key={e.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{e.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {new Date(e.event_date).toLocaleString()} · {e.location || 'No location'} · {e.event_type}
                  </p>
                  {e.creator_name && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {e.creator_name}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteEvent(e.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius)',
                    border: 'none',
                    background: '#fee2e2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}