import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Button, Card, FormField } from '../components/ui';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await api('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
        <h1 className="page-header">Email Sent</h1>
        <Card>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              A new verification link has been sent to <strong>{email}</strong>.
              Please check your inbox.
            </p>
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
      <h1 className="page-header">Resend Verification</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Enter your email address and we'll send you a new verification link.
          </p>
          <FormField label="Email" htmlFor="email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </FormField>
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" fullWidth style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send verification email'}
          </Button>
        </Card>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Already verified? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}