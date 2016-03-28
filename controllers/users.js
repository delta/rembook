var User = require('../models/Users');

var getUserByRollNumber = function (req, res, rollNumber, next) {
  var requestedBy = req.session.username;
  User.getUserByRollNumber(rollNumber).then(function (user) {
    console.log(user);
    var response = {
      name: user.name,
      rollNumber: user.rollNumber,
      email: user.email,
      dob: user.dob,
      department: user.department,
      photoName: user.photoName
    };
    if (requestedBy===user.rollNumber){
      response.hardCopyRequested = user.hardCopyRequested;
    }
    res.json(response);
  }).catch(function (err) {
      console.log(err);
      next(err);
  });
};

module.exports.getUserByRollNumber = getUserByRollNumber;
