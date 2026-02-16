/**
 * Root application component.
 *
 * Manages authentication state and renders either the login screen or the
 * main app shell with client-side routing. Auth state is persisted in
 * localStorage so the user stays logged in across page refreshes.
 */

import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import LoginPage from './pages/LoginPage';

// Shared auth context — consumed via the useAuth() hook in child components
export const AuthContext = createContext(null);

/** Convenience hook to access the current user and login/logout helpers. */
export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  // Lazily initialize user state from localStorage (runs once on mount)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acme_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('acme_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('acme_user');
  };

  // Unauthenticated users see only the login page — no sidebar or routing
  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
}
