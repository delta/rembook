var express = require('express');
var router = express.Router();
var webmail = require('../controllers/authenticate');

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
      req.session.name = username;
      res.redirect("/");
    }
  };
  webmail.authenticate(username, password, callback);
});

router.get('/',function (req, res, next) {
  res.render('index', { title: 'Rembook' });
});


module.exports = router;
