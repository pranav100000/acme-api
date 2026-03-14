const LATENCY_MS = 10

const seedUsers = [
  { id: '1', email: 'alice@acme.com', name: 'Alice Chen', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z' },
  { id: '2', email: 'bob@acme.com', name: 'Bob Smith', role: 'developer', status: 'active', createdAt: '2024-01-16T09:30:00Z', updatedAt: '2024-02-01T14:00:00Z' },
  { id: '3', email: 'carol@acme.com', name: 'Carol Jones', role: 'developer', status: 'active', createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-01-20T11:00:00Z' },
  { id: '4', email: 'david@acme.com', name: 'David Park', role: 'designer', status: 'active', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '5', email: 'eve@acme.com', name: 'Eve Martinez', role: 'developer', status: 'active', createdAt: '2024-02-05T13:00:00Z', updatedAt: '2024-03-10T09:00:00Z' },
  { id: '6', email: 'frank@acme.com', name: 'Frank Wilson', role: 'product_manager', status: 'active', createdAt: '2024-02-10T08:30:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '7', email: 'grace@acme.com', name: 'Grace Lee', role: 'developer', status: 'inactive', createdAt: '2024-01-10T07:00:00Z', updatedAt: '2024-03-15T16:00:00Z' },
  { id: '8', email: 'henry@acme.com', name: 'Henry Taylor', role: 'developer', status: 'pending', createdAt: '2024-03-20T12:00:00Z', updatedAt: '2024-03-20T12:00:00Z' }
]

const seedTeams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' }
]

const users = cloneRecords(seedUsers)
const teams = cloneRecords(seedTeams)

function cloneRecords(records) {
  return records.map(record => ({
    ...record,
    ...(Array.isArray(record.members) ? { members: [...record.members] } : {})
  }))
}

function wait() {
  return new Promise(resolve => setTimeout(resolve, LATENCY_MS))
}

function nowIso() {
  return new Date().toISOString()
}

function nextId(records) {
  return String(Math.max(0, ...records.map(record => Number.parseInt(record.id, 10))) + 1)
}

function touch(record) {
  record.updatedAt = nowIso()
  return record
}

function findById(records, id) {
  return records.find(record => record.id === id) || null
}

function resetRecords(target, source) {
  target.length = 0
  target.push(...cloneRecords(source))
}

const db = {
  async findUser(id) {
    await wait()
    return findById(users, id)
  },

  async findUserByEmail(email) {
    await wait()
    return users.find(user => user.email === email) || null
  },

  async getAllUsers() {
    await wait()
    return users
  },

  async createUser({ email, name, role }) {
    await wait()
    const timestamp = nowIso()
    const user = {
      id: nextId(users),
      email,
      name,
      role: role || 'developer',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp
    }

    users.push(user)
    return user
  },

  async updateUser(id, updates) {
    await wait()
    const user = findById(users, id)

    if (!user) {
      return null
    }

    for (const key of ['email', 'name', 'role', 'status']) {
      if (updates[key] !== undefined) {
        user[key] = updates[key]
      }
    }

    return touch(user)
  },

  async deleteUser(id) {
    await wait()
    const user = findById(users, id)

    if (!user) {
      return null
    }

    user.status = 'inactive'
    return touch(user)
  },

  async findTeam(id) {
    await wait()
    return findById(teams, id)
  },

  async getAllTeams() {
    await wait()
    return teams
  },

  async getTeamMembers(teamId) {
    await wait()
    const team = findById(teams, teamId)

    if (!team) {
      return null
    }

    return team.members.map(memberId => findById(users, memberId))
  },

  async createTeam({ name }) {
    await wait()
    const timestamp = nowIso()
    const team = {
      id: nextId(teams),
      name,
      members: [],
      createdAt: timestamp,
      updatedAt: timestamp
    }

    teams.push(team)
    return team
  },

  async addTeamMember(teamId, userId) {
    await wait()
    const team = findById(teams, teamId)
    const user = findById(users, userId)

    if (!team || !user) {
      return null
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId)
      touch(team)
    }

    return team
  },

  async removeTeamMember(teamId, userId) {
    await wait()
    const team = findById(teams, teamId)

    if (!team) {
      return null
    }

    team.members = team.members.filter(id => id !== userId)
    return touch(team)
  },

  _reset() {
    resetRecords(users, seedUsers)
    resetRecords(teams, seedTeams)
  }
}

module.exports = db
