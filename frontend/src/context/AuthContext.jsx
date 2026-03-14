import React, { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'acme_user';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const value = useMemo(() => ({
    user,
    login(userData) {
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    },
    logout() {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
