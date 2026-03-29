const { asyncHandler } = require('../utils/errors');

const route = (handler) => asyncHandler(handler);

const sendNotFound = (res, resource) => res.status(404).json({ error: `${resource} not found` });

module.exports = { route, sendNotFound };
