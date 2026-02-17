/**
 * In-memory database module.
 *
 * Provides async CRUD operations for users and teams, backed by simple
 * arrays. Every operation includes a small artificial delay to simulate
 * real database latency.
 */

/** @type {Array<{id: string, email: string, name: string, role: string, status: string, createdAt: string, updatedAt: string}>} */
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

/** @type {Array<{id: string, name: string, members: string[], createdAt: string, updatedAt: string}>} */
const teams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
];

// Deep-copy seed data so we can restore it later via _reset()
const initialUsers = users.map(u => ({ ...u }));
const initialTeams = teams.map(t => ({ ...t, members: [...t.members] }));

const db = {
  /**
   * Find a single user by their unique ID.
   * @param {string} id - The user's ID.
   * @returns {Promise<Object|null>} The user object, or null if not found.
   */
  async findUser(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.id === id) || null;
  },

  /**
   * Find a single user by their email address.
   * @param {string} email - The email to look up.
   * @returns {Promise<Object|null>} The user object, or null if not found.
   */
  async findUserByEmail(email) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.email === email) || null;
  },

  /**
   * Retrieve every user in the database.
   * @returns {Promise<Object[]>} Array of all user objects.
   */
  async getAllUsers() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users;
  },

  /**
   * Create a new user and add them to the database.
   * The new user is automatically assigned an auto-incremented ID,
   * an 'active' status, and the current timestamp for createdAt/updatedAt.
   * @param {Object} params
   * @param {string} params.email - The user's email address.
   * @param {string} params.name  - The user's display name.
   * @param {string} [params.role='developer'] - The user's role.
   * @returns {Promise<Object>} The newly created user object.
   */
  async createUser({ email, name, role }) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const id = String(Math.max(...users.map(u => parseInt(u.id))) + 1);
    const now = new Date().toISOString();
    const user = { id, email, name, role: role || 'developer', status: 'active', createdAt: now, updatedAt: now };
    users.push(user);
    return user;
  },

  /**
   * Update an existing user's allowed fields (email, name, role, status).
   * Fields not present in `updates` are left unchanged.
   * @param {string} id - The ID of the user to update.
   * @param {Object} updates - An object containing the fields to update.
   * @returns {Promise<Object|null>} The updated user, or null if the user was not found.
   */
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

  /**
   * Soft-delete a user by setting their status to 'inactive'.
   * The user record is kept in the database rather than being removed.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<Object|null>} The soft-deleted user, or null if not found.
   */
  async deleteUser(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const user = users.find(u => u.id === id);
    if (!user) return null;
    user.status = 'inactive';
    user.updatedAt = new Date().toISOString();
    return user;
  },

  /**
   * Find a single team by its unique ID.
   * @param {string} id - The team's ID.
   * @returns {Promise<Object|null>} The team object, or null if not found.
   */
  async findTeam(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams.find(t => t.id === id) || null;
  },

  /**
   * Retrieve every team in the database.
   * @returns {Promise<Object[]>} Array of all team objects.
   */
  async getAllTeams() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams;
  },

  /**
   * Get the full user objects for every member of a given team.
   * @param {string} teamId - The ID of the team.
   * @returns {Promise<Object[]|null>} Array of user objects, or null if the team doesn't exist.
   */
  async getTeamMembers(teamId) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return team.members.map(memberId => users.find(u => u.id === memberId));
  },

  /**
   * Create a new team with the given name and an empty member list.
   * @param {Object} params
   * @param {string} params.name - The team's display name.
   * @returns {Promise<Object>} The newly created team object.
   */
  async createTeam({ name }) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const id = String(Math.max(...teams.map(t => parseInt(t.id))) + 1);
    const now = new Date().toISOString();
    const team = { id, name, members: [], createdAt: now, updatedAt: now };
    teams.push(team);
    return team;
  },

  /**
   * Add a user to a team. If the user is already a member, the operation
   * is a no-op (no duplicate entries are created).
   * @param {string} teamId - The ID of the team.
   * @param {string} userId - The ID of the user to add.
   * @returns {Promise<Object|null>} The updated team, or null if team/user not found.
   */
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

  /**
   * Remove a user from a team's member list.
   * @param {string} teamId - The ID of the team.
   * @param {string} userId - The ID of the user to remove.
   * @returns {Promise<Object|null>} The updated team, or null if the team was not found.
   */
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
