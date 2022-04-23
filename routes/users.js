const users = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const {
  updateUser, getCurrentUser,
} = require('../controllers/users')

users.get('/me', getCurrentUser)

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser)


module.exports = users
