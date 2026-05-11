const userRoutes = require("./users");
const teamRoutes = require("./teams");
const authRoutes = require("./auth");

function registerRoutes(app) {
	app.get("/health", (_req, res) => {
		res.json({ status: "ok" });
	});

	app.use("/api/users", userRoutes);
	app.use("/api/teams", teamRoutes);
	app.use("/api/auth", authRoutes);

	app.get("/debug-sentry", () => {
		throw new Error("My first Sentry error!");
	});
}

module.exports = { registerRoutes };
