var express = require('express');
var router = express.Router();
const { isAuthorized } = require('../utils/authentication');

router.use(isAuthorized);
/* GET Permits page. */
router.get('/', function (req, res, next) {
  res.render('permits/all', { title: 'الإقامات' });
});

/* GET Client. */
router.get('/:id', function (req, res, next) {
  res.render('permits/view-permit', {
    title: 'إقامات العملاء',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });

});

/* GET New Permit page. */
router.get('/new/permit', function (req, res, next) {
  res.render('permits/new-permit', { title: 'إقامة جديدة' });
});
module.exports = router;
