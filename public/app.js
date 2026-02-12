// ============================================
// Acme Corp Dashboard - Frontend Application
// ============================================

const API_BASE = '/api';

// Global state
let allUsers = [];
let allTeams = [];
let currentUser = null;

// ============================================
// API Helper
// ============================================

async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// ============================================
// Navigation
// ============================================

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
  });
});

function navigateTo(page) {
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  // Load data for the page
  switch (page) {
    case 'dashboard': loadDashboard(); break;
    case 'users': loadUsers(); break;
    case 'teams': loadTeams(); break;
    case 'auth': break;
  }

  // Update URL hash
  window.location.hash = page;
}

// Handle browser back/forward
window.addEventListener('hashchange', () => {
  const page = window.location.hash.slice(1) || 'dashboard';
  navigateTo(page);
});

// ============================================
// Health Check
// ============================================

async function checkHealth() {
  const statusEl = document.getElementById('healthStatus');
  try {
    const res = await fetch('/health');
    const data = await res.json();
    if (data.status === 'ok') {
      statusEl.innerHTML = '<span class="status-dot online"></span><span>API Online</span>';
    } else {
      throw new Error('Unhealthy');
    }
  } catch {
    statusEl.innerHTML = '<span class="status-dot offline"></span><span>API Offline</span>';
  }
}

// ============================================
// Dashboard
// ============================================

