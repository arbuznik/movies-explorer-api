const {
  MONGO_DATA_BASE = 'mongodb://localhost:27017/moviesdb',
  NODE_ENV = 'development',
  JWT_SECRET = 'secret',
  PORT = 3000,
} = process.env;

module.exports = {
  MONGO_DATA_BASE,
  NODE_ENV,
  JWT_SECRET,
  PORT,
}