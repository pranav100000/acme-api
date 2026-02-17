/**
 * @module App
 * @description Root application component that handles authentication state
 * and top-level routing for the Acme Corp admin dashboard.
 */

import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import LoginPage from './pages/LoginPage';

/**
 * React context for sharing authentication state across the component tree.
 * Provides `user`, `login`, and `logout` to consumers.
 * @type {React.Context<{user: Object|null, login: Function, logout: Function}|null>}
 */
export const AuthContext = createContext(null);

/**
 * Custom hook to access the current authentication context.
 * Must be used within an `AuthContext.Provider`.
 *
 * @returns {{ user: Object|null, login: Function, logout: Function }} The auth context value
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Root application component.
 * Manages user authentication state (persisted in localStorage) and renders
 * either the login page or the authenticated dashboard layout with routes.
 *
 * @returns {JSX.Element} The rendered application
 */
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acme_user');
    return saved ? JSON.parse(saved) : null;
  });

  /**
   * Handles user login by updating state and persisting to localStorage.
   * @param {Object} userData - The authenticated user object from the API
   */
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('acme_user', JSON.stringify(userData));
  };

  /**
   * Handles user logout by clearing state and removing from localStorage.
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('acme_user');
  };

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
