/**
 * API client module.
 *
 * All backend calls go through the `request()` helper, which handles
 * JSON serialization, error normalization, and content-type headers.
 * Exported functions are thin wrappers grouped by resource.
 */

const API_BASE = '/api';

/**
 * Core fetch wrapper used by every API function.
 *
 * - Sets `Content-Type: application/json` by default.
 * - Throws a human-readable Error on network failures, non-JSON responses,
 *   or non-2xx status codes.
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

// ─── Users ───────────────────────────────────────────────────────────────────
export const getUsers = () => request('/users');
export const getUser = (id) => request(`/users/${id}`);
export const getUserProfile = (id) => request(`/users/${id}/profile`);
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// ─── Teams ───────────────────────────────────────────────────────────────────
export const getTeams = () => request('/teams');
export const getTeam = (id) => request(`/teams/${id}`);
export const getTeamMembers = (id) => request(`/teams/${id}/members`);
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });
export const addTeamMember = (teamId, userId) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
export const logout = () => request('/auth/logout', { method: 'POST' });

// ─── Health ──────────────────────────────────────────────────────────────────
// Hits /health directly (not /api/health) since the health endpoint lives at the root
export const healthCheck = () => fetch('/health').then(r => r.json());
