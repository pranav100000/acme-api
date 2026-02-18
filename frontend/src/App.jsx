/**
 * Root application component.
 *
 * Manages authentication state via React Context and renders either
 * the login page (unauthenticated) or the main dashboard layout
 * (authenticated) with client-side routing.
 */
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import LoginPage from './pages/LoginPage';

/**
 * AuthContext provides { user, login, logout } to the entire component tree.
 * Consumed via the useAuth() hook below.
 */
export const AuthContext = createContext(null);

/** Convenience hook to access the current auth state and actions. */
export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  // Restore user session from localStorage on initial render so that
  // a page refresh doesn't force the user to log in again.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acme_user');
    return saved ? JSON.parse(saved) : null;
  });

  /** Persist the authenticated user to state and localStorage. */
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('acme_user', JSON.stringify(userData));
  };

  /** Clear user session from state and localStorage. */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('acme_user');
  };

  // Unauthenticated users only see the login page
  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  // Authenticated users get the sidebar layout with route-based navigation.
  // Unknown paths redirect to the dashboard.
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
