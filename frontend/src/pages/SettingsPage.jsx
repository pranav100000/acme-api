import React, { useState, useEffect } from 'react';
import * as api from '../api';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
        setForm(data);
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const updated = await api.updateSettings(form);
      setSettings(updated);
      setForm(updated);
      setDirty(false);
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({ ...settings });
    setDirty(false);
  };

  if (loading || !form) {
    return (
      <>
        <div className="page-header"><h2>Settings</h2></div>
        <div className="page-body"><div className="loading"><div className="spinner"></div></div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Settings</h2>
        {settings?.updatedAt && (
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </span>
        )}
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* General Settings */}
            <div className="card">
              <div className="card-header">
                <h3>General</h3>
              </div>
              <div style={{ padding: '20px', display: 'grid', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Application Name</label>
                  <input
                    className="form-control"
                    value={form.appName}
                    onChange={e => handleChange('appName', e.target.value)}
                    placeholder="My App"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Description</label>
                  <input
                    className="form-control"
                    value={form.appDescription}
                    onChange={e => handleChange('appDescription', e.target.value)}
                    placeholder="A short description of this application"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Timezone</label>
                    <select
                      className="form-control"
                      value={form.timezone}
                      onChange={e => handleChange('timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern (ET)</option>
                      <option value="America/Chicago">Central (CT)</option>
                      <option value="America/Denver">Mountain (MT)</option>
                      <option value="America/Los_Angeles">Pacific (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Berlin">Berlin (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Date Format</label>
                    <select
                      className="form-control"
                      value={form.dateFormat}
                      onChange={e => handleChange('dateFormat', e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* User Settings */}
            <div className="card">
              <div className="card-header">
                <h3>User Defaults</h3>
              </div>
              <div style={{ padding: '20px', display: 'grid', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Default Role for New Users</label>
                  <select
                    className="form-control"
                    value={form.defaultRole}
                    onChange={e => handleChange('defaultRole', e.target.value)}
                  >
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="admin">Admin</option>
                    <option value="product_manager">Product Manager</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>Allow Registration</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Allow new users to register via the login page</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={form.allowRegistration}
                      onChange={e => handleChange('allowRegistration', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>Require Email Verification</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>New users must verify their email before accessing the app</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={form.requireEmailVerification}
                      onChange={e => handleChange('requireEmailVerification', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="card">
              <div className="card-header">
                <h3>System</h3>
              </div>
              <div style={{ padding: '20px', display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Session Timeout (minutes)</label>
                    <input
                      className="form-control"
                      type="number"
                      min="5"
                      max="1440"
                      value={form.sessionTimeout}
                      onChange={e => handleChange('sessionTimeout', parseInt(e.target.value) || 30)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Max Team Size</label>
                    <input
                      className="form-control"
                      type="number"
                      min="1"
                      max="500"
                      value={form.maxTeamSize}
                      onChange={e => handleChange('maxTeamSize', parseInt(e.target.value) || 50)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#dc2626' }}>Maintenance Mode</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>When enabled, only admins can access the application</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={form.maintenanceMode}
                      onChange={e => handleChange('maintenanceMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save/Reset Actions */}
          <div style={{
            position: 'sticky', bottom: '0', background: '#f9fafb',
            padding: '16px 0', marginTop: '20px',
            display: 'flex', justifyContent: 'flex-end', gap: '8px',
            borderTop: dirty ? '1px solid #e5e7eb' : 'none'
          }}>
            {dirty && (
              <>
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  Discard Changes
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
