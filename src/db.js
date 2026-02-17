/**
 * In-memory database module.
 *
 * Provides an async CRUD interface for users and teams, backed by simple
 * arrays. Every operation includes an artificial 10 ms delay to simulate
 * real database latency. Intended for development and testing only.
 */

// Seed data – pre-populated user records
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

// Seed data – pre-populated team records (members are stored as user-id arrays)
const teams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
];

// Deep-copy the seed data so we can restore it later via _reset()
const initialUsers = users.map(u => ({ ...u }));
const initialTeams = teams.map(t => ({ ...t, members: [...t.members] }));

const db = {
  /**
   * Look up a single user by their unique ID.
   * @param {string} id - The user's ID.
   * @returns {Promise<Object|null>} The user object, or null if not found.
   */
  async findUser(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.id === id) || null;
  },

  /**
   * Look up a single user by their email address.
   * @param {string} email - The email to search for.
   * @returns {Promise<Object|null>} The user object, or null if not found.
   */
  async findUserByEmail(email) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.email === email) || null;
  },

  /**
   * Return every user in the database.
   * @returns {Promise<Object[]>} Array of all user objects.
   */
  async getAllUsers() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users;
  },

  /**
   * Create a new user and add them to the database.
   * The new user is automatically assigned an auto-incremented ID,
   * an 'active' status, and the current timestamp.
   * @param {Object} data - New user data.
   * @param {string} data.email - The user's email address.
   * @param {string} data.name - The user's display name.
   * @param {string} [data.role='developer'] - The user's role.
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
   * Update allowed fields on an existing user.
   * Only 'email', 'name', 'role', and 'status' may be changed;
   * all other keys in `updates` are silently ignored.
   * @param {string} id - The ID of the user to update.
   * @param {Object} updates - Key/value pairs to apply.
   * @returns {Promise<Object|null>} The updated user, or null if not found.
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
   * @returns {Promise<Object|null>} The deactivated user, or null if not found.
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
   * Look up a single team by its unique ID.
   * @param {string} id - The team's ID.
   * @returns {Promise<Object|null>} The team object, or null if not found.
   */
  async findTeam(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams.find(t => t.id === id) || null;
  },

  /**
   * Return every team in the database.
   * @returns {Promise<Object[]>} Array of all team objects.
   */
  async getAllTeams() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams;
  },

  /**
   * Retrieve the full user objects for every member of a team.
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
   * Create a new empty team.
   * @param {Object} data - New team data.
   * @param {string} data.name - The team's display name.
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
   * Add a user to a team. If the user is already a member, this is a no-op.
   * @param {string} teamId - The team to add the member to.
   * @param {string} userId - The user to add.
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
   * @param {string} teamId - The team to remove the member from.
   * @param {string} userId - The user to remove.
   * @returns {Promise<Object|null>} The updated team, or null if the team doesn't exist.
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
