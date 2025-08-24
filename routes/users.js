var express = require('express');
var router = express.Router();

const { isAuthorized } = require('../utils/authentication');

router.use(isAuthorized);

/* GET Dashborad. */
router.get('/', function (req, res, next) {
  res.render('users/all-users', {
    title: 'المستخدمين',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });

});

module.exports = router;
