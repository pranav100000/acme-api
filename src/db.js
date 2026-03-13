const INITIAL_USERS = [
  { id: '1', email: 'alice@acme.com', name: 'Alice Chen', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z' },
  { id: '2', email: 'bob@acme.com', name: 'Bob Smith', role: 'developer', status: 'active', createdAt: '2024-01-16T09:30:00Z', updatedAt: '2024-02-01T14:00:00Z' },
  { id: '3', email: 'carol@acme.com', name: 'Carol Jones', role: 'developer', status: 'active', createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-01-20T11:00:00Z' },
  { id: '4', email: 'david@acme.com', name: 'David Park', role: 'designer', status: 'active', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '5', email: 'eve@acme.com', name: 'Eve Martinez', role: 'developer', status: 'active', createdAt: '2024-02-05T13:00:00Z', updatedAt: '2024-03-10T09:00:00Z' },
  { id: '6', email: 'frank@acme.com', name: 'Frank Wilson', role: 'product_manager', status: 'active', createdAt: '2024-02-10T08:30:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '7', email: 'grace@acme.com', name: 'Grace Lee', role: 'developer', status: 'inactive', createdAt: '2024-01-10T07:00:00Z', updatedAt: '2024-03-15T16:00:00Z' },
  { id: '8', email: 'henry@acme.com', name: 'Henry Taylor', role: 'developer', status: 'pending', createdAt: '2024-03-20T12:00:00Z', updatedAt: '2024-03-20T12:00:00Z' },
];

const INITIAL_TEAMS = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
];

const users = cloneUsers(INITIAL_USERS);
const teams = cloneTeams(INITIAL_TEAMS);

function delay(ms = 10) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timestamp() {
  return new Date().toISOString();
}

function nextId(collection) {
  return String(Math.max(0, ...collection.map((item) => Number.parseInt(item.id, 10))) + 1);
}

function cloneUsers(records) {
  return records.map((user) => ({ ...user }));
}

function cloneTeams(records) {
  return records.map((team) => ({ ...team, members: [...team.members] }));
}

function replaceContents(target, source) {
  target.length = 0;
  target.push(...source);
}

async function withDelay(work) {
  await delay();
  return work();
}

const db = {
  findUser(id) {
    return withDelay(() => users.find((user) => user.id === id) || null);
  },

  findUserByEmail(email) {
    return withDelay(() => users.find((user) => user.email === email) || null);
  },

  getAllUsers() {
    return withDelay(() => users);
  },

  createUser({ email, name, role }) {
    return withDelay(() => {
      const now = timestamp();
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
    });
  },

  updateUser(id, updates) {
    return withDelay(() => {
      const user = users.find((entry) => entry.id === id);
      if (!user) {
        return null;
      }

      for (const key of ['email', 'name', 'role', 'status']) {
        if (updates[key] !== undefined) {
          user[key] = updates[key];
        }
      }

      user.updatedAt = timestamp();
      return user;
    });
  },

  deleteUser(id) {
    return withDelay(() => {
      const user = users.find((entry) => entry.id === id);
      if (!user) {
        return null;
      }

      user.status = 'inactive';
      user.updatedAt = timestamp();
      return user;
    });
  },

  findTeam(id) {
    return withDelay(() => teams.find((team) => team.id === id) || null);
  },

  getAllTeams() {
    return withDelay(() => teams);
  },

  getTeamMembers(teamId) {
    return withDelay(() => {
      const team = teams.find((entry) => entry.id === teamId);
      if (!team) {
        return null;
      }

      return team.members.map((memberId) => users.find((user) => user.id === memberId));
    });
  },

  createTeam({ name }) {
    return withDelay(() => {
      const now = timestamp();
      const team = {
        id: nextId(teams),
        name,
        members: [],
        createdAt: now,
        updatedAt: now,
      };

      teams.push(team);
      return team;
    });
  },

  addTeamMember(teamId, userId) {
    return withDelay(() => {
      const team = teams.find((entry) => entry.id === teamId);
      const user = users.find((entry) => entry.id === userId);

      if (!team || !user) {
        return null;
      }

      if (!team.members.includes(userId)) {
        team.members.push(userId);
        team.updatedAt = timestamp();
      }

      return team;
    });
  },

  removeTeamMember(teamId, userId) {
    return withDelay(() => {
      const team = teams.find((entry) => entry.id === teamId);
      if (!team) {
        return null;
      }

      team.members = team.members.filter((memberId) => memberId !== userId);
      team.updatedAt = timestamp();
      return team;
    });
  },

  _reset() {
    replaceContents(users, cloneUsers(INITIAL_USERS));
    replaceContents(teams, cloneTeams(INITIAL_TEAMS));
  },
};

module.exports = db;
