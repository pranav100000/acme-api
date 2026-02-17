/**
 * Documentation page — provides an overview of the Admin Dashboard's
 * API endpoints, features, and usage guide for developers and admins.
 */
import React, { useState } from 'react';

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '📖',
    content: `The Acme Corp Admin Dashboard provides a centralized interface for managing users and teams within the organization. It includes user account management, team organization, and real-time system health monitoring.`,
  },
  {
    id: 'api-users',
    title: 'Users API',
    icon: '👥',
    endpoints: [
      { method: 'GET', path: '/api/users', description: 'List all users' },
      { method: 'GET', path: '/api/users/:id', description: 'Get a user by ID' },
      { method: 'GET', path: '/api/users/:id/profile', description: 'Get user profile (display name, initials)' },
      { method: 'POST', path: '/api/users', description: 'Create a new user (requires email and name)' },
      { method: 'PATCH', path: '/api/users/:id', description: 'Update user fields (name, email, role, status)' },
      { method: 'DELETE', path: '/api/users/:id', description: 'Soft-delete a user (sets status to inactive)' },
    ],
  },
  {
    id: 'api-teams',
    title: 'Teams API',
    icon: '🏷️',
    endpoints: [
      { method: 'GET', path: '/api/teams', description: 'List all teams' },
      { method: 'GET', path: '/api/teams/:id', description: 'Get a team by ID' },
      { method: 'GET', path: '/api/teams/:id/members', description: 'Get resolved member list for a team' },
      { method: 'POST', path: '/api/teams', description: 'Create a new team (requires name)' },
      { method: 'POST', path: '/api/teams/:id/members', description: 'Add a member to a team (requires userId)' },
      { method: 'DELETE', path: '/api/teams/:id/members/:userId', description: 'Remove a member from a team' },
    ],
  },
  {
    id: 'api-auth',
    title: 'Auth API',
    icon: '🔐',
    endpoints: [
      { method: 'POST', path: '/api/auth/login', description: 'Login with email (no password required in demo)' },
      { method: 'POST', path: '/api/auth/logout', description: 'Logout (stateless — client clears session)' },
    ],
  },
  {
    id: 'api-health',
    title: 'Health Check',
    icon: '💚',
    endpoints: [
      { method: 'GET', path: '/health', description: 'Returns { status: "ok" } when the server is running' },
    ],
  },
  {
    id: 'roles',
    title: 'User Roles',
    icon: '🎭',
    content: `Users can be assigned one of the following roles:`,
    roles: [
      { name: 'admin', description: 'Full access to all dashboard features', color: '#dc2626' },
      { name: 'developer', description: 'Standard team member with development focus', color: '#2563eb' },
      { name: 'designer', description: 'Design-focused team member', color: '#7c3aed' },
      { name: 'product_manager', description: 'Product planning and coordination', color: '#059669' },
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    content: `To get started with the Admin Dashboard:\n\n1. Login using one of the demo accounts (e.g. alice@acme.com)\n2. View the Dashboard for an overview of users, teams, and API health\n3. Navigate to Users to manage user accounts\n4. Navigate to Teams to organize users into groups\n\nThe API runs on port 3000 and the frontend dev server on port 5173 with requests proxied to the backend.`,
  },
];

/** Badge for HTTP method (GET, POST, PATCH, DELETE) with color coding. */
function MethodBadge({ method }) {
  const colors = {
    GET: { bg: '#dbeafe', text: '#1d4ed8' },
    POST: { bg: '#dcfce7', text: '#15803d' },
    PATCH: { bg: '#fef9c3', text: '#a16207' },
    DELETE: { bg: '#fee2e2', text: '#dc2626' },
  };
  const style = colors[method] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '700',
      fontFamily: 'monospace',
      background: style.bg,
      color: style.text,
      minWidth: '60px',
      textAlign: 'center',
    }}>
      {method}
    </span>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <>
      <div className="page-header">
        <h2>Documentation</h2>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          API reference &amp; usage guide
        </span>
      </div>
      <div className="page-body">
        {/* Section navigation tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {sections.map(section => (
            <button
              key={section.id}
              className={`btn btn-sm ${activeSection === section.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span style={{ marginRight: '4px' }}>{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Render the active section */}
        {sections.map(section => {
          if (section.id !== activeSection) return null;

          return (
            <div key={section.id} className="card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{section.icon}</span>
                {section.title}
              </h3>

              {/* Text content */}
              {section.content && (
                <div style={{ color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: section.endpoints || section.roles ? '20px' : 0 }}>
                  {section.content}
                </div>
              )}

              {/* API endpoint table */}
              {section.endpoints && (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>Method</th>
                        <th style={{ width: '280px' }}>Endpoint</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.endpoints.map((ep, i) => (
                        <tr key={i}>
                          <td><MethodBadge method={ep.method} /></td>
                          <td>
                            <code style={{ fontSize: '13px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                              {ep.path}
                            </code>
                          </td>
                          <td style={{ color: '#6b7280', fontSize: '14px' }}>{ep.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Roles list */}
              {section.roles && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {section.roles.map(role => (
                    <div key={role.name} style={{
                      padding: '14px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: role.color + '18',
                        color: role.color,
                      }}>
                        {role.name.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{role.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
