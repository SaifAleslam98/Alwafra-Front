var express = require('express');
var router = express.Router();
const { isNotAuthorized, isAuthorized } = require('../utils/authentication');

//router.use(isNotAuthorized);

/* GET login page. */
router.get('/', isNotAuthorized, function (req, res, next) {
  res.render('main/login', { title: 'تسجيل الدخول' });
});

/* GET Logout. */
router.get('/logout', isAuthorized, function (req, res, next) {
  res.clearCookie('token');
  res.locals.userName = null;
  res.locals._id = null;
  res.locals.userLoggedIn = false
  res.redirect('/');
});

module.exports = router;
