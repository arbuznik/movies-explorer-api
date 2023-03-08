require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const users = require('./routes/users');
const movies = require('./routes/movies');
const register = require('./routes/register');
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./middlewares/errors/NotFoundError');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://movies-explorer-2p8x.onrender.com',
  ],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Cookie'],
  credentials: true,
}));

app.use(register);

app.use(auth);

app.use(users);
app.use(movies);

app.use((req, res, next) => (
  next(new NotFoundError('Страница не найдена'))
));

app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

app.listen(process.env.PORT);

mongoose.connect(process.env.MONGO_DATA_BASE, {
  useNewUrlParser: true,
  autoIndex: true,
});
