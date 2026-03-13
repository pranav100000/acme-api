import React, { useEffect, useMemo, useState } from 'react';
import * as api from '../api';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import PageLoader from '../components/PageLoader';
import FlashMessage from '../components/FlashMessage';
import Avatar from '../components/Avatar';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { formatDate, formatRole } from '../utils/formatters';

const USER_FILTERS = ['all', 'active', 'inactive', 'pending'];
const USER_ROLES = [
  ['developer', 'Developer'],
  ['designer', 'Designer'],
  ['admin', 'Admin'],
  ['product_manager', 'Product Manager'],
];
const USER_STATUSES = [
  ['active', 'Active'],
  ['inactive', 'Inactive'],
  ['pending', 'Pending'],
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const error = useFlashMessage();
  const success = useFlashMessage();

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch {
      error.show('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () => (filter === 'all' ? users : users.filter((user) => user.status === filter)),
    [filter, users]
  );

  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}? This will set their status to inactive.`)) {
      return;
    }

    try {
      await api.deleteUser(user.id);
      success.show(`${user.name} has been deactivated`);
      await loadUsers();
    } catch (err) {
      error.show(err.message);
    }
  };

  const handleCreated = async () => {
    setShowCreateModal(false);
    success.show('User created successfully');
    await loadUsers();
  };

  const handleUpdated = async () => {
    setEditingUser(null);
    success.show('User updated successfully');
    await loadUsers();
  };

  if (loading) {
    return <PageLoader title="Users" />;
  }

  return (
    <>
      <PageHeader
        title="Users"
        actions={
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Add User
          </button>
        }
      />
      <div className="page-body">
        <FlashMessage type="error" message={error.message} />
        <FlashMessage type="success" message={success.message} />

        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          {USER_FILTERS.map((value) => (
            <button
              key={value}
              className={`btn btn-sm ${filter === value ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(value)}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
              {value !== 'all' && ` (${users.filter((user) => user.status === value).length})`}
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
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Avatar name={user.name} />
                          <div>
                            <div style={{ fontWeight: 500 }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge badge-${user.role}`}>{formatRole(user.role)}</span></td>
                      <td><span className={`badge badge-${user.status}`}>{user.status}</span></td>
                      <td style={{ fontSize: '13px', color: '#6b7280' }}>{formatDate(user.createdAt)}</td>
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
        <CreateUserModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />
      )}

      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdated={handleUpdated} />
      )}
    </>
  );
}

function UserRoleOptions() {
  return USER_ROLES.map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
}

function UserStatusOptions() {
  return USER_STATUSES.map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
}

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
      <FlashMessage type="error" message={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="john@acme.com" />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <UserRoleOptions />
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
      <FlashMessage type="error" message={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <UserRoleOptions />
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <UserStatusOptions />
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
