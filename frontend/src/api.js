/**
 * Frontend API client.
 *
 * All functions in this module return Promises that resolve to parsed JSON.
 * Network errors, non-JSON responses, and non-2xx status codes are converted
 * into thrown Error objects with user-friendly messages.
 */

/** Base path for all API requests (proxied to the Express backend in dev) */
const API_BASE = '/api';

/**
 * Core fetch wrapper shared by every API helper below.
 *
 * - Sets `Content-Type: application/json` by default.
 * - Converts network failures and non-JSON responses into descriptive errors.
 * - Extracts the `error` field from JSON error bodies so callers get clean messages.
 *
 * @param {string} path  - API path relative to API_BASE (e.g. '/users')
 * @param {RequestInit} options - Standard fetch options (method, body, headers, …)
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

// --- User endpoints -----------------------------------------------------------
export const getUsers       = ()           => request('/users');
export const getUser        = (id)         => request(`/users/${id}`);
export const getUserProfile = (id)         => request(`/users/${id}/profile`);
export const createUser     = (data)       => request('/users',        { method: 'POST',   body: JSON.stringify(data) });
export const updateUser     = (id, data)   => request(`/users/${id}`,  { method: 'PATCH',  body: JSON.stringify(data) });
export const deleteUser     = (id)         => request(`/users/${id}`,  { method: 'DELETE' });

// --- Team endpoints -----------------------------------------------------------
export const getTeams        = ()               => request('/teams');
export const getTeam         = (id)             => request(`/teams/${id}`);
export const getTeamMembers  = (id)             => request(`/teams/${id}/members`);
export const createTeam      = (data)           => request('/teams',                    { method: 'POST',   body: JSON.stringify(data) });
export const addTeamMember   = (teamId, userId) => request(`/teams/${teamId}/members`,  { method: 'POST',   body: JSON.stringify({ userId }) });
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// --- Auth endpoints -----------------------------------------------------------
export const login  = (email) => request('/auth/login',  { method: 'POST', body: JSON.stringify({ email }) });
export const logout = ()      => request('/auth/logout', { method: 'POST' });

// --- Health check (bypasses the shared request() wrapper) ---------------------
export const healthCheck = () => fetch('/health').then(r => r.json());
