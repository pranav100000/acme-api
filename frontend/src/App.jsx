/**
 * Root application component.
 *
 * Manages authentication state via React Context and renders either the
 * LoginPage (when unauthenticated) or the main dashboard layout with
 * client-side routing.
 */
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import LoginPage from './pages/LoginPage';

/** Context that provides { user, login, logout } to the entire component tree. */
export const AuthContext = createContext(null);

/** Convenience hook — shorthand for useContext(AuthContext). */
export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  // Restore the logged-in user from localStorage so sessions survive page refreshes
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acme_user');
    return saved ? JSON.parse(saved) : null;
  });

  /** Persist user data to state and localStorage on successful login. */
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('acme_user', JSON.stringify(userData));
  };

  /** Clear user data from state and localStorage on logout. */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('acme_user');
  };

  // Unauthenticated users see only the login page
  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  // Authenticated users get the full dashboard with sidebar navigation
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
