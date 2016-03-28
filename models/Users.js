var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:               String,
  rollNumber:         String,
  email:              String,
  dob:                Date,
  department:         String,
  photoName:          String,
  hardCopyRequested:  Boolean,
  lastLogin:         { type: Date, default: Date.now },
});

var User = mongoose.model('User', userSchema);

//Add Functions Below
var getUserByRollNumber = function (rollNumber) {
  return User.findOne({rollNumber:rollNumber});
};

module.exports.getUserByRollNumber = getUserByRollNumber;
