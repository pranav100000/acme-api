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

const initialUsers = users.map((user) => ({ ...user }));
const initialTeams = teams.map((team) => ({ ...team, members: [...team.members] }));
const USER_UPDATABLE_FIELDS = ['email', 'name', 'role', 'status'];
const SIMULATED_DELAY_MS = 10;

const wait = () => new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
const now = () => new Date().toISOString();
const findById = (collection, id) => collection.find((record) => record.id === id) || null;
const getNextId = (collection) => String(Math.max(...collection.map(({ id }) => Number.parseInt(id, 10))) + 1);
const touchRecord = (record) => {
  record.updatedAt = now();
  return record;
};

const resetCollection = (target, initialState, mapper) => {
  target.length = 0;
  target.push(...initialState.map(mapper));
};

const db = {
  async findUser(id) {
    await wait();
    return findById(users, id);
  },

  async findUserByEmail(email) {
    await wait();
    return users.find((user) => user.email === email) || null;
  },

  async getAllUsers() {
    await wait();
    return users;
  },

  async createUser({ email, name, role }) {
    await wait();
    const timestamp = now();
    const user = {
      id: getNextId(users),
      email,
      name,
      role: role || 'developer',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    users.push(user);
    return user;
  },

  async updateUser(id, updates) {
    await wait();
    const user = findById(users, id);
    if (!user) return null;

    for (const field of USER_UPDATABLE_FIELDS) {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    }

    return touchRecord(user);
  },

  async deleteUser(id) {
    await wait();
    const user = findById(users, id);
    if (!user) return null;

    user.status = 'inactive';
    return touchRecord(user);
  },

  async findTeam(id) {
    await wait();
    return findById(teams, id);
  },

  async getAllTeams() {
    await wait();
    return teams;
  },

  async getTeamMembers(teamId) {
    await wait();
    const team = findById(teams, teamId);
    if (!team) return null;

    return team.members.map((memberId) => findById(users, memberId));
  },

  async createTeam({ name }) {
    await wait();
    const timestamp = now();
    const team = {
      id: getNextId(teams),
      name,
      members: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    teams.push(team);
    return team;
  },

  async addTeamMember(teamId, userId) {
    await wait();
    const team = findById(teams, teamId);
    const user = findById(users, userId);
    if (!team || !user) return null;

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      touchRecord(team);
    }

    return team;
  },

  async removeTeamMember(teamId, userId) {
    await wait();
    const team = findById(teams, teamId);
    if (!team) return null;

    team.members = team.members.filter((id) => id !== userId);
    return touchRecord(team);
  },

  /**
   * Resets database to initial state (for testing)
   */
  _reset() {
    resetCollection(users, initialUsers, (user) => ({ ...user }));
    resetCollection(teams, initialTeams, (team) => ({ ...team, members: [...team.members] }));
  }
};

module.exports = db;
