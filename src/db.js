const users = [
  { id: '1', email: 'alice@acme.com', name: 'Alice Chen', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z' },
  { id: '2', email: 'bob@acme.com', name: 'Bob Smith', role: 'developer', status: 'active', createdAt: '2024-01-16T09:30:00Z', updatedAt: '2024-02-01T14:00:00Z' },
  { id: '3', email: 'carol@acme.com', name: 'Carol Jones', role: 'developer', status: 'active', createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-01-20T11:00:00Z' },
  { id: '4', email: 'david@acme.com', name: 'David Park', role: 'designer', status: 'active', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '5', email: 'eve@acme.com', name: 'Eve Martinez', role: 'developer', status: 'active', createdAt: '2024-02-05T13:00:00Z', updatedAt: '2024-03-10T09:00:00Z' },
  { id: '6', email: 'frank@acme.com', name: 'Frank Wilson', role: 'product_manager', status: 'active', createdAt: '2024-02-10T08:30:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '7', email: 'grace@acme.com', name: 'Grace Lee', role: 'developer', status: 'inactive', createdAt: '2024-01-10T07:00:00Z', updatedAt: '2024-03-15T16:00:00Z' },
  { id: '8', email: 'henry@acme.com', name: 'Henry Taylor', role: 'developer', status: 'pending', createdAt: '2024-03-20T12:00:00Z', updatedAt: '2024-03-20T12:00:00Z' },
];

const teams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
];

const initialUsers = users.map(u => ({ ...u }));
const initialTeams = teams.map(t => ({ ...t, members: [...t.members] }));

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));
const cloneUser = (user) => (user ? { ...user } : null);
const cloneTeam = (team) => (team ? { ...team, members: [...team.members] } : null);
const nextId = (collection) => String(Math.max(...collection.map((item) => Number.parseInt(item.id, 10))) + 1);
const updateRecord = (record, updates, allowedFields) => {
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      record[field] = updates[field];
    }
  }

  record.updatedAt = new Date().toISOString();
  return record;
};

const db = {
  async findUser(id) {
    await wait();
    return cloneUser(users.find((user) => user.id === id) || null);
  },

  async findUserByEmail(email) {
    await wait();
    return cloneUser(users.find((user) => user.email === email) || null);
  },

  async getAllUsers() {
    await wait();
    return users.map(cloneUser);
  },

  async createUser({ email, name, role }) {
    await wait();
    const id = nextId(users);
    const now = new Date().toISOString();
    const user = { id, email, name, role: role || 'developer', status: 'active', createdAt: now, updatedAt: now };
    users.push(user);
    return cloneUser(user);
  },

  async updateUser(id, updates) {
    await wait();
    const user = users.find((entry) => entry.id === id);
    if (!user) return null;
    return cloneUser(updateRecord(user, updates, ['email', 'name', 'role', 'status']));
  },

  async deleteUser(id) {
    await wait();
    const user = users.find((entry) => entry.id === id);
    if (!user) return null;
    return cloneUser(updateRecord(user, { status: 'inactive' }, ['status']));
  },

  async findTeam(id) {
    await wait();
    return cloneTeam(teams.find((team) => team.id === id) || null);
  },

  async getAllTeams() {
    await wait();
    return teams.map(cloneTeam);
  },

  async getTeamMembers(teamId) {
    await wait();
    const team = teams.find((entry) => entry.id === teamId);
    if (!team) return null;
    return team.members
      .map((memberId) => users.find((user) => user.id === memberId))
      .filter(Boolean)
      .map(cloneUser);
  },

  async createTeam({ name }) {
    await wait();
    const id = nextId(teams);
    const now = new Date().toISOString();
    const team = { id, name, members: [], createdAt: now, updatedAt: now };
    teams.push(team);
    return cloneTeam(team);
  },

  async addTeamMember(teamId, userId) {
    await wait();
    const team = teams.find((entry) => entry.id === teamId);
    const user = users.find((entry) => entry.id === userId);
    if (!team || !user) return null;
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      team.updatedAt = new Date().toISOString();
    }
    return cloneTeam(team);
  },

  async removeTeamMember(teamId, userId) {
    await wait();
    const team = teams.find((entry) => entry.id === teamId);
    if (!team) return null;
    team.members = team.members.filter(id => id !== userId);
    team.updatedAt = new Date().toISOString();
    return cloneTeam(team);
  },

  /**
   * Resets database to initial state (for testing)
   */
  _reset() {
    users.length = 0;
    users.push(...initialUsers.map(u => ({ ...u })));
    teams.length = 0;
    teams.push(...initialTeams.map(t => ({ ...t, members: [...t.members] })));
  }
};

module.exports = db;
