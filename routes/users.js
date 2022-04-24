const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');

users.get('/users/me', getCurrentUser);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = users;
