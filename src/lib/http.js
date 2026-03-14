const { asyncHandler } = require('../utils/errors');

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const sendOk = (res, payload) => sendJson(res, 200, payload);

const sendCreated = (res, payload) => sendJson(res, 201, payload);

const sendNotFound = (res, message) => sendJson(res, 404, { error: message });

const withAsync = (handler) => asyncHandler(handler);

module.exports = {
  sendCreated,
  sendJson,
  sendNotFound,
  sendOk,
  withAsync,
};
