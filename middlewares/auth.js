require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthFailedError } = require('./errors/AuthFailedError');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthFailedError('Auth required'));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(new AuthFailedError('Auth failed'));
  }

  req.user = payload;

  return next();
};
