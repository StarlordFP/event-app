import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, FormField } from '../components/ui';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

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
    navigate('/', { replace: true });
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
