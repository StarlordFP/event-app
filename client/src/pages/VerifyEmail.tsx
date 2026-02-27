import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Card } from '../components/ui';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }
    api('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }).then((result) => {
      if (result.error) {
        setStatus('error');
        setMessage(result.error);
      } else {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      }
    });
  }, []);

  return (
    <div className="app-container" style={{ maxWidth: 400, marginTop: '3rem' }}>
      <h1 className="page-header">Email Verification</h1>
      <Card>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          {status === 'loading' && (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ color: 'var(--text-muted)' }}>Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <p style={{ marginBottom: '1.5rem' }}>{message}</p>
              <Link to="/login">
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Log in to your account
                </button>
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
              <p style={{ color: 'var(--error)', marginBottom: '1.5rem' }}>{message}</p>
              <Link to="/resend-verification" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Request a new verification email
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}