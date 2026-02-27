import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

type User = { id: number; email: string; name: string };

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ error?: string; requires2FA?: boolean; userId?: number }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string; message?: string }>;
  logout: () => Promise<void>;
  verify2FA: (userId: number, code: string) => Promise<{ error?: string }>;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

declare global {
  interface Window {
    __auth?: {
      getToken: () => string | null;
      setToken: (t: string | null) => void;
      setUser: (u: User | null) => void;
      refresh: () => Promise<boolean>;
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = token;

  const refresh = useCallback(async (): Promise<boolean> => {
    const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setToken(null);
      setUser(null);
      return false;
    }
    setUser(data.user);
    setToken(data.token);
    return true;
  }, []);

  useEffect(() => {
    window.__auth = {
      getToken: () => tokenRef.current,
      setToken,
      setUser,
      refresh,
    };
    return () => { delete window.__auth; };
  }, [refresh]);

  useEffect(() => {
    refresh().finally(() => setIsReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data.error || 'Login failed' };
    }
    // 2FA required — don't set token yet
    if (data.requires2FA) {
      return { requires2FA: true, userId: data.userId };
    }
    setUser(data.user);
    setToken(data.token);
    return {};
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data.error || data.details?.[0]?.message || 'Signup failed' };
    }
    // Signup now returns a message, not tokens
    return { message: data.message };
  }, []);

  const verify2FA = useCallback(async (userId: number, code: string) => {
    const res = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data.error || '2FA verification failed' };
    }
    setUser(data.user);
    setToken(data.token);
    return {};
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setToken(null);
  }, []);

  const value: AuthContextValue = { user, token, login, signup, logout, verify2FA, isReady };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}