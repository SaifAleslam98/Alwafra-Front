var express = require('express');
var router = express.Router();

const { isAuthorized } = require('../utils/authentication');

router.use(isAuthorized);


/* GET Finance. */
router.get('/', function (req, res, next) {
  res.render('finance/financial', {
    title: 'الحسابات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Payments. */
router.get('/payments', function (req, res, next) {
  res.render('finance/payments', {
    title: 'الإيرادات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Deposits. */
router.get('/deposit', function (req, res, next) {
  res.render('finance/deposit', {
    title: 'التأمينات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Refund. */
router.get('/refund', function (req, res, next) {
  res.render('finance/refund', {
    title: 'التأمينات المستردة',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Expense. */
router.get('/expense', function (req, res, next) {
  res.render('finance/expense', {
    title: 'المنصرفات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Refund Back. */
router.get('/depositBack', function (req, res, next) {
  res.render('finance/depositBack', {
    title: 'استرداد التأمين',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});


module.exports = router;
