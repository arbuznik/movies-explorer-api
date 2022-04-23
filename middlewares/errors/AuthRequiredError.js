module.exports.AuthRequiredError = class AuthRequiredError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthRequiredError'
    this.statusCode = 403
  }
}
