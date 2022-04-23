const movies = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies')

movies.get('/', getMovies)

const urlRegex = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-zA-Z0-9]+\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/;

movies.post('/', celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
  }),
}), createMovie)

movies.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie)

module.exports = movies
