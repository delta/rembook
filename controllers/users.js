var User = require('../models/Users');

var getUserByRollNumber = function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  var requestedBy = req.session.rollNumber;
  User.getUserByRollNumber(rollNumber).then(function (user) {
    var response;
    if (user === null){
      response = {
        success:0,
        message:"Profile Not Found"
      };
      res.json(response);
    }else{
      response = {
        success:1,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        dob: user.dob,
        address: user.address,
        hostels: user.hostels,
        contact: user.contact,
        department: user.department,
        photoName: user.photoName
      };
      if (requestedBy === user.rollNumber){
        response.hardCopyRequested = user.hardCopyRequested;
        response.lastLogin = user.lastLogin;
      }
      res.json(response);
    }
  }).catch(function (err) {
      console.log(err);
      next(err);
  });
};

var updateProfile = function (req, res, next) {
  var rollNumber = req.session.rollNumber;
  var data = req.body;
  var callback = function (err, success) {
    if (err){
      console.log(err);
      next(err);
    }else{
      var response = {
        'success':1,
        'message':"",
      };
      res.json(response);
    }
  };
  User.updateProfile(rollNumber, data, callback);
};

var search = function (req, res, next) {
  var q = req.query.q
  var all = false;
  var isPg = req.session.rollNumber[0] != "1";
  var curRoll = req.session.rollNumber;

  // Warning: these calculations will break in 2022
  var fourYearCode = "1" + (new Date().getFullYear() - 2014); // for UGs
  var threeYearCode = "1" + (new Date().getFullYear() - 2013); // for MCA
  var twoYearCode = "1" + (new Date().getFullYear() - 2012); // for other PGs

  var finalYearCode = fourYearCode;
  if (isPg) {
    // MCA is a 3 year course. Everything else is 2 years.
    if(/^2051/.test(curRoll)) { // MCA
      finalYearCode = threeYearCode;
    } else {
      finalYearCode = twoYearCode;
    }
  }

  if(!q) {
    all = true;
    q = finalYearCode; // first 6 chars of roll number
  }
  var department;
  if (typeof req.query.department !== 'undefined'){
    department = req.query.department;
    if(isPg) {
      if(department == "MCA") finalYearCode = threeYearCode;
      else finalYearCode = twoYearCode;
    }
  }else{
    department = /.+/;
  }
  var callback = function (err, results) {
    if (err){
      next(err);
    }else {
      var response = {};
      if (results.length === 0){
        response.success = 0;
        response.message = "No Results Found";
      }else{
        response.success = 1;
        response.message = "";
        var users = [];
        var i, count, limit;
        var user;
	count = 0;
	limit = all ? 110 : 15;
        for (i=0; count < limit && i < results.length;i++){ 
	 //console.log(results[i].rollNumber);
          var roll = results[i].rollNumber.toString();
     	  if(roll.substr(4,2) != finalYearCode) continue;
	      count++;
          user ={};
          user.name = results[i].name;
          user.rollNumber = results[i].rollNumber;
          user.email = results[i].email;
          user.dob = results[i].dob;
          user.department = results[i].department;
          user.photoName = results[i].photoName;
          users.push(user);
        }
        response.users = users;
      }
      res.set('Cache-Control', 'public, max-age: 1h');
      res.json(response);
    }
  };
  User.fuzzySearch(q, department, isPg, callback);
};

module.exports.getUserByRollNumber = getUserByRollNumber;
module.exports.updateProfile = updateProfile;
module.exports.search = search;
module.exports.hardCopyRequest = updateProfile;