async function loadDashboard() {
  try {
    const [users, teams] = await Promise.all([
      api('/users'),
      loadAllTeams(),
    ]);

    allUsers = users;

    // Stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.filter(u => u.status === 'active').length;
    document.getElementById('pendingUsers').textContent = users.filter(u => u.status === 'pending').length;
    document.getElementById('totalTeams').textContent = teams.length;

    // Recent users (sorted by createdAt descending)
    const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentEl = document.getElementById('recentUsers');
    recentEl.innerHTML = sortedUsers.slice(0, 5).map(user => `
      <div class="list-item">
        <div class="list-item-avatar">${getInitials(user.name)}</div>
        <div class="list-item-info">
          <div class="list-item-name">${escapeHtml(user.name)}</div>
          <div class="list-item-detail">${escapeHtml(user.email)}</div>
        </div>
        <span class="badge badge-${user.status}">${capitalize(user.status)}</span>
      </div>
    `).join('');

    // Teams overview
    const teamsEl = document.getElementById('teamsOverview');
    teamsEl.innerHTML = teams.map(team => `
      <div class="list-item">
        <div class="list-item-avatar">🏢</div>
        <div class="list-item-info">
          <div class="list-item-name">${escapeHtml(team.name)}</div>
          <div class="list-item-detail">${team.members.length} member${team.members.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load dashboard:', err);
    showToast('Failed to load dashboard data', 'error');
  }
}

// ============================================
// Users
// ============================================

async function loadUsers() {
  try {
    allUsers = await api('/users');
    renderUsersTable(allUsers);
  } catch (err) {
    console.error('Failed to load users:', err);
    showToast('Failed to load users', 'error');
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-icon">👥</div>
          <p>No users found</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="list-item-avatar" style="width: 32px; height: 32px; font-size: 12px;">${getInitials(user.name)}</div>
          <span>${escapeHtml(user.name)}</span>
        </div>
      </td>
      <td>${escapeHtml(user.email)}</td>
      <td><span class="role-badge">${formatRole(user.role)}</span></td>
      <td><span class="badge badge-${user.status}">${capitalize(user.status)}</span></td>
      <td>${formatDate(user.createdAt)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-secondary" onclick="showEditUserModal('${user.id}')" title="Edit">✏️</button>
          ${user.status !== 'inactive' ? `<button class="btn btn-sm btn-danger" onclick="deactivateUser('${user.id}')" title="Deactivate">🗑️</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterUsers() {
  const search = document.getElementById('userSearch').value.toLowerCase();
  const status = document.getElementById('userStatusFilter').value;

  let filtered = allUsers;
  if (search) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.role.toLowerCase().includes(search)
    );
  }
  if (status) {
    filtered = filtered.filter(u => u.status === status);
  }
  renderUsersTable(filtered);
}

function showCreateUserModal() {
  document.getElementById('newUserName').value = '';
  document.getElementById('newUserEmail').value = '';
  document.getElementById('newUserRole').value = 'developer';
  openModal('createUserModal');
}

async function handleCreateUser(e) {
  e.preventDefault();
  const name = document.getElementById('newUserName').value;
  const email = document.getElementById('newUserEmail').value;
  const role = document.getElementById('newUserRole').value;

  try {
    await api('/users', {
      method: 'POST',
      body: { name, email, role },
    });
    closeModal('createUserModal');
    showToast('User created successfully', 'success');
    loadUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function showEditUserModal(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserRole').value = user.role;
  document.getElementById('editUserStatus').value = user.status;
  openModal('editUserModal');
}

async function handleEditUser(e) {
  e.preventDefault();
  const id = document.getElementById('editUserId').value;
  const name = document.getElementById('editUserName').value;
  const email = document.getElementById('editUserEmail').value;
  const role = document.getElementById('editUserRole').value;
  const status = document.getElementById('editUserStatus').value;

  try {
    await api(`/users/${id}`, {
      method: 'PATCH',
      body: { name, email, role, status },
    });
    closeModal('editUserModal');
    showToast('User updated successfully', 'success');
    loadUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deactivateUser(userId) {
  if (!confirm('Are you sure you want to deactivate this user?')) return;

  try {
    await api(`/users/${userId}`, { method: 'DELETE' });
    showToast('User deactivated', 'success');
    loadUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ============================================
// Teams
// ============================================

async function loadAllTeams() {
  const teams = await api('/teams');
  allTeams = teams;
  return teams;
}

async function loadTeams() {
  try {
    const teams = await loadAllTeams();
    renderTeams(teams);
  } catch (err) {
    console.error('Failed to load teams:', err);
    showToast('Failed to load teams', 'error');
  }
}

async function renderTeams(teams) {
  const container = document.getElementById('teamsContainer');

  if (teams.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🏢</div>
        <p>No teams yet. Create your first team!</p>
      </div>
    `;
    return;
  }

  // Load members for each team
  const teamCards = await Promise.all(teams.map(async (team) => {
    let members = [];
    try {
      members = await api(`/teams/${team.id}/members`);
    } catch {
      // ignore
    }

    const membersHtml = members.length > 0
      ? members.map(member => member ? `
          <div class="team-member">
            <div class="team-member-avatar">${getInitials(member.name)}</div>
            <div class="team-member-info">
              <div class="team-member-name">${escapeHtml(member.name)}</div>
              <div class="team-member-role">${formatRole(member.role)}</div>
            </div>
            <button class="btn btn-sm btn-danger btn-icon" onclick="removeMember('${team.id}', '${member.id}')" title="Remove">✕</button>
          </div>
        ` : '').join('')
      : '<div class="team-empty">No members yet</div>';

    return `
      <div class="team-card">
        <div class="team-card-header">
          <h3>${escapeHtml(team.name)}</h3>
          <span class="team-member-count">${team.members.length} member${team.members.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="team-members-list">
          ${membersHtml}
        </div>
        <div class="team-card-actions">
          <button class="btn btn-sm btn-primary" onclick="showAddMemberModal('${team.id}')">+ Add Member</button>
        </div>
      </div>
    `;
  }));

  container.innerHTML = teamCards.join('');
}

function showCreateTeamModal() {
  document.getElementById('newTeamName').value = '';
  openModal('createTeamModal');
}

async function handleCreateTeam(e) {
  e.preventDefault();
  const name = document.getElementById('newTeamName').value;

  try {
    await api('/teams', {
      method: 'POST',
      body: { name },
    });
    closeModal('createTeamModal');
    showToast('Team created successfully', 'success');
    loadTeams();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function showAddMemberModal(teamId) {
  document.getElementById('addMemberTeamId').value = teamId;

  // Load users for the dropdown
  try {
    if (allUsers.length === 0) {
      allUsers = await api('/users');
    }

    const team = allTeams.find(t => t.id === teamId);
    const availableUsers = allUsers.filter(u =>
      u.status === 'active' && (!team || !team.members.includes(u.id))
    );

    const select = document.getElementById('addMemberUserId');
    select.innerHTML = '<option value="">Choose a user...</option>' +
      availableUsers.map(u => `<option value="${u.id}">${escapeHtml(u.name)} (${escapeHtml(u.email)})</option>`).join('');

    openModal('addMemberModal');
  } catch (err) {
    showToast('Failed to load users', 'error');
  }
}

async function handleAddMember(e) {
  e.preventDefault();
  const teamId = document.getElementById('addMemberTeamId').value;
  const userId = document.getElementById('addMemberUserId').value;

  if (!userId) {
    showToast('Please select a user', 'error');
    return;
  }

  try {
    await api(`/teams/${teamId}/members`, {
      method: 'POST',
      body: { userId },
    });
    closeModal('addMemberModal');
    showToast('Member added successfully', 'success');
    loadTeams();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function removeMember(teamId, userId) {
  if (!confirm('Remove this member from the team?')) return;

  try {
    await api(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' });
    showToast('Member removed', 'success');
    loadTeams();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ============================================
// Auth
// ============================================

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const resultEl = document.getElementById('loginResult');

  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { email },
    });
    currentUser = data.user;
    resultEl.className = 'result-box success';
    resultEl.textContent = JSON.stringify(data, null, 2);
    resultEl.classList.remove('hidden');
    updateSessionUI();
    showToast(`Welcome back, ${data.user.name}!`, 'success');
  } catch (err) {
    resultEl.className = 'result-box error';
    resultEl.textContent = err.message;
    resultEl.classList.remove('hidden');
    showToast(err.message, 'error');
  }
}

async function handleLogout() {
  const resultEl = document.getElementById('logoutResult');

  try {
    const data = await api('/auth/logout', { method: 'POST' });
    currentUser = null;
    resultEl.className = 'result-box success';
    resultEl.textContent = JSON.stringify(data, null, 2);
    resultEl.classList.remove('hidden');
    updateSessionUI();
    showToast('Logged out successfully', 'info');

    // Clear login result
    const loginResult = document.getElementById('loginResult');
    loginResult.classList.add('hidden');
  } catch (err) {
    resultEl.className = 'result-box error';
    resultEl.textContent = err.message;
    resultEl.classList.remove('hidden');
    showToast(err.message, 'error');
  }
}

function updateSessionUI() {
  const sessionEl = document.getElementById('sessionInfo');
  const logoutBtn = document.getElementById('logoutBtn');

  if (currentUser) {
    sessionEl.innerHTML = `
      <div class="session-user">
        <div class="session-avatar">${getInitials(currentUser.name)}</div>
        <div class="session-details">
          <div class="session-name">${escapeHtml(currentUser.name)}</div>
          <div class="session-email">${escapeHtml(currentUser.email)}</div>
        </div>
        <span class="badge badge-${currentUser.status}">${capitalize(currentUser.status)}</span>
      </div>
    `;
    logoutBtn.disabled = false;
  } else {
    sessionEl.innerHTML = '<p class="text-muted">No active session</p>';
    logoutBtn.disabled = true;
  }
}

// ============================================
// Modal Helpers
// ============================================

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }
});

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// Utility Functions
// ============================================

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatRole(role) {
  if (!role) return '';
  return role.split('_').map(capitalize).join(' ');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// Initialize
// ============================================

async function init() {
  // Check health
  checkHealth();

  // Load initial page based on hash
  const page = window.location.hash.slice(1) || 'dashboard';
  navigateTo(page);

  // Periodically check health
  setInterval(checkHealth, 30000);
}

// Start the app
init();
