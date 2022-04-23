const Movie = require('../models/movie')
const { NotFoundError } = require('../middlewares/errors/NotFoundError')
const { AuthRequiredError } = require('../middlewares/errors/AuthRequiredError')
const { ValidationError } = require('../middlewares/errors/ValidationError')

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.map((movie) => {
      const {
        _id, country, director, duration, year, description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN
      } = movie

      return {
        _id, country, director, duration, year, description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN
      }
    })))
    .catch(next)
}

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN
  } = req.body

  Movie.create({
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner: req.user._id
  })
    .then((movie) => res.send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      owner: movie.owner
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Validation Error'))
      } else {
        next(err)
      }
    })
}

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден')
      }

      console.log(movie.owner.toString(), req.user._id)
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndDelete(req.params.movieId)
          .then((movie) => {

            const {
              _id,
              country,
              director,
              duration,
              year,
              description,
              image,
              trailerLink,
              thumbnail,
              movieId,
              nameRU,
              nameEN,
              owner
            } = movie;

            res.send({
              _id,
              country,
              director,
              duration,
              year,
              description,
              image,
              trailerLink,
              thumbnail,
              movieId,
              nameRU,
              nameEN,
              owner
            })
          })
      } else {
        throw new AuthRequiredError('Forbidden: not an owner')
      }
    })
    .catch(next)
}
