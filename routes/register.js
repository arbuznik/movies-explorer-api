const register = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { createUser, login, logout } = require('../controllers/users');

register.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

register.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

register.get('/signout', logout);

module.exports = register;
