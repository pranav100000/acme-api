/**
 * Frontend API client.
 * Wraps fetch() with JSON handling, error normalization, and a shared base URL.
 * All exported functions return Promises that resolve to parsed JSON data
 * or reject with an Error containing a user-friendly message.
 */

const API_BASE = '/api';

/**
 * Core request helper — sends a fetch request with JSON headers and
 * normalizes errors into thrown Error objects.
 *
 * @param {string} path - API path relative to /api (e.g. '/users')
 * @param {RequestInit} options - Standard fetch options (method, body, etc.)
 * @returns {Promise<any>} Parsed JSON response body
 */
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (err) {
    // Network-level failure (server down, CORS, DNS, etc.)
    throw new Error('Network error — unable to reach the server');
  }
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned ${res.status} with non-JSON response`);
  }
  if (!res.ok) {
    // Surface the server-provided error message when available
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// --- User endpoints ---
export const getUsers = () => request('/users');
export const getUser = (id) => request(`/users/${id}`);
export const getUserProfile = (id) => request(`/users/${id}/profile`);
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// --- Team endpoints ---
export const getTeams = () => request('/teams');
export const getTeam = (id) => request(`/teams/${id}`);
export const getTeamMembers = (id) => request(`/teams/${id}/members`);
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });
export const addTeamMember = (teamId, userId) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// --- Auth endpoints ---
export const login = (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
export const logout = () => request('/auth/logout', { method: 'POST' });

// --- Health check (bypasses the request() wrapper since it's outside /api) ---
export const healthCheck = () => fetch('/health').then(r => r.json());
