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

const sleep = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));
const nextId = (collection) => String(Math.max(...collection.map(item => Number.parseInt(item.id, 10)), 0) + 1);
const now = () => new Date().toISOString();
const touch = (entity) => {
  entity.updatedAt = now();
  return entity;
};
const cloneUsers = () => initialUsers.map(user => ({ ...user }));
const cloneTeams = () => initialTeams.map(team => ({ ...team, members: [...team.members] }));

const db = {
  async findUser(id) {
    await sleep();
    return users.find(u => u.id === id) || null;
  },

  async findUserByEmail(email) {
    await sleep();
    return users.find(u => u.email === email) || null;
  },

  async getAllUsers() {
    await sleep();
    return users;
  },

  async createUser({ email, name, role }) {
    await sleep();
    const timestamp = now();
    const user = {
      id: nextId(users),
      email,
      name,
      role: role || 'developer',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    users.push(user);
    return user;
  },

  async updateUser(id, updates) {
    await sleep();
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const allowed = ['email', 'name', 'role', 'status'];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    }
    return touch(user);
  },

  async deleteUser(id) {
    await sleep();
    const user = users.find(u => u.id === id);
    if (!user) return null;
    user.status = 'inactive';
    return touch(user);
  },

  async findTeam(id) {
    await sleep();
    return teams.find(t => t.id === id) || null;
  },

  async getAllTeams() {
    await sleep();
    return teams;
  },

  async getTeamMembers(teamId) {
    await sleep();
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return team.members.map(memberId => users.find(u => u.id === memberId));
  },

  async createTeam({ name }) {
    await sleep();
    const timestamp = now();
    const team = { id: nextId(teams), name, members: [], createdAt: timestamp, updatedAt: timestamp };
    teams.push(team);
    return team;
  },

  async addTeamMember(teamId, userId) {
    await sleep();
    const team = teams.find(t => t.id === teamId);
    const user = users.find(u => u.id === userId);
    if (!team || !user) return null;
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      touch(team);
    }
    return team;
  },

  async removeTeamMember(teamId, userId) {
    await sleep();
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    team.members = team.members.filter(id => id !== userId);
    return touch(team);
  },

  /**
   * Resets database to initial state (for testing)
   */
  _reset() {
    users.length = 0;
    users.push(...cloneUsers());
    teams.length = 0;
    teams.push(...cloneTeams());
  }
};

module.exports = db;
