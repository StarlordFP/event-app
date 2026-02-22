// ─── SignupPage ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(form.name, form.email, form.password);
      navigate('/events');
    } catch {
      setError('Signup failed. Email may already be in use.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div><label>Name</label><input value={form.name} onChange={set('name')} required /></div>
        <div><label>Email</label><input type="email" value={form.email} onChange={set('email')} required /></div>
        <div><label>Password</label><input type="password" value={form.password} onChange={set('password')} required /></div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}