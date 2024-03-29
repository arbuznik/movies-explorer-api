require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../middlewares/errors/NotFoundError');
const { ConflictError } = require('../middlewares/errors/ConflictError');
const { ValidationError } = require('../middlewares/errors/ValidationError');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      const {
        _id, name, email,
      } = user;

      res.send({
        _id, name, email,
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(200).send({
      name, email,
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Email already exists'));
      } else if (error.name === 'ValidationError') {
        next(new ValidationError('Validation Error'));
      } else {
        next(error);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Email already exists'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Validation Error'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: 60000 * 60 * 24 },
      );
      res.cookie('jwt', token, {
        maxAge: 60000 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }).send({ message: 'Auth successfull' });
    })
    .catch(next);
};

module.exports.logout = (req, res) => res.status(200).clearCookie('jwt', {
  secure: true,
  sameSite: 'none',
  httpOnly: true,
}).send({ message: 'Logout successfull' });
