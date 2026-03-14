import React, { useState, useEffect } from 'react';
import * as api from '../api';
import Modal from '../components/Modal';
import ModalActions from '../components/ModalActions';
import PageLoader from '../components/PageLoader';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { formatRole, getInitials } from '../utils/format';

const ROLE_OPTIONS = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'admin', label: 'Admin' },
  { value: 'product_manager', label: 'Product Manager' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, showSuccess] = useFlashMessage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}? This will set their status to inactive.`)) return;
    try {
      await api.deleteUser(user.id);
      showSuccess(`${user.name} has been deactivated`);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.status === filter);

  if (loading) {
    return <PageLoader title="Users" />;
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
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge badge-${user.role}`}>{formatRole(user.role)}</span></td>
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
          onCreated={() => { setShowCreateModal(false); loadUsers(); showSuccess('User created successfully'); }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => { setEditingUser(null); loadUsers(); showSuccess('User updated successfully'); }}
        />
      )}
    </>
  );
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
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <UserFormFields form={form} setForm={setForm} />
        <ModalActions onCancel={onClose} submitLabel="Create User" loadingLabel="Creating..." isLoading={loading} />
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
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <UserFormFields form={form} setForm={setForm} />
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        <ModalActions onCancel={onClose} submitLabel="Save Changes" loadingLabel="Saving..." isLoading={loading} />
      </form>
    </Modal>
  );
}

function UserFormFields({ form, setForm }) {
  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="form-group">
        <label>Name</label>
        <input className="form-control" value={form.name} onChange={updateField('name')} required placeholder="John Doe" />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input className="form-control" type="email" value={form.email} onChange={updateField('email')} required placeholder="john@acme.com" />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select className="form-control" value={form.role} onChange={updateField('role')}>
          {ROLE_OPTIONS.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
