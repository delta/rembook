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
    case '1011': // UG Arch
    department = "ARCHI";
    break;
    case '2023': // PG Chemm Engg (Energy Engg)
    department = "CEESAT";
    break;
    case '1021': // UG Chem Engg
    case '2021': // PG M.Tech Chem Engg
    department = "CHL";
    break;
    case '2024': // MSc. Chem Engg
    case '2041': // MSc. Chem Engg
    department = "CHEM";
    break;
    case '1031': // UG Civil
    case '2031': // PG Transportation Engg
    case '2032': // PG Structural Engg
    case '2034': // PG Environmental Engg
    case '2035': // PG Environmental Engg
    department = "CIV";
    break;
    case '1061': // UG CSE
    case '2061': // PG CSE
    case '3061': // PG CSE
    department = "CSE";
    break;
    case '1071': // UG EEE
    case '2071': // PG Power Systems
    case '2072': // PG Power Electronics
    case '3071': // PG Power Electronics
    department = "EEE";
    break;
    case '1081': // UG ECE
    case '2081': // PG Communication Systems
    case '2082': // PG VLSI
    department = "ECE";
    break;
    case '1101': // UG ICE
    case '2101': // PG PCI
    department = "ICE";
    break;
    case '1111':
    case '2112': // Industrial safety
    case '2113': // Thermal Power Engg
    department = "MECH";
    break;
    case '1121': // UG MME
    case '2122': // PG Material Science
    case '2123': // PG Industrial Metallurgy
    case '2121': // PG Welding
    department = "MME";
    break;
    case '1141': // UG PROD
    case '2141': // Manufacturing Tech
    case '2142': // Industrial Engg and Mgmt
    department = "PROD";
    break;
    case '2162': // actually, Msc. CS. But ldap doesn't differentiate between the two
    department = "MCA";
    break;
    case '2051': // real MCA
    department = "MCA";
    break;
    case '2131': // NDT
    case '2132': // MSc. Phy
    department = "PHY";
    break;
    case '2151': // DOMS
    department = "MBA";
    break;
  }
  return department;
};

var generateDN = function (rollNumber) {
  var year = ",OU=20"+ rollNumber.slice(4,6);
  var department = getDepartment(rollNumber);
  if (department === "ARCHI") {
    DN = "CN="+rollNumber+year+",OU="+department+",DC=octa,DC=edu";
  }else{
    var pgOrUg = rollNumber[0] == "1" ? "UG" : "PG";
    if (/^216/.test(rollNumber)) year = ",OU=OR & CA";
    if (/^(2132|2041)/.test(rollNumber)) year = "";
    DN = "CN="+rollNumber+year+",OU="+pgOrUg+",OU="+department+",DC=octa,DC=edu";
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
  client.bind(cn,password,function(err){ console.log(err); });

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

var updatePassword = function (req, res, next) {
  var rollNumber = req.body.rollNumber;
  var token = req.body.token;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var newPasswordConfirm = req.body.newPasswordConfirm;

  if (!oldPassword) oldPassword = token;

  if (newPassword != newPasswordConfirm) {
    return res.render('updatePassword', {
      message: "Passwords don't match",
      token: token,
      rollNumber: rollNumber
    });
  }
  
  Users.updatePassword(rollNumber, oldPassword, newPassword, function (err) {
    if (err && err.message == "oldPasswordMismatch") {
      return res.render('updatePassword', {
        message: "Old password doesn't match",
        token: token,
        rollNumber: rollNumber
      });
    }
    if(err) {
      console.log(err);
      return res.render('updatePassword', {
        message: "Internal server error",
	token: token,
	rollNumber: rollNumber,
      });
    }

    return res.render('updatePassword', {
      success: true,
      message: "Password successfully updated",
      token: token,
      rollNumber: rollNumber,
    });
  });
}

var authenticate=function(username, password, callback){
  // var success = {
  //   displayName : username,
  // };
  // callback(null, success);
  if(!password) return callback(new Error("Password required"));
  var client = ldap.createClient({
    url: ldapurl
  });
  console.log("Trying rembook credentials");
  Users.validatePassword(username, password, function(err, result) {
    if(result) return getUserInfo(username, callback);
    console.log("Trying ldap login");
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
          getUserInfo(username, callback);
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
  });
};

var processLogin = function (req, res, next) {
 console.log("in processLogin");
  var username = req.body.username;
  var password = req.body.password;
  var callback = function (fail, success) {
    if (fail){
      console.log(fail);
      res.set("X-Rembook-Login","Fail");
      res.render('login', { message: "The username or password you entered is wrong" });
//      res.redirect("/login");
    }else{
      console.log("Creds match");
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
      console.log("redirecting to /");
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
module.exports.updatePassword = updatePassword;
module.exports.authenticate = authenticate;
module.exports.processLogin = processLogin;
module.exports.initalPage = initalPage;
module.exports.logout = logout;
