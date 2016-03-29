var Imap = require('imap');
var host = "10.0.0.173";
var port = 143;
var Questions = require('../models/Questions');
var Notifications = require('../models/Notifications');
var Users = require('../models/Users');

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
      req.session.rollNumber = username;
      res.redirect("/");
    }
  };
  authenticate(username, password, callback);
};

var initalPage = function (req, res, next) {
  var init={};
  init.departmentCodes = [
    {code:"arch", name:"Architecture"},
    {code:"civ", name:"Civil"},
    {code:"chem", name:"Chemical"},
    {code:"cse", name:"Computer Science"},
    {code:"ece", name:"Electronics & Communication"},
    {code:"eee", name:"Elemctrical & Electronics"},
    {code:"ice", name:"Instrumentation & Control"},
    {code:"mech", name:"Mechanical"},
    {code:"prod", name:"Production"},
    {code:"mme", name:"Metallurgical & Materials"},
  ];
  Questions.getAllQuestions()
    .then(function(doc){
      init.questions = doc;
      init.rollNumber = req.session.rollNumber;
      return Users.getUserByRollNumber(init.rollNumber);
    })
    .then(function (doc) {
      if (doc === null){
        init.name = req.session.name;
        res.render('index', { init: init, title:"Rembook" });
      }else {
        init.name = doc.name;
        init.hardCopyRequested = doc.hardCopyRequested;
        init.department = doc.department;
        Notifications.getAllNotificationTo(init.rollNumber)
        .then(function (doc) {
          init.notifications = doc;
          res.render('index', { init: init, title:"Rembook" });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
      }
    })
    .catch(function (err) {
        console.log(err);
        next(err);
    });
};

module.exports.authenticate = authenticate;
module.exports.processLogin = processLogin;
module.exports.initalPage = initalPage;
