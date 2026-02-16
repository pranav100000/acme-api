/**
 * Dashboard page — the landing page after login.
 *
 * Fetches users, teams, and API health in parallel and displays:
 * - Summary stat cards (total users, teams, roles, API status)
 * - A "Recent Users" table (5 most recently created)
 * - A "Teams Overview" table with member counts
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all dashboard data once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users, teams, and health status concurrently for faster load
        const [usersData, teamsData, healthData] = await Promise.all([
          api.getUsers(),
          api.getTeams(),
          api.healthCheck(),
        ]);
        setUsers(usersData);
        setTeams(teamsData);
        setHealth(healthData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div className="page-header"><h2>Dashboard</h2></div>
        <div className="page-body"><div className="loading"><div className="spinner"></div></div></div>
      </>
    );
  }

  // Derived statistics for the stat cards
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  // Sort users by creation date (newest first) and take the top 5
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
            background: health?.status === 'ok' ? '#16a34a' : '#dc2626'
          }}></span>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            API {health?.status === 'ok' ? 'Healthy' : 'Unhealthy'}
          </span>
        </div>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-detail">{activeUsers} active, {pendingUsers} pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Teams</div>
            <div className="stat-value">{teams.length}</div>
            <div className="stat-detail">{teams.reduce((sum, t) => sum + t.members.length, 0)} total memberships</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Roles</div>
            <div className="stat-value">{new Set(users.map(u => u.role)).size}</div>
            <div className="stat-detail">Unique roles across users</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">API Status</div>
            <div className="stat-value" style={{ color: health?.status === 'ok' ? '#16a34a' : '#dc2626' }}>
              {health?.status === 'ok' ? '✓' : '✗'}
            </div>
            <div className="stat-detail">{health?.status === 'ok' ? 'All systems operational' : 'Issues detected'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3>Recent Users</h3>
              <Link to="/users" className="btn btn-secondary btn-sm">View all</Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                      </td>
                      <td><span className={`badge badge-${user.role}`}>{user.role.replace('_', ' ')}</span></td>
                      <td><span className={`badge badge-${user.status}`}>{user.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Teams Overview</h3>
              <Link to="/teams" className="btn btn-secondary btn-sm">View all</Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Members</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map(team => (
                    <tr key={team.id}>
                      <td style={{ fontWeight: 500 }}>{team.name}</td>
                      <td>{team.members.length} members</td>
                      <td style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(team.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
