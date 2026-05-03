const express = require("express");
const db = require("../db");
const { validateRequired } = require("../middleware/validate");

const router = express.Router();

function getUserId(req) {
	return req.get("x-user-id") || req.query.userId || req.body.userId;
}

function requireUserId(req, res, next) {
	const userId = getUserId(req);
	if (!userId) {
		return res.status(400).json({ error: "userId is required" });
	}
	req.notificationUserId = userId;
	next();
}

// GET /api/notifications - List notifications for a user
router.get("/", requireUserId, async (req, res) => {
	const notifications = await db.getNotificationsForUser(
		req.notificationUserId,
		{ unreadOnly: req.query.unreadOnly === "true" },
	);
	res.json(notifications);
});

// GET /api/notifications/unread-count - Get unread count for a user
router.get("/unread-count", requireUserId, async (req, res) => {
	const count = await db.getUnreadNotificationCount(req.notificationUserId);
	res.json({ count });
});

// POST /api/notifications - Create a notification
router.post(
	"/",
	validateRequired(["userId", "title", "message"]),
	async (req, res) => {
		const user = await db.findUser(req.body.userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const notification = await db.createNotification(req.body);
		res.status(201).json(notification);
	},
);

// PATCH /api/notifications/:id/read - Mark one notification read
router.patch("/:id/read", requireUserId, async (req, res) => {
	const notification = await db.markNotificationRead(
		req.notificationUserId,
		req.params.id,
	);
	if (!notification) {
		return res.status(404).json({ error: "Notification not found" });
	}
	res.json(notification);
});

// PATCH /api/notifications/read-all - Mark all notifications read
router.patch("/read-all", requireUserId, async (req, res) => {
	const result = await db.markAllNotificationsRead(req.notificationUserId);
	res.json(result);
});

module.exports = router;
