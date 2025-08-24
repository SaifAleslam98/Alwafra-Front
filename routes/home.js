var express = require('express');
var router = express.Router();

const { isAuthorized } = require('../utils/authentication');

router.use(isAuthorized);

/* GET Dashborad. */
router.get('/', function (req, res, next) {
  res.render('home/dashboard', {
    title: 'لوحة التحكم',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Dashborad. */
router.get('/profile', function (req, res, next) {
  res.render('home/profile', {
    title: 'الملف الشخصي',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});


module.exports = router;
