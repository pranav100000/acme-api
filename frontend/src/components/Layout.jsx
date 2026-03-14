import React from 'react';
import { NavLink } from 'react-router-dom';
import { getInitials } from '../utils/user';

export default function Layout({ children, user, logout }) {
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
        <div style={{ padding: '16px 12px', borderTop: '1px solid #374151' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#4f46e5', color: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '600'
            }}>
              {getInitials(user?.name) || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'transparent', border: 'none', color: '#9ca3af',
                cursor: 'pointer', fontSize: '18px', padding: '4px'
              }}
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
