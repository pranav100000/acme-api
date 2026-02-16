/**
 * In-memory database module.
 * Simulates async database operations with small delays to mimic real DB latency.
 * Data is stored in arrays and reset on server restart (or via _reset() in tests).
 */

// Seed data — pre-populated users for development
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

// Seed data — pre-populated teams with member references (user IDs)
const teams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
];

// Deep-copy snapshots of the seed data so we can restore them in _reset()
const initialUsers = users.map(u => ({ ...u }));
const initialTeams = teams.map(t => ({ ...t, members: [...t.members] }));

const db = {
  /** Look up a single user by ID. Returns null if not found. */
  async findUser(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.id === id) || null;
  },

  /** Look up a single user by email address. Returns null if not found. */
  async findUserByEmail(email) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.email === email) || null;
  },

  /** Return every user in the database (no pagination). */
  async getAllUsers() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users;
  },

  /** Create a new user with an auto-incremented ID. Defaults role to 'developer'. */
  async createUser({ email, name, role }) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const id = String(Math.max(...users.map(u => parseInt(u.id))) + 1);
    const now = new Date().toISOString();
    const user = { id, email, name, role: role || 'developer', status: 'active', createdAt: now, updatedAt: now };
    users.push(user);
    return user;
  },

  /** Partially update a user. Only whitelisted fields (email, name, role, status) are applied. */
  async updateUser(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const allowed = ['email', 'name', 'role', 'status'];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    }
    user.updatedAt = new Date().toISOString();
    return user;
  },

  /** Soft-delete a user by setting their status to 'inactive'. */
  async deleteUser(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const user = users.find(u => u.id === id);
    if (!user) return null;
    user.status = 'inactive';
    user.updatedAt = new Date().toISOString();
    return user;
  },

  /** Look up a single team by ID. Returns null if not found. */
  async findTeam(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams.find(t => t.id === id) || null;
  },

  /** Return every team in the database. */
  async getAllTeams() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams;
  },

  /** Resolve a team's member IDs into full user objects. Returns null if team not found. */
  async getTeamMembers(teamId) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return team.members.map(memberId => users.find(u => u.id === memberId));
  },

  /** Create a new empty team with an auto-incremented ID. */
  async createTeam({ name }) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const id = String(Math.max(...teams.map(t => parseInt(t.id))) + 1);
    const now = new Date().toISOString();
    const team = { id, name, members: [], createdAt: now, updatedAt: now };
    teams.push(team);
    return team;
  },

  /** Add a user to a team (idempotent — won't duplicate existing members). */
  async addTeamMember(teamId, userId) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const team = teams.find(t => t.id === teamId);
    const user = users.find(u => u.id === userId);
    if (!team || !user) return null;
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      team.updatedAt = new Date().toISOString();
    }
    return team;
  },

  /** Remove a user from a team's member list. */
  async removeTeamMember(teamId, userId) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    team.members = team.members.filter(id => id !== userId);
    team.updatedAt = new Date().toISOString();
    return team;
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
