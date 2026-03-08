class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

function notFound(message) {
  return new HttpError(404, message);
}

function badRequest(message) {
  return new HttpError(400, message);
}

function conflict(message) {
  return new HttpError(409, message);
}

function created(res, payload) {
  return res.status(201).json(payload);
}

module.exports = {
  HttpError,
  notFound,
  badRequest,
  conflict,
  created,
};
