import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, FormField } from '../components/ui';

export default function TwoFactorVerify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verify2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // userId passed from Login page via navigate state
  const userId = (location.state as { userId?: number })?.userId;

  // Guard — if no userId, they shouldn't be here
  if (!userId) {
    return (
      <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
        <Card>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            Invalid session. <Link to="/login">Go back to login</Link>
          </p>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    setLoading(true);
    const result = await verify2FA(userId!, code);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
      <h1 className="page-header">Two-Factor Auth</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Open your Google Authenticator app and enter the 6-digit code.
            </p>
          </div>
          <FormField label="6-digit code" htmlFor="code">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              placeholder="000000"
              autoComplete="one-time-code"
              inputMode="numeric"
              style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.5rem' }}
            />
          </FormField>
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" fullWidth style={{ marginTop: '0.5rem' }} disabled={loading || code.length !== 6}>
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </Card>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}