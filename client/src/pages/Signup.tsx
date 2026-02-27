import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, FormField } from '../components/ui';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await signup(email, password, name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // Show success — don't navigate, user must verify email first
    setSuccess(true);
  }

  // Success state — show "check your email" screen
  if (success) {
    return (
      <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
        <h1 className="page-header">Check your email</h1>
        <Card>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              We sent a verification link to <strong>{email}</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Click the link in your email to verify your account before logging in.
            </p>
            <Button
              fullWidth
              onClick={() => window.location.href = '/resend-verification'}
              style={{ marginBottom: '0.5rem' }}
            >
              Resend verification email
            </Button>
            <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
      <h1 className="page-header">Sign up</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <FormField label="Name" htmlFor="name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </FormField>
          <FormField label="Email" htmlFor="email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </FormField>
          <FormField label="Password (min 6 characters)" htmlFor="password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </FormField>
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" fullWidth style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </Card>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}