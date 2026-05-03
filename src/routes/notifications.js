const express = require("express");
const db = require("../db");
const { validateRequired } = require("../middleware/validate");

const router = express.Router();

const VALID_TYPES = new Set(["system", "user", "team"]);
const VALID_PRIORITIES = new Set(["low", "normal", "high"]);

function normalizeUnreadOnly(query) {
	return query.unread === "true" || query.status === "unread";
}

async function validateUser(req, res, next) {
	const user = await db.findUser(req.params.userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
	next();
}

// GET /api/notifications/users/:userId - List notifications for a user
router.get("/users/:userId", validateUser, async (req, res) => {
	const notifications = await db.getNotificationsForUser(req.params.userId, {
		unreadOnly: normalizeUnreadOnly(req.query),
	});
	res.json(notifications);
});

// GET /api/notifications/users/:userId/unread-count - Get unread count for a user
router.get("/users/:userId/unread-count", validateUser, async (req, res) => {
	const count = await db.getUnreadNotificationCount(req.params.userId);
	res.json({ count });
});

// POST /api/notifications/users/:userId - Create a notification for a user
router.post(
	"/users/:userId",
	validateUser,
	validateRequired(["title", "message"]),
	async (req, res) => {
		const { title, message, actionUrl } = req.body;
		const type = VALID_TYPES.has(req.body.type) ? req.body.type : "system";
		const priority = VALID_PRIORITIES.has(req.body.priority)
			? req.body.priority
			: "normal";
		const notification = await db.createNotification({
			userId: req.params.userId,
			type,
			priority,
			title,
			message,
			actionUrl,
		});
		res.status(201).json(notification);
	},
);

// PATCH /api/notifications/users/:userId/:notificationId/read - Mark one read
router.patch(
	"/users/:userId/:notificationId/read",
	validateUser,
	async (req, res) => {
		const notification = await db.markNotificationRead(
			req.params.userId,
			req.params.notificationId,
		);
		if (!notification) {
			return res.status(404).json({ error: "Notification not found" });
		}
		res.json(notification);
	},
);

// PATCH /api/notifications/users/:userId/read-all - Mark all read for a user
router.patch("/users/:userId/read-all", validateUser, async (req, res) => {
	const notifications = await db.markAllNotificationsRead(req.params.userId);
	res.json({ notifications, count: notifications.length });
});

module.exports = router;
