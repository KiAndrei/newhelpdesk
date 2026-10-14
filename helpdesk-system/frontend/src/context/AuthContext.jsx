import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Examination-only, client-side credentials (NOT production-grade security).
const VALID_USERNAME = 'itadmin';
const VALID_PASSWORD = 'helpdesk 123';
const STORAGE_KEY = 'helpdesk_authenticated';

const AuthContext = createContext(null);

function readStored() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readStored);

  /** Returns { ok, usernameError, passwordError } */
  const login = useCallback((username, password) => {
    const usernameOk = username === VALID_USERNAME;
    const passwordOk = password === VALID_PASSWORD;

    if (usernameOk && passwordOk) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* ignore storage errors; in-memory state still works */
      }
      setIsAuthenticated(true);
      return { ok: true };
    }
    return {
      ok: false,
      usernameError: usernameOk ? '' : 'Incorrect username.',
      passwordError: passwordOk ? '' : 'Incorrect password.',
    };
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
