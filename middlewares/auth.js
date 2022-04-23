const jwt = require('jsonwebtoken')
const { AuthFailedError } = require('./errors/AuthFailedError')

const { NODE_ENV, JWT_SECRET } = process.env

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    return next(new AuthFailedError('Auth required'))
  }

  let payload

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
  } catch (err) {
    next(new AuthFailedError('Auth failed'))
  }

  req.user = payload

  return next()
}
