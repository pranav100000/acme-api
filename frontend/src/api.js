/**
 * @module api
 * @description API client for communicating with the Acme Corp backend.
 * All functions return parsed JSON responses and throw errors on failure.
 */

/** @constant {string} API_BASE - Base URL prefix for all API endpoints */
const API_BASE = '/api';

/**
 * Makes an authenticated HTTP request to the API.
 * Automatically sets JSON content-type headers and parses the response.
 *
 * @async
 * @param {string} path - The API endpoint path (appended to API_BASE)
 * @param {RequestInit} [options={}] - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} The parsed JSON response data
 * @throws {Error} If the network is unreachable, response is non-JSON, or the server returns an error status
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

// ──────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────

/**
 * Fetches all users.
 * @returns {Promise<Object[]>} Array of user objects
 */
export const getUsers = () => request('/users');

/**
 * Fetches a single user by ID.
 * @param {string} id - The user's unique identifier
 * @returns {Promise<Object>} The user object
 */
export const getUser = (id) => request(`/users/${id}`);

/**
 * Fetches a user's profile by ID.
 * @param {string} id - The user's unique identifier
 * @returns {Promise<Object>} The user profile object
 */
export const getUserProfile = (id) => request(`/users/${id}/profile`);

/**
 * Creates a new user.
 * @param {Object} data - The user data
 * @param {string} data.name - The user's full name
 * @param {string} data.email - The user's email address
 * @param {string} data.role - The user's role (e.g. 'developer', 'admin')
 * @returns {Promise<Object>} The newly created user object
 */
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });

/**
 * Updates an existing user.
 * @param {string} id - The user's unique identifier
 * @param {Object} data - The fields to update
 * @param {string} [data.name] - Updated name
 * @param {string} [data.email] - Updated email
 * @param {string} [data.role] - Updated role
 * @param {string} [data.status] - Updated status
 * @returns {Promise<Object>} The updated user object
 */
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

/**
 * Deletes (deactivates) a user by ID.
 * @param {string} id - The user's unique identifier
 * @returns {Promise<Object>} Confirmation response
 */
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// ──────────────────────────────────────────────
// Teams
// ──────────────────────────────────────────────

/**
 * Fetches all teams.
 * @returns {Promise<Object[]>} Array of team objects
 */
export const getTeams = () => request('/teams');

/**
 * Fetches a single team by ID.
 * @param {string} id - The team's unique identifier
 * @returns {Promise<Object>} The team object
 */
export const getTeam = (id) => request(`/teams/${id}`);

/**
 * Fetches all members of a team.
 * @param {string} id - The team's unique identifier
 * @returns {Promise<Object[]>} Array of user objects who are members of the team
 */
export const getTeamMembers = (id) => request(`/teams/${id}/members`);

/**
 * Creates a new team.
 * @param {Object} data - The team data
 * @param {string} data.name - The team's name
 * @returns {Promise<Object>} The newly created team object
 */
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });

/**
 * Adds a user to a team.
 * @param {string} teamId - The team's unique identifier
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} Confirmation response
 */
export const addTeamMember = (teamId, userId) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });

/**
 * Removes a user from a team.
 * @param {string} teamId - The team's unique identifier
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} Confirmation response
 */
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

/**
 * Authenticates a user by email (passwordless login).
 * @param {string} email - The user's email address
 * @returns {Promise<Object>} Response containing the authenticated user data
 */
export const login = (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });

/**
 * Logs out the current user session.
 * @returns {Promise<Object>} Confirmation response
 */
export const logout = () => request('/auth/logout', { method: 'POST' });

// ──────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────

/**
 * Checks the API server health status.
 * @returns {Promise<Object>} Health status object (e.g. { status: 'ok' })
 */
export const healthCheck = () => fetch('/health').then(r => r.json());
