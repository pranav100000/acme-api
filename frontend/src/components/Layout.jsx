import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App';
import { getInitials } from '../utils/format';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>🏢 Acme Corp</h1>
          <span>Admin Dashboard</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/users">
            <span className="nav-icon">👥</span>
            Users
          </NavLink>
          <NavLink to="/teams">
            <span className="nav-icon">🏷️</span>
            Teams
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="sidebar-logout-btn"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
