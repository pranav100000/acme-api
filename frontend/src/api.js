/**
 * API client module.
 * Provides a thin wrapper around `fetch` for communicating with the backend.
 * All functions return parsed JSON and throw descriptive errors on failure.
 */

/** Base path for all API requests (proxied to the Express server in dev) */
const API_BASE = '/api';

/**
 * Core request helper. Sends a fetch request with JSON content-type,
 * parses the response, and throws a user-friendly error if anything goes wrong.
 *
 * @param {string} path  - API path relative to API_BASE (e.g. '/users')
 * @param {object} options - Standard fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Parsed JSON response body
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

// ── Auth endpoints ──────────────────────────────────────────────────
export const login = (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
export const logout = () => request('/auth/logout', { method: 'POST' });

// ── Health check ────────────────────────────────────────────────────
export const healthCheck = () => fetch('/health').then(r => r.json());
