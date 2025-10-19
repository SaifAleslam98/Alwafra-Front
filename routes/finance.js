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


module.exports = router;
