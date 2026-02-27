/**
 * @module db
 * @description In-memory database layer for users and teams.
 * All operations are async to simulate real database latency.
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {string} role - User's role (e.g. 'admin', 'developer', 'designer', 'product_manager')
 * @property {string} status - Account status: 'active', 'inactive', or 'pending'
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last-update timestamp
 */

/**
 * @typedef {Object} Team
 * @property {string} id - Unique team identifier
 * @property {string} name - Team name
 * @property {string[]} members - Array of user IDs belonging to this team
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last-update timestamp
 */

/** @type {User[]} */
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

/** @type {Team[]} */
const teams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
];

/** @type {User[]} Snapshot of initial user data for reset */
const initialUsers = users.map(u => ({ ...u }));
/** @type {Team[]} Snapshot of initial team data for reset */
const initialTeams = teams.map(t => ({ ...t, members: [...t.members] }));

const db = {
  /**
   * Find a user by their ID.
   * @param {string} id - The user's unique identifier
   * @returns {Promise<User|null>} The user object, or null if not found
   */
  async findUser(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.id === id) || null;
  },

  /**
   * Find a user by their email address.
   * @param {string} email - The email address to search for
   * @returns {Promise<User|null>} The user object, or null if not found
   */
  async findUserByEmail(email) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users.find(u => u.email === email) || null;
  },

  /**
   * Retrieve all users from the database.
   * @returns {Promise<User[]>} Array of all user objects
   */
  async getAllUsers() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return users;
  },

  /**
   * Create a new user with the given details.
   * @param {Object} params - User creation parameters
   * @param {string} params.email - The new user's email address
   * @param {string} params.name - The new user's full name
   * @param {string} [params.role='developer'] - The new user's role
   * @returns {Promise<User>} The newly created user object
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
   * Update an existing user's details.
   * Only 'email', 'name', 'role', and 'status' fields can be updated.
   * @param {string} id - The user's unique identifier
   * @param {Partial<Pick<User, 'email'|'name'|'role'|'status'>>} updates - Fields to update
   * @returns {Promise<User|null>} The updated user object, or null if not found
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
   * @param {string} id - The user's unique identifier
   * @returns {Promise<User|null>} The deactivated user object, or null if not found
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
   * Find a team by its ID.
   * @param {string} id - The team's unique identifier
   * @returns {Promise<Team|null>} The team object, or null if not found
   */
  async findTeam(id) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams.find(t => t.id === id) || null;
  },

  /**
   * Retrieve all teams from the database.
   * @returns {Promise<Team[]>} Array of all team objects
   */
  async getAllTeams() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return teams;
  },

  /**
   * Get all members of a specific team, resolved as full user objects.
   * @param {string} teamId - The team's unique identifier
   * @returns {Promise<User[]|null>} Array of user objects for team members, or null if team not found
   */
  async getTeamMembers(teamId) {
    await new Promise(resolve => setTimeout(resolve, 10));
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return team.members.map(memberId => users.find(u => u.id === memberId));
  },

  /**
   * Create a new team with the given name.
   * @param {Object} params - Team creation parameters
   * @param {string} params.name - The new team's name
   * @returns {Promise<Team>} The newly created team object (with empty members)
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
   * Add a user to a team. Does nothing if the user is already a member.
   * @param {string} teamId - The team's unique identifier
   * @param {string} userId - The user's unique identifier
   * @returns {Promise<Team|null>} The updated team object, or null if team or user not found
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
   * Remove a user from a team.
   * @param {string} teamId - The team's unique identifier
   * @param {string} userId - The user's unique identifier to remove
   * @returns {Promise<Team|null>} The updated team object, or null if team not found
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
