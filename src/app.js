const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const logger = require("./middleware/logger");
const { registerRoutes } = require("./routes");
const { registerErrorHandlers } = require("./middleware/error-handler");

function createApp() {
	const app = express();
	const publicDir = path.join(__dirname, "..", "public");
	const indexPath = path.join(publicDir, "index.html");

	app.use(express.json());
	app.use(logger);
	app.use(express.static(publicDir));

	registerRoutes(app);

	if (fs.existsSync(indexPath)) {
		app.get("*", (req, res, next) => {
			if (
				["/api", "/health", "/debug-sentry"].some((prefix) =>
					req.path.startsWith(prefix),
				)
			) {
				return next();
			}
			res.sendFile(indexPath);
		});
	}

	registerErrorHandlers(app);

	return app;
}

module.exports = { createApp };
