/** Simulated async delay to mimic real database latency */
const delay = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));

/** Allowed fields for user updates */
const UPDATABLE_USER_FIELDS = ['email', 'name', 'role', 'status'];

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

/** Generates the next sequential ID for a collection */
function nextId(collection) {
  return String(Math.max(...collection.map(item => parseInt(item.id))) + 1);
}

const db = {
  /**
   * Find a user by their ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} The user object, or null if not found
   */
  async findUser(id) {
    await delay();
    return users.find(u => u.id === id) || null;
  },

  /**
   * Find a user by their email address
   * @param {string} email - User email
   * @returns {Promise<Object|null>} The user object, or null if not found
   */
  async findUserByEmail(email) {
    await delay();
    return users.find(u => u.email === email) || null;
  },

  /**
   * Retrieve all users
   * @returns {Promise<Object[]>} Array of all user objects
   */
  async getAllUsers() {
    await delay();
    return users;
  },

  /**
   * Create a new user
   * @param {Object} params - User data
   * @param {string} params.email - User email
   * @param {string} params.name - User display name
   * @param {string} [params.role='developer'] - User role
   * @returns {Promise<Object>} The newly created user
   */
  async createUser({ email, name, role }) {
    await delay();
    const now = new Date().toISOString();
    const user = {
      id: nextId(users),
      email,
      name,
      role: role || 'developer',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
    return user;
  },

  /**
   * Update an existing user's fields
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update (email, name, role, status)
   * @returns {Promise<Object|null>} The updated user, or null if not found
   */
  async updateUser(id, updates) {
    await delay();
    const user = users.find(u => u.id === id);
    if (!user) return null;
    for (const key of UPDATABLE_USER_FIELDS) {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    }
    user.updatedAt = new Date().toISOString();
    return user;
  },

  /**
   * Soft-delete a user by setting their status to inactive
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} The deactivated user, or null if not found
   */
  async deleteUser(id) {
    await delay();
    const user = users.find(u => u.id === id);
    if (!user) return null;
    user.status = 'inactive';
    user.updatedAt = new Date().toISOString();
    return user;
  },

  /**
   * Find a team by its ID
   * @param {string} id - Team ID
   * @returns {Promise<Object|null>} The team object, or null if not found
   */
  async findTeam(id) {
    await delay();
    return teams.find(t => t.id === id) || null;
  },

  /**
   * Retrieve all teams
   * @returns {Promise<Object[]>} Array of all team objects
   */
  async getAllTeams() {
    await delay();
    return teams;
  },

  /**
   * Get the member users for a given team
   * @param {string} teamId - Team ID
   * @returns {Promise<Object[]|null>} Array of user objects, or null if team not found
   */
  async getTeamMembers(teamId) {
    await delay();
    const team = teams.find(t => t.id === teamId);
    if (!team) return null;
    return team.members.map(memberId => users.find(u => u.id === memberId));
  },

  /**
   * Create a new team
   * @param {Object} params - Team data
   * @param {string} params.name - Team name
   * @returns {Promise<Object>} The newly created team
   */
  async createTeam({ name }) {
    await delay();
    const now = new Date().toISOString();
    const team = {
      id: nextId(teams),
      name,
      members: [],
      createdAt: now,
      updatedAt: now,
    };
    teams.push(team);
    return team;
  },

  /**
   * Add a user to a team
   * @param {string} teamId - Team ID
   * @param {string} userId - User ID to add
   * @returns {Promise<Object|null>} The updated team, or null if team/user not found
   */
  async addTeamMember(teamId, userId) {
    await delay();
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
   * Remove a user from a team
   * @param {string} teamId - Team ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object|null>} The updated team, or null if team not found
   */
  async removeTeamMember(teamId, userId) {
    await delay();
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
