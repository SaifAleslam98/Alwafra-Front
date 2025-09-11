var express = require('express');
var router = express.Router();

const { isAuthorized } = require('../utils/authentication');

router.use(isAuthorized);


/* GET Clients. */
router.get('/', function (req, res, next) {
  res.render('clients/all', {
    title: 'العملاء',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });

});

/* GET Client. */
router.get('/:id', function (req, res, next) {
  res.render('clients/view-client', {
    title: 'تأشيرات العملاء',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });

});

/* New Client. */
router.get('/new/client', function (req, res, next) {
  res.render('clients/new-client', {
    title: 'عميل جديد',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });

});

module.exports = router;
