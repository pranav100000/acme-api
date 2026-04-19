const { test, describe, beforeEach, before, after } = require("node:test");
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

describe("Notification Routes", () => {
	let server;
	let baseUrl;

	before(async () => {
		const app = createApp();
		server = app.listen(0);
		const { port } = server.address();
		baseUrl = `http://localhost:${port}`;
	});

	beforeEach(() => {
		db._reset();
	});

	after(async () => {
		server.close();
		db._reset();
	});

	test("GET /api/notifications returns notifications for the current user", async () => {
		const res = await fetch(`${baseUrl}/api/notifications?userId=1`);
		assert.strictEqual(res.status, 200);
		const notifications = await res.json();
		assert.ok(Array.isArray(notifications));
		assert.strictEqual(notifications.length, 3);
		assert.ok(
			notifications.every((notification) => notification.userId === "1"),
		);
	});

	test("GET /api/notifications supports unreadOnly filtering", async () => {
		const res = await fetch(
			`${baseUrl}/api/notifications?userId=1&unreadOnly=true`,
		);
		assert.strictEqual(res.status, 200);
		const notifications = await res.json();
		assert.strictEqual(notifications.length, 2);
		assert.ok(notifications.every((notification) => !notification.read));
	});

	test("GET /api/notifications/unread-count returns unread count", async () => {
		const res = await fetch(`${baseUrl}/api/notifications/unread-count`, {
			headers: { "x-user-id": "1" },
		});
		assert.strictEqual(res.status, 200);
		const body = await res.json();
		assert.strictEqual(body.count, 2);
	});

	test("GET /api/notifications requires userId", async () => {
		const res = await fetch(`${baseUrl}/api/notifications`);
		assert.strictEqual(res.status, 400);
		const body = await res.json();
		assert.ok(body.error.includes("userId"));
	});

	test("POST /api/notifications creates a notification", async () => {
		const res = await fetch(`${baseUrl}/api/notifications`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: "2",
				type: "success",
				title: "Build completed",
				message: "The nightly build completed successfully.",
				actionUrl: "/",
			}),
		});
		assert.strictEqual(res.status, 201);
		const notification = await res.json();
		assert.strictEqual(notification.userId, "2");
		assert.strictEqual(notification.read, false);
		assert.strictEqual(notification.type, "success");
	});

	test("POST /api/notifications returns 404 for missing user", async () => {
		const res = await fetch(`${baseUrl}/api/notifications`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: "999",
				title: "Missing user",
				message: "This should fail.",
			}),
		});
		assert.strictEqual(res.status, 404);
	});

	test("PATCH /api/notifications/:id/read marks one notification read", async () => {
		const res = await fetch(`${baseUrl}/api/notifications/1/read`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json", "x-user-id": "1" },
		});
		assert.strictEqual(res.status, 200);
		const notification = await res.json();
		assert.strictEqual(notification.id, "1");
		assert.strictEqual(notification.read, true);
	});

	test("PATCH /api/notifications/:id/read does not expose other users notifications", async () => {
		const res = await fetch(`${baseUrl}/api/notifications/4/read`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json", "x-user-id": "1" },
		});
		assert.strictEqual(res.status, 404);
	});

	test("PATCH /api/notifications/read-all marks all notifications read", async () => {
		const res = await fetch(`${baseUrl}/api/notifications/read-all`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId: "1" }),
		});
		assert.strictEqual(res.status, 200);
		const body = await res.json();
		assert.strictEqual(body.updated, 2);

		const countRes = await fetch(`${baseUrl}/api/notifications/unread-count`, {
			headers: { "x-user-id": "1" },
		});
		const count = await countRes.json();
		assert.strictEqual(count.count, 0);
	});
});
