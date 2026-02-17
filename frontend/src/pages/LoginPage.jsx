/**
 * @module LoginPage
 * @description Login page for the Acme Corp admin dashboard.
 * Provides a passwordless email-based authentication form.
 */

import React, { useState } from 'react';
import { useAuth } from '../App';
import * as api from '../api';

/**
 * Login page component.
 * Renders an email-based login form with demo account hints.
 * On successful authentication, stores the user in auth context.
 *
 * @returns {JSX.Element} The login page
 */
export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission for login.
   * Calls the login API and updates auth context on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(email);
      login(data.user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🏢 Acme Corp</h1>
        <p className="login-subtitle">Sign in to the admin dashboard</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="alice@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px', color: '#6b7280' }}>
          <strong style={{ color: '#374151' }}>Demo accounts:</strong>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <code>alice@acme.com</code> (admin)
            <code>bob@acme.com</code> (developer)
            <code>frank@acme.com</code> (product manager)
          </div>
        </div>
      </div>
    </div>
  );
}
