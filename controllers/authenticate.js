var Imap = require('imap');
var host = "10.0.0.173";
var port = 143;

var authenticate=function(username, password, callback){

  var imap = new Imap({
    user: username,
    password: password,
    host: host,
    port: port,
    tls: false
  });

  imap.once('ready', function() {
    // console.log("Logged In");
    imap.end();
    callback(null,1);
  });

  imap.once('error', function(err) {
    // console.log(err);
    callback(err);
  });

  imap.connect();
};

var processLogin = function (req, res, next) {
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
  authenticate(username, password, callback);
};

var initalPage = function (req, res, next) {
  var init={};
  res.render('index', { init: init, title:"Rembook" });
};

module.exports.authenticate = authenticate;
module.exports.processLogin = processLogin;
module.exports.initalPage = initalPage;
