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

var updateProfile = function (req, res,next) {
  var rollNumber = req.session.rollNumber;
  var data = req.body;
  var callback = function (err, success) {
    if (err){
      next(err);
    }else{
      var response = {
        'success':1,
      };
      res.json(response);
    }
  };
  User.updateProfile(rollNumber, data, callback);
};

module.exports.getUserByRollNumber = getUserByRollNumber;
module.exports.updateProfile = updateProfile;
