const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const users = require('./routes/users');
const movies = require('./routes/movies');
const { createUser, login, logout } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://arbuznik.diploma.nomoredomains.xyz',
    'http://arbuznik.diploma.nomoredomains.xyz',
  ],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Cookie'],
  credentials: true,
}));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.get('/signout', logout);

app.use(auth);

app.use('/users', users);
app.use('/movies', movies);

app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

app.listen(PORT);

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  autoIndex: true,
});
