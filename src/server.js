const config = require("./config");
const { createApp } = require("./app");

function startServer(port = config.port) {
	const app = createApp();
	const server = app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
	return { app, server };
}

module.exports = { startServer };
