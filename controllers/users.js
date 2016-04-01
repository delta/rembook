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
        hostels: user.hostels,
        contact: user.contact,
        department: user.department,
        photoName: user.photoName
      };
      if (requestedBy === user.rollNumber){
        response.hardCopyRequested = user.hardCopyRequested;
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
  data.hostels = JSON.parse(data.hostels);
  var callback = function (err, success) {
    if (err){
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
  var q = req.query.q;
  var department;
  if (typeof req.query.department !== 'undefined'){
    department = req.query.department;
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
        var i;
        var user ={};
        for (i=0;i<results.length;i++){
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
      res.json(response);
    }
  };
  User.fuzzySearch(q, department, callback);
};

module.exports.getUserByRollNumber = getUserByRollNumber;
module.exports.updateProfile = updateProfile;
module.exports.search = search;
module.exports.hardCopyRequest = updateProfile;
