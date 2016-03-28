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

var updateProfile = function (rollNumber, data ,callback) {
  User.findOne({rollNumber:rollNumber}).then(function (doc) {
    if(data.email){
      doc.email=data.email;
    }
    if (data.dob){
      doc.email=data.dob;
    }
    doc.save().then(function (doc) {
      callback(null, doc);
    }).catch(function (err){
      callback(err);
    });
  });
};

module.exports.getUserByRollNumber = getUserByRollNumber;
module.exports.updateProfile = updateProfile;
