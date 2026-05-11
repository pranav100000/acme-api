// IMPORTANT: Import instrument.js before all other imports
require("./instrument.js");
require("express-async-errors");

const { createApp } = require("./app");
const { startServer } = require("./server");

module.exports = createApp();

if (require.main === module) {
	startServer();
}
