var express = require('express');
var router = express.Router();
var login = require('../controllers/authenticate');
var users = require('../controllers/users');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Rembook' });
});

router.post('/login',login.processLogin);

router.get('/', login.initalPage);

router.get('/profile/:rollNumber',function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  users.getUserByRollNumber(req, res, rollNumber, next);
});

router.post('/profile/',users.updateProfile);

module.exports = router;
