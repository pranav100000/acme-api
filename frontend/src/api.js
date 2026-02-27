/**
 * @module api
 * @description Frontend API client for communicating with the Acme Corp backend.
 * All functions return promises that resolve with parsed JSON data.
 */

/** @type {string} Base URL prefix for all API requests */
const API_BASE = '/api';

/**
 * Makes an HTTP request to the API and returns parsed JSON.
 * Automatically sets Content-Type to application/json.
 * @param {string} path - API endpoint path (e.g. '/users')
 * @param {RequestInit} [options={}] - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} Parsed JSON response data
 * @throws {Error} On network errors, non-JSON responses, or non-OK HTTP status codes
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

// ─── User API ────────────────────────────────────────────────

/** @returns {Promise<Array>} List of all users */
export const getUsers = () => request('/users');

/**
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object (id, email, name, role)
 */
export const getUser = (id) => request(`/users/${id}`);

/**
 * @param {string} id - User ID
 * @returns {Promise<Object>} User profile (displayName, email, initials)
 */
export const getUserProfile = (id) => request(`/users/${id}/profile`);

/**
 * @param {Object} data - New user data
 * @param {string} data.email - Email address
 * @param {string} data.name - Full name
 * @param {string} [data.role] - Role (defaults to 'developer')
 * @returns {Promise<Object>} Created user object
 */
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });

/**
 * @param {string} id - User ID
 * @param {Object} data - Fields to update (email, name, role, status)
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

/**
 * Soft-deletes a user (sets status to inactive).
 * @param {string} id - User ID
 * @returns {Promise<Object>} Deactivation confirmation with user object
 */
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// ─── Team API ────────────────────────────────────────────────

/** @returns {Promise<Array>} List of all teams */
export const getTeams = () => request('/teams');

/**
 * @param {string} id - Team ID
 * @returns {Promise<Object>} Team object
 */
export const getTeam = (id) => request(`/teams/${id}`);

/**
 * @param {string} id - Team ID
 * @returns {Promise<Array>} Array of user objects belonging to the team
 */
export const getTeamMembers = (id) => request(`/teams/${id}/members`);

/**
 * @param {Object} data - New team data
 * @param {string} data.name - Team name
 * @returns {Promise<Object>} Created team object
 */
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });

/**
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID to add as member
 * @returns {Promise<Object>} Updated team object
 */
export const addTeamMember = (teamId, userId) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });

/**
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID to remove
 * @returns {Promise<Object>} Updated team object
 */
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// ─── Auth API ────────────────────────────────────────────────

/**
 * Authenticates a user by email.
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Login response with user data: { message, user }
 */
export const login = (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });

/** @returns {Promise<Object>} Logout confirmation: { message } */
export const logout = () => request('/auth/logout', { method: 'POST' });

// ─── Health API ──────────────────────────────────────────────

/**
 * Checks the API server health status.
 * @returns {Promise<Object>} Health status: { status: 'ok' | ... }
 */
export const healthCheck = () => fetch('/health').then(r => r.json());
