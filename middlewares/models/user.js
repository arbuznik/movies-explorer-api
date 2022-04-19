const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { AuthFailedError } = require('../middlewares/errors/AuthFailedError')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Bad user email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
})

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthFailedError('Wrong email or password'))
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthFailedError('Wrong email or password'))
          }

          return user
        })
    })
}

module.exports = mongoose.model('user', userSchema)
