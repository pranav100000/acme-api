const API_BASE = '/api';

/**
 * Get the stored auth token
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('acme_token');
}

/**
 * Store the auth token
 * @param {string} token
 */
function setToken(token) {
  localStorage.setItem('acme_token', token);
}

/**
 * Remove the stored auth token
 */
function removeToken() {
  localStorage.removeItem('acme_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers,
      ...options,
    });
  } catch (err) {
    throw new Error('Network error — unable to reach the server');
  }

  // Handle 401 by clearing token and redirecting to login (skip for auth endpoints)
  if (res.status === 401 && !path.startsWith('/auth/login') && !path.startsWith('/auth/register')) {
    removeToken();
    localStorage.removeItem('acme_user');
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
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

// Users
export const getUsers = () => request('/users');
export const getUser = (id) => request(`/users/${id}`);
export const getUserProfile = (id) => request(`/users/${id}/profile`);
export const createUser = (data) => request('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// Teams
export const getTeams = () => request('/teams');
export const getTeam = (id) => request(`/teams/${id}`);
export const getTeamMembers = (id) => request(`/teams/${id}/members`);
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });
export const addTeamMember = (teamId, userId) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });
export const removeTeamMember = (teamId, userId) => request(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });

// Auth
export const login = (email, password) => {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    .then(data => {
      if (data.token) {
        setToken(data.token);
      }
      return data;
    });
};

export const register = (email, name, password, role) => {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ email, name, password, role }) })
    .then(data => {
      if (data.token) {
        setToken(data.token);
      }
      return data;
    });
};

export const logout = () => {
  return request('/auth/logout', { method: 'POST' })
    .finally(() => {
      removeToken();
    });
};

export const getMe = () => request('/auth/me');

// Health
export const healthCheck = () => fetch('/health').then(r => r.json());
