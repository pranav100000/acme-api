const users = [
  { id: '1', email: 'alice@acme.com', name: 'Alice Chen', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-01-15T08:00:00Z' },
  { id: '2', email: 'bob@acme.com', name: 'Bob Smith', role: 'developer', status: 'active', createdAt: '2024-01-16T09:30:00Z', updatedAt: '2024-02-01T14:00:00Z' },
  { id: '3', email: 'carol@acme.com', name: 'Carol Jones', role: 'developer', status: 'active', createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-01-20T11:00:00Z' },
  { id: '4', email: 'david@acme.com', name: 'David Park', role: 'designer', status: 'active', createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '5', email: 'eve@acme.com', name: 'Eve Martinez', role: 'developer', status: 'active', createdAt: '2024-02-05T13:00:00Z', updatedAt: '2024-03-10T09:00:00Z' },
  { id: '6', email: 'frank@acme.com', name: 'Frank Wilson', role: 'product_manager', status: 'active', createdAt: '2024-02-10T08:30:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '7', email: 'grace@acme.com', name: 'Grace Lee', role: 'developer', status: 'inactive', createdAt: '2024-01-10T07:00:00Z', updatedAt: '2024-03-15T16:00:00Z' },
  { id: '8', email: 'henry@acme.com', name: 'Henry Taylor', role: 'developer', status: 'pending', createdAt: '2024-03-20T12:00:00Z', updatedAt: '2024-03-20T12:00:00Z' },
]

const teams = [
  { id: '1', name: 'Engineering', members: ['1', '2', '3', '5'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-05T13:00:00Z' },
  { id: '2', name: 'Product', members: ['6'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2024-02-10T08:30:00Z' },
  { id: '3', name: 'Design', members: ['4'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: '4', name: 'Infrastructure', members: ['1', '2'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T14:00:00Z' },
]

const initialUsers = users.map((user) => ({ ...user }))
const initialTeams = teams.map((team) => ({ ...team, members: [...team.members] }))
const userFields = ['email', 'name', 'role', 'status']

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))
const nextId = (records) => String(Math.max(...records.map((record) => Number(record.id))) + 1)
const timestamp = () => new Date().toISOString()
const findById = (records, id) => records.find((record) => record.id === id) || null
const findByEmail = (records, email) => records.find((record) => record.email === email) || null

function updateAllowedFields(record, updates, allowedFields) {
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      record[field] = updates[field]
    }
  }

  record.updatedAt = timestamp()
  return record
}

const db = {
  async findUser(id) {
    await wait()
    return findById(users, id)
  },

  async findUserByEmail(email) {
    await wait()
    return findByEmail(users, email)
  },

  async getAllUsers() {
    await wait()
    return users
  },

  async createUser({ email, name, role }) {
    await wait()
    const now = timestamp()
    const user = {
      id: nextId(users),
      email,
      name,
      role: role || 'developer',
      status: 'active',
      createdAt: now,
      updatedAt: now,
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

    return updateAllowedFields(user, updates, userFields)
  },

  async deleteUser(id) {
    await wait()
    const user = findById(users, id)
    if (!user) {
      return null
    }

    return updateAllowedFields(user, { status: 'inactive' }, userFields)
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

    return team.members.map((memberId) => findById(users, memberId)).filter(Boolean)
  },

  async createTeam({ name }) {
    await wait()
    const now = timestamp()
    const team = {
      id: nextId(teams),
      name,
      members: [],
      createdAt: now,
      updatedAt: now,
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
      team.updatedAt = timestamp()
    }

    return team
  },

  async removeTeamMember(teamId, userId) {
    await wait()
    const team = findById(teams, teamId)
    if (!team) {
      return null
    }

    team.members = team.members.filter((id) => id !== userId)
    team.updatedAt = timestamp()
    return team
  },

  _reset() {
    users.length = 0
    users.push(...initialUsers.map((user) => ({ ...user })))
    teams.length = 0
    teams.push(...initialTeams.map((team) => ({ ...team, members: [...team.members] })))
  },
}

module.exports = db
