/**
 * API client module.
 * Provides typed helper functions for every backend endpoint.
 * All functions return parsed JSON and throw on network or HTTP errors.
 */

/** Base path for all API requests (proxied to the Express server by Vite in dev) */
const API_BASE = '/api';

/**
 * Core fetch wrapper shared by every API helper.
 * Automatically sets Content-Type to JSON, parses the response,
 * and throws descriptive errors for network failures or non-2xx responses.
 */
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (err) {
    throw new Error('Network error — unable to reach the server');
  }
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned ${res.status} with non-JSON response`);
  }
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// ── User endpoints ──────────────────────────────────────────────────
export const getUsers = () => request('/users');
export const getUser = (id) => request(`/users/${id}`);
export const getUserProfile = (id) => request(`/users/${id}/profile`);
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// ── Team endpoints ──────────────────────────────────────────────────
export const getTeams = () => request('/teams');
export const getTeam = (id) => request(`/teams/${id}`);
export const getTeamMembers = (id) => request(`/teams/${id}/members`);
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });
export const addTeamMember = (teamId, userId) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// ── Authentication endpoints ────────────────────────────────────────
export const login = (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
export const logout = () => request('/auth/logout', { method: 'POST' });

// ── Health check (no auth required) ─────────────────────────────────
export const healthCheck = () => fetch('/health').then(r => r.json());
