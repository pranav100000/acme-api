/**
 * @module App
 * @description Root application component. Provides authentication context
 * and handles top-level routing between Dashboard, Users, and Teams pages.
 */

import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import LoginPage from './pages/LoginPage';

/**
 * React context for sharing authentication state throughout the app.
 * @type {React.Context<{user: Object|null, login: Function, logout: Function}|null>}
 */
export const AuthContext = createContext(null);

/**
 * Custom hook to access the current authentication context.
 * @returns {{user: Object|null, login: Function, logout: Function}} Auth state and methods
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Root application component.
 * Manages user authentication state (persisted in localStorage) and renders
 * either the LoginPage or the authenticated app layout with routes.
 * @returns {React.ReactElement} The rendered application
 */
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acme_user');
    return saved ? JSON.parse(saved) : null;
  });

  /**
   * Handles successful login by saving user data to state and localStorage.
   * @param {Object} userData - The authenticated user object from the API
   */
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('acme_user', JSON.stringify(userData));
  };

  /**
   * Handles logout by clearing user data from state and localStorage.
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
