import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, FormField } from '../components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
      <h1 className="page-header">Log in</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <FormField label="Email" htmlFor="email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </FormField>
          <FormField label="Password" htmlFor="password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </FormField>
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" fullWidth style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </Button>
        </Card>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
