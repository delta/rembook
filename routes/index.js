var express = require('express');
var router = express.Router();
var webmail = require('../controllers/authenticate');
var users = require('../controllers/users');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Rembook' });
});

router.post('/login',function (req, res, next) {
  req.session.username=username;
  var username = req.body.username;
  var password = req.body.password;
  var callback = function (fail, success) {
    if (fail){
      res.set("X-Rembook-Login","Fail");
      res.redirect("/login");
    }else{
      res.set("X-Rembook-Login","Authenticated");
      req.session.username = username;
      res.redirect("/");
    }
  };
  webmail.authenticate(username, password, callback);
});

router.get('/',function (req, res, next) {
  res.render('index', { title: 'Rembook' });
});

router.get('/profile/:rollNumber',function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  user.getUserByRollNumber(req, res, rollNumber, next);
});

module.exports = router;
