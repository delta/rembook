var mongoose = require('mongoose');
var fuse = require('fuse.js');
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
      doc.dob=data.dob;
    }
    doc.save().then(function (doc) {
      callback(null, doc);
    }).catch(function (err){
      callback(err);
    });
  });
};

var updatePhotoName = function (rollNumber, photoName, callback) {
  User.findOne({rollNumber:rollNumber}).then(function (doc) {
    doc.photoName = photoName;
    doc.save().then(function (doc) {
      callback(null, doc);
    }).catch(function (err){
      callback(err);
    });
  });
};

var fuzzySearch = function (search, department, callback) {
  User.find({department:department}).then(function(users){
    var options={
      keys:['rollNumber','name']
    };
    var f = new fuse(users, options);
    var results = f.search(search);
    callback(null,results);
  });
};

module.exports.getUserByRollNumber = getUserByRollNumber;
module.exports.updateProfile = updateProfile;
module.exports.updatePhotoName = updatePhotoName;
module.exports.fuzzySearch = fuzzySearch;
