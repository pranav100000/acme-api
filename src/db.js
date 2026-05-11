const DELAY_MS = 10;
const USER_UPDATABLE_FIELDS = ["email", "name", "role", "status"];

const users = [
	{
		id: "1",
		email: "alice@acme.com",
		name: "Alice Chen",
		role: "admin",
		status: "active",
		createdAt: "2024-01-15T08:00:00Z",
		updatedAt: "2024-01-15T08:00:00Z",
	},
	{
		id: "2",
		email: "bob@acme.com",
		name: "Bob Smith",
		role: "developer",
		status: "active",
		createdAt: "2024-01-16T09:30:00Z",
		updatedAt: "2024-02-01T14:00:00Z",
	},
	{
		id: "3",
		email: "carol@acme.com",
		name: "Carol Jones",
		role: "developer",
		status: "active",
		createdAt: "2024-01-20T11:00:00Z",
		updatedAt: "2024-01-20T11:00:00Z",
	},
	{
		id: "4",
		email: "david@acme.com",
		name: "David Park",
		role: "designer",
		status: "active",
		createdAt: "2024-02-01T10:00:00Z",
		updatedAt: "2024-02-01T10:00:00Z",
	},
	{
		id: "5",
		email: "eve@acme.com",
		name: "Eve Martinez",
		role: "developer",
		status: "active",
		createdAt: "2024-02-05T13:00:00Z",
		updatedAt: "2024-03-10T09:00:00Z",
	},
	{
		id: "6",
		email: "frank@acme.com",
		name: "Frank Wilson",
		role: "product_manager",
		status: "active",
		createdAt: "2024-02-10T08:30:00Z",
		updatedAt: "2024-02-10T08:30:00Z",
	},
	{
		id: "7",
		email: "grace@acme.com",
		name: "Grace Lee",
		role: "developer",
		status: "inactive",
		createdAt: "2024-01-10T07:00:00Z",
		updatedAt: "2024-03-15T16:00:00Z",
	},
	{
		id: "8",
		email: "henry@acme.com",
		name: "Henry Taylor",
		role: "developer",
		status: "pending",
		createdAt: "2024-03-20T12:00:00Z",
		updatedAt: "2024-03-20T12:00:00Z",
	},
];

const teams = [
	{
		id: "1",
		name: "Engineering",
		members: ["1", "2", "3", "5"],
		createdAt: "2024-01-15T08:00:00Z",
		updatedAt: "2024-02-05T13:00:00Z",
	},
	{
		id: "2",
		name: "Product",
		members: ["6"],
		createdAt: "2024-01-15T08:00:00Z",
		updatedAt: "2024-02-10T08:30:00Z",
	},
	{
		id: "3",
		name: "Design",
		members: ["4"],
		createdAt: "2024-01-20T11:00:00Z",
		updatedAt: "2024-02-01T10:00:00Z",
	},
	{
		id: "4",
		name: "Infrastructure",
		members: ["1", "2"],
		createdAt: "2024-02-01T10:00:00Z",
		updatedAt: "2024-02-01T14:00:00Z",
	},
];

const cloneUser = (user) => ({ ...user });
const cloneTeam = (team) => ({ ...team, members: [...team.members] });
const now = () => new Date().toISOString();
const waitForLatency = () =>
	new Promise((resolve) => setTimeout(resolve, DELAY_MS));
const nextId = (records) =>
	String(
		Math.max(...records.map((record) => Number.parseInt(record.id, 10))) + 1,
	);
const applyUpdates = (target, updates, allowedFields) => {
	for (const field of allowedFields) {
		if (updates[field] !== undefined) {
			target[field] = updates[field];
		}
	}
};

const initialUsers = users.map(cloneUser);
const initialTeams = teams.map(cloneTeam);

const db = {
	async findUser(id) {
		await waitForLatency();
		return users.find((user) => user.id === id) || null;
	},

	async findUserByEmail(email) {
		await waitForLatency();
		return users.find((user) => user.email === email) || null;
	},

	async getAllUsers() {
		await waitForLatency();
		return users;
	},

	async createUser({ email, name, role }) {
		await waitForLatency();
		const timestamp = now();
		const user = {
			id: nextId(users),
			email,
			name,
			role: role || "developer",
			status: "active",
			createdAt: timestamp,
			updatedAt: timestamp,
		};
		users.push(user);
		return user;
	},

	async updateUser(id, updates) {
		await waitForLatency();
		const user = users.find((candidate) => candidate.id === id);
		if (!user) return null;
		applyUpdates(user, updates, USER_UPDATABLE_FIELDS);
		user.updatedAt = now();
		return user;
	},

	async deleteUser(id) {
		await waitForLatency();
		const user = users.find((candidate) => candidate.id === id);
		if (!user) return null;
		user.status = "inactive";
		user.updatedAt = now();
		return user;
	},

	async findTeam(id) {
		await waitForLatency();
		return teams.find((team) => team.id === id) || null;
	},

	async getAllTeams() {
		await waitForLatency();
		return teams;
	},

	async getTeamMembers(teamId) {
		await waitForLatency();
		const team = teams.find((candidate) => candidate.id === teamId);
		if (!team) return null;
		return team.members.map((memberId) =>
			users.find((user) => user.id === memberId),
		);
	},

	async createTeam({ name }) {
		await waitForLatency();
		const timestamp = now();
		const team = {
			id: nextId(teams),
			name,
			members: [],
			createdAt: timestamp,
			updatedAt: timestamp,
		};
		teams.push(team);
		return team;
	},

	async addTeamMember(teamId, userId) {
		await waitForLatency();
		const team = teams.find((candidate) => candidate.id === teamId);
		const user = users.find((candidate) => candidate.id === userId);
		if (!team || !user) return null;
		if (!team.members.includes(userId)) {
			team.members.push(userId);
			team.updatedAt = now();
		}
		return team;
	},

	async removeTeamMember(teamId, userId) {
		await waitForLatency();
		const team = teams.find((candidate) => candidate.id === teamId);
		if (!team) return null;
		team.members = team.members.filter((memberId) => memberId !== userId);
		team.updatedAt = now();
		return team;
	},

	_reset() {
		users.length = 0;
		users.push(...initialUsers.map(cloneUser));
		teams.length = 0;
		teams.push(...initialTeams.map(cloneTeam));
	},
};

module.exports = db;
