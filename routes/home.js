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

/* GET Profile. */
router.get('/profile', function (req, res, next) {
  res.render('home/profile', {
    title: 'الملف الشخصي',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Visas. */
router.get('/visas', function (req, res, next) {
  res.render('home/visas', {
    title: 'أنواع التأشيرات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Insurances. */
router.get('/refunds', function (req, res, next) {
  res.render('home/refunds', {
    title: 'التأمينات المسترجعة',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Insurances. */
router.get('/refund/:id', function (req, res, next) {
  res.render('home/refund-back', {
    title: 'إسترجاع التأمين',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Reports. */
router.get('/reports', function (req, res, next) {
  res.render('home/reports', {
    title: 'التقارير',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

module.exports = router;
