/**
 * Simple request logger middleware
 */
const logger = (req, _res, next) => {
	console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
	next();
};

module.exports = logger;
