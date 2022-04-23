module.exports.AuthFailedError = class AuthFailedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthFailedError'
    this.statusCode = 401
  }
}
