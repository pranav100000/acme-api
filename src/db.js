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

const notifications = [
	{
		id: "1",
		userId: "1",
		type: "info",
		title: "Welcome to unified notifications",
		message:
			"Your user, team, and system alerts now appear in one notification center.",
		read: false,
		actionUrl: "/users",
		createdAt: "2024-03-28T09:00:00Z",
		updatedAt: "2024-03-28T09:00:00Z",
	},
	{
		id: "2",
		userId: "1",
		type: "warning",
		title: "Pending user approvals",
		message: "Henry Taylor is waiting for account approval.",
		read: false,
		actionUrl: "/users",
		createdAt: "2024-03-29T12:30:00Z",
		updatedAt: "2024-03-29T12:30:00Z",
	},
	{
		id: "3",
		userId: "1",
		type: "success",
		title: "Engineering roster updated",
		message: "Eve Martinez was added to Engineering.",
		read: true,
		actionUrl: "/teams",
		createdAt: "2024-03-25T16:15:00Z",
		updatedAt: "2024-03-26T08:00:00Z",
	},
	{
		id: "4",
		userId: "2",
		type: "info",
		title: "Infrastructure team update",
		message: "You are assigned to the Infrastructure team.",
		read: false,
		actionUrl: "/teams",
		createdAt: "2024-03-27T10:00:00Z",
		updatedAt: "2024-03-27T10:00:00Z",
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

const initialUsers = users.map((u) => ({ ...u }));
const initialTeams = teams.map((t) => ({ ...t, members: [...t.members] }));
const initialNotifications = notifications.map((n) => ({ ...n }));

const db = {
	async findUser(id) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return users.find((u) => u.id === id) || null;
	},

	async findUserByEmail(email) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return users.find((u) => u.email === email) || null;
	},

	async getAllUsers() {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return users;
	},

	async createUser({ email, name, role }) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const id = String(
			Math.max(...users.map((u) => Number.parseInt(u.id, 10))) + 1,
		);
		const now = new Date().toISOString();
		const user = {
			id,
			email,
			name,
			role: role || "developer",
			status: "active",
			createdAt: now,
			updatedAt: now,
		};
		users.push(user);
		return user;
	},

	async updateUser(id, updates) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const user = users.find((u) => u.id === id);
		if (!user) return null;
		const allowed = ["email", "name", "role", "status"];
		for (const key of allowed) {
			if (updates[key] !== undefined) {
				user[key] = updates[key];
			}
		}
		user.updatedAt = new Date().toISOString();
		return user;
	},

	async deleteUser(id) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const user = users.find((u) => u.id === id);
		if (!user) return null;
		user.status = "inactive";
		user.updatedAt = new Date().toISOString();
		return user;
	},

	async findTeam(id) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return teams.find((t) => t.id === id) || null;
	},

	async getAllTeams() {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return teams;
	},

	async getTeamMembers(teamId) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const team = teams.find((t) => t.id === teamId);
		if (!team) return null;
		return team.members.map((memberId) => users.find((u) => u.id === memberId));
	},

	async getNotificationsForUser(userId, filters = {}) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return notifications
			.filter((notification) => notification.userId === userId)
			.filter((notification) => {
				if (filters.unreadOnly) {
					return !notification.read;
				}
				return true;
			})
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	},

	async getUnreadNotificationCount(userId) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		return notifications.filter(
			(notification) => notification.userId === userId && !notification.read,
		).length;
	},

	async createNotification({
		userId,
		type = "info",
		title,
		message,
		actionUrl,
	}) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const id = String(
			Math.max(...notifications.map((n) => Number.parseInt(n.id, 10)), 0) + 1,
		);
		const now = new Date().toISOString();
		const notification = {
			id,
			userId,
			type,
			title,
			message,
			read: false,
			actionUrl: actionUrl || null,
			createdAt: now,
			updatedAt: now,
		};
		notifications.push(notification);
		return notification;
	},

	async markNotificationRead(userId, notificationId) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const notification = notifications.find(
			(n) => n.id === notificationId && n.userId === userId,
		);
		if (!notification) return null;
		notification.read = true;
		notification.updatedAt = new Date().toISOString();
		return notification;
	},

	async markAllNotificationsRead(userId) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const now = new Date().toISOString();
		let updated = 0;
		for (const notification of notifications) {
			if (notification.userId === userId && !notification.read) {
				notification.read = true;
				notification.updatedAt = now;
				updated += 1;
			}
		}
		return { updated };
	},

	async createTeam({ name }) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const id = String(
			Math.max(...teams.map((t) => Number.parseInt(t.id, 10))) + 1,
		);
		const now = new Date().toISOString();
		const team = { id, name, members: [], createdAt: now, updatedAt: now };
		teams.push(team);
		return team;
	},

	async addTeamMember(teamId, userId) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const team = teams.find((t) => t.id === teamId);
		const user = users.find((u) => u.id === userId);
		if (!team || !user) return null;
		if (!team.members.includes(userId)) {
			team.members.push(userId);
			team.updatedAt = new Date().toISOString();
		}
		return team;
	},

	async removeTeamMember(teamId, userId) {
		await new Promise((resolve) => setTimeout(resolve, 10));
		const team = teams.find((t) => t.id === teamId);
		if (!team) return null;
		team.members = team.members.filter((id) => id !== userId);
		team.updatedAt = new Date().toISOString();
		return team;
	},

	/**
	 * Resets database to initial state (for testing)
	 */
	_reset() {
		users.length = 0;
		users.push(...initialUsers.map((u) => ({ ...u })));
		teams.length = 0;
		teams.push(...initialTeams.map((t) => ({ ...t, members: [...t.members] })));
		notifications.length = 0;
		notifications.push(...initialNotifications.map((n) => ({ ...n })));
	},
};

module.exports = db;
