/**
 * Root application component.
 * Sets up authentication context, client-side routing, and the main layout.
 */
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import LoginPage from './pages/LoginPage';

/** Shared auth context — consumed by any component that needs the current user or login/logout actions */
export const AuthContext = createContext(null);

/** Convenience hook so consumers don't need to import AuthContext directly */
export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  // Hydrate user from localStorage so sessions survive page refreshes
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

  // If there's no authenticated user, show the login page (no layout chrome)
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
