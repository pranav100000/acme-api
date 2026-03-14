import React, { createContext, useContext, useMemo, useState } from 'react';
import { clearStoredUser, persistUser, readStoredUser } from './session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const value = useMemo(() => ({
    user,
    login(userData) {
      setUser(userData);
      persistUser(userData);
    },
    logout() {
      setUser(null);
      clearStoredUser();
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
