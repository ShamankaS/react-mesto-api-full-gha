const jwt = require('jsonwebtoken');
const { getJWT } = require('../utils/getJWT');
const UnauthorizedError = require('../utils/errors/unauthorized-err');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    const key = getJWT();
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
