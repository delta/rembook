var Imap = require('imap');
var Questions = require('../models/Questions');
var Notifications = require('../models/Notifications');
var Users = require('../models/Users');
var ldap = require('ldapjs');

var batch = 2012;
var ldapurl = 'ldap://10.0.0.39:389';
var imaphost = "10.0.0.173";
var imapport = 143;
var domain = 'octa.edu';


var getDepartment = function (rollNumber) {
  var departmentCode = rollNumber.slice(0,4);
  var department= "";
  switch (departmentCode) {
  case '1011':
    department = "ARCHI";
    break;
    case '1021':
    department = "CHL";
    break;
    case '1031':
    department = "CIV";
    break;
    case '1061':
    department = "CSE";
    break;
    case '1071':
    department = "EEE";
    break;
    case '1081':
    department = "ECE";
    break;
    case '1101':
    department = "ICE";
    break;
    case '1111':
    department = "MECH";
    break;
    case '1121':
    department = "MME";
    break;
    case '1141':
    department = "PROD";
    break;

  }
  return department;
};

var generateDN = function (rollNumber) {
  var year = "20"+ rollNumber.slice(4,6);
  var department = getDepartment(rollNumber);
  if (department === "ARCHI"){
    DN = "CN="+rollNumber+",OU="+year+",OU="+department+",DC=octa,DC=edu";
  }else{
    DN = "CN="+rollNumber+",OU="+year+",OU=UG,OU="+department+",DC=octa,DC=edu";
  }
  return DN;
};

var getUserInfo= function(username, callback){
  var client = ldap.createClient({
    url: ldapurl
  });
  var server ="111113070";
  var password = "Mech123";
  var cn = server+'@'+domain;
  client.bind(cn,password,function(err){});

  var opts = {
    scope: 'sub',
  };
  var DN = generateDN(username);
  client.search(DN, opts, function(err, res) {
    if (err){
      callback(err);
    }else{
      res.on('searchEntry', function(entry) {
        callback(null,entry.object);
        client.unbind(function (err) {});
      });
      // res.on('searchReference', function(referral) {
      //   console.log('referral: ' + referral.uris.join());
      // });
      res.on('error', function(err) {
        console.error('error: ' + err.message);
        client.unbind(function (err) {});
      });
      // res.on('end', function(result) {
        // console.log('status: ' + result.status);
      // });
    }
  });
};

var authenticate=function(username, password, callback){
  // var success = {
  //   displayName : username,
  // };
  // callback(null, success);
  if(!password) return callback(new Error("Password required"));
  var client = ldap.createClient({
    url: ldapurl
  });
  var cn = username+'@'+domain;
  client.bind(cn,password,function(err){
    if (err){
      console.log(err);
      console.log("Trying Imap Login");
      var imap = new Imap({
        user: username,
        password: password,
        host: imaphost,
        port: imapport,
        tls: false
      });
      imap.once('ready', function() {
        imap.end();
        console.log("Authenticated");
        if (username === 'sundar'){
          var success = {
            displayName : 'Dr. Srinivasan Sundarrajan'
          };
          callback(null,success);
        }else{
          getUserInfo(username, callback);
        }
      });
      imap.once('error', function(err) {
        console.log(err);
        callback(err);
      });
      imap.connect();
    }else{
      client.unbind(function (err) {});
      console.log("Authenticated");
      getUserInfo(username, callback);
    }
  });
};

var processLogin = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var callback = function (fail, success) {
    if (fail){
      console.log(fail);
      res.set("X-Rembook-Login","Fail");
      res.render('login', { message: "The username or password you entered is wrong" });
//      res.redirect("/login");
    }else{
      var year = parseInt( "20"+ username.slice(4,6));
      if (year <= batch){
        var data = {};
        data.rollNumber = username;
        data.name = success.displayName.trim();
        data.email = data.rollNumber + "@nitt.edu";
        data.department = getDepartment(username);
        data.lastLogin = Date.now();
        Users.createProfile(username, data, function (err,doc){ });
      }
      res.set("X-Rembook-Login","Authenticated");
      req.session.name = success.displayName.trim();
      req.session.rollNumber = username;
      res.redirect("/");
      //initalPage(req,res,next);
    }
  };
  authenticate(username, password, callback);
};

var initalPage = function (req, res, next) {
  var init={};
  init.departmentCodes = [
    {code:"archi", name:"Architecture"},
    {code:"civ", name:"Civil"},
    {code:"chl", name:"Chemical"},
    {code:"cse", name:"Computer Science"},
    {code:"ece", name:"Electronics & Communication"},
    {code:"eee", name:"Elemctrical & Electronics"},
    {code:"ice", name:"Instrumentation & Control"},
    {code:"mech", name:"Mechanical"},
    {code:"prod", name:"Production"},
    {code:"mme", name:"Metallurgical & Materials"},
  ];
  init.rollNumber = req.session.rollNumber;
  Promise.all([
    Questions.getAllQuestions(),
    Users.getUserByRollNumber(init.rollNumber),
    Notifications.getAllNotificationTo(init.rollNumber)
  ])
    .then(function(results){
      var questions = results[0];
      var user = results[1];
      var notifications = results[2];
      init.questions = questions;
      if (user !== null){
        init.name = user.name;
        init.hardCopyRequested = user.hardCopyRequested;
        init.department = user.department;
        init.notifications = notifications;
      }
      res.render('index', { init: init, title:"Rembook" });
    })
    .catch(function(err){
      console.log(err);
      next(err);
  });
};

var logout = function(req, res, next){
  req.session.destroy();
  res.redirect('/');
};
module.exports.authenticate = authenticate;
module.exports.processLogin = processLogin;
module.exports.initalPage = initalPage;
module.exports.logout = logout;
