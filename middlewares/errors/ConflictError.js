module.exports.ConflictError = class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConflictError'
    this.statusCode = 409
  }
}
