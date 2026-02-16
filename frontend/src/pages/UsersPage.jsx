/**
 * Users management page.
 *
 * Displays a filterable table of all users with actions to create, edit, and
 * deactivate (soft-delete) accounts. User data is fetched from /api/users and
 * mutations optimistically reload the list.
 */
import React, { useState, useEffect } from 'react';
import * as api from '../api';
import Modal from '../components/Modal';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState('all');

  /** Fetch the full user list from the API and update local state. */
  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Load users once on mount
  useEffect(() => { loadUsers(); }, []);

  /** Soft-delete a user (sets status to 'inactive') after confirmation. */
  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}? This will set their status to inactive.`)) return;
    try {
      await api.deleteUser(user.id);
      setSuccess(`${user.name} has been deactivated`);
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Apply the active status filter ('all' shows everything)
  const filteredUsers = filter === 'all' ? users : users.filter(u => u.status === filter);

  if (loading) {
    return (
      <>
        <div className="page-header"><h2>Users</h2></div>
        <div className="page-body"><div className="loading"><div className="spinner"></div></div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Add User
        </button>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          {['all', 'active', 'inactive', 'pending'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && ` (${users.filter(u => u.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: '#4f46e5', color: 'white', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: '600', flexShrink: 0
                          }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge badge-${user.role}`}>{user.role.replace('_', ' ')}</span></td>
                      <td><span className={`badge badge-${user.status}`}>{user.status}</span></td>
                      <td style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingUser(user)}>
                            Edit
                          </button>
                          {user.status !== 'inactive' && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user)}>
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); loadUsers(); setSuccess('User created successfully'); setTimeout(() => setSuccess(''), 3000); }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => { setEditingUser(null); loadUsers(); setSuccess('User updated successfully'); setTimeout(() => setSuccess(''), 3000); }}
        />
      )}
    </>
  );
}

/** Modal form for creating a new user account. */
function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'developer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createUser(form);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create User" onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="john@acme.com" />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="admin">Admin</option>
            <option value="product_manager">Product Manager</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Modal form for editing an existing user's name, email, role, and status. */
function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, status: user.status });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.updateUser(user.id, form);
      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Edit ${user.name}`} onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="admin">Admin</option>
            <option value="product_manager">Product Manager</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
