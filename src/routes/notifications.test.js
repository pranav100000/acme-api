const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const db = require("../db");
const notificationRoutes = require("./notifications");

function createApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/notifications", notificationRoutes);
	app.use((err, _req, res, _next) => {
		const status = err.statusCode || 500;
		res.status(status).json({ error: err.message || "Internal server error" });
	});
	return app;
}

async function withServer(callback) {
	const app = createApp();
	const server = app.listen(0);
	const { port } = server.address();
	try {
		await callback(`http://localhost:${port}`);
	} finally {
		server.close();
	}
}

describe("Notification Routes", () => {
	beforeEach(() => {
		db._reset();
	});

	test("GET /api/notifications/users/:userId returns notifications newest first", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(`${baseUrl}/api/notifications/users/1`);
			assert.strictEqual(res.status, 200);
			const notifications = await res.json();
			assert.strictEqual(notifications.length, 3);
			assert.strictEqual(notifications[0].title, "Engineering standup moved");
			assert.ok(
				notifications.every((notification) => notification.userId === "1"),
			);
		});
	});

	test("GET /api/notifications/users/:userId?unread=true filters unread notifications", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(
				`${baseUrl}/api/notifications/users/1?unread=true`,
			);
			assert.strictEqual(res.status, 200);
			const notifications = await res.json();
			assert.strictEqual(notifications.length, 2);
			assert.ok(notifications.every((notification) => !notification.read));
		});
	});

	test("GET /api/notifications/users/:userId/unread-count returns unread count", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(
				`${baseUrl}/api/notifications/users/1/unread-count`,
			);
			assert.strictEqual(res.status, 200);
			const body = await res.json();
			assert.strictEqual(body.count, 2);
		});
	});

	test("POST /api/notifications/users/:userId creates a notification", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(`${baseUrl}/api/notifications/users/1`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "system",
					priority: "high",
					title: "Policy update",
					message: "Please review the updated access policy.",
					actionUrl: "/users",
				}),
			});
			assert.strictEqual(res.status, 201);
			const notification = await res.json();
			assert.ok(notification.id);
			assert.strictEqual(notification.read, false);
			assert.strictEqual(notification.priority, "high");
		});
	});

	test("PATCH /api/notifications/users/:userId/:notificationId/read marks one notification read", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(`${baseUrl}/api/notifications/users/1/1/read`, {
				method: "PATCH",
			});
			assert.strictEqual(res.status, 200);
			const notification = await res.json();
			assert.strictEqual(notification.read, true);
		});
	});

	test("PATCH /api/notifications/users/:userId/read-all marks all notifications read", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(`${baseUrl}/api/notifications/users/1/read-all`, {
				method: "PATCH",
			});
			assert.strictEqual(res.status, 200);
			const body = await res.json();
			assert.strictEqual(body.count, 3);
			assert.ok(body.notifications.every((notification) => notification.read));
		});
	});

	test("GET /api/notifications/users/:userId returns 404 for missing user", async () => {
		await withServer(async (baseUrl) => {
			const res = await fetch(`${baseUrl}/api/notifications/users/999`);
			assert.strictEqual(res.status, 404);
			const body = await res.json();
			assert.strictEqual(body.error, "User not found");
		});
	});
});
