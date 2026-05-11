const Sentry = require("@sentry/node");

function registerErrorHandlers(app) {
	Sentry.setupExpressErrorHandler(app);

	app.use((err, _req, res, _next) => {
		console.error(err.stack);
		const status = err.statusCode || 500;
		res.status(status).json({ error: err.message || "Internal server error" });
	});
}

module.exports = { registerErrorHandlers };
