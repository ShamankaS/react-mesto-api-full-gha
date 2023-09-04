const protectedRoutes = require('express').Router();
const commonRoutes = require('express').Router();
const { login, createUser, logout } = require('../controllers/users');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { validateLogin, validateRegister } = require('../utils/validators/userValidator');

commonRoutes.get('/signout', logout);
commonRoutes.post('/signin', validateLogin, login);
commonRoutes.post('/signup', validateRegister, createUser);

protectedRoutes.use('/users', userRoutes);
protectedRoutes.use('/cards', cardRoutes);

module.exports = {
  commonRoutes,
  protectedRoutes,
};
