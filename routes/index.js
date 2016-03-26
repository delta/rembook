var express = require('express');
var router = express.Router();
var webmail = require('../controllers/authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rembook' });
});

router.post('/login',function (req, res, next) {
  req.session.username=username;
  var username = req.body.username;
  var password = req.body.password;
  var callback = function (fail, success) {
    if (fail){
      res.redirect("/");
    }else{
      req.session.name = username;
      res.redirect("/main");
    }
  };
  webmail.authenticate(username, password, callback);
});
router.get('/main',function (req, res, next) {
  res.send(req.session.name);
});


module.exports = router;
