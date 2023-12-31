require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const cors = require('./middlewares/cors');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/error');
const { limiter } = require('./middlewares/limiter');

const { commonRoutes, protectedRoutes } = require('./routes/index');
const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(requestLogger);
app.use(helmet());
app.use(bodyParser.json());
app.use(cors);
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', commonRoutes);
app.use('/', auth, protectedRoutes);

app.use(() => {
  throw new NotFoundError('Запрашиваемый адрес не найден. Проверьте URL и метод запроса');
});

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.use(limiter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
