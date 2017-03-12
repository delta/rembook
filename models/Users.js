var mongoose = require('mongoose');
var fuse = require('fuse.js');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:               String,
  rollNumber:         String,
  email:              String,
  dob:                Date,
  department:         String,
  contact:            String,
  address:            String,
  hostels:            [String],
  photoName:          String,
  hardCopyRequested:  Boolean,
  lastLogin:         { type: Date, default: null },
});

var User = mongoose.model('User', userSchema);

var getUserByRollNumber = function (rollNumber) {
  return User.findOne({rollNumber:rollNumber});
};

var updateProfile = function (rollNumber, data ,callback) {
  User.findOne({rollNumber:rollNumber}).then(function (doc) {
    if (data.email){
      doc.email = data.email;
    }
    if (data.dob){
      doc.dob = data.dob;
    }
    if (data.hostels){
      doc.hostels = data.hostels;
    }
    if (data.address){
      doc.address = data.address;
    }
    if (data.contact){
      doc.contact = data.contact;
    }
    if (typeof data.hardCopyRequested !== 'undefined'){
      doc.hardCopyRequested = data.hardCopyRequested;
    }
    doc.save().then(function (doc) {
      callback(null, doc);
    }).catch(function (err){
      callback(err);
    });
  });
};

var createProfile = function (rollNumber, data ,callback) {
  getUserByRollNumber(rollNumber).then(function (doc) {
    if (doc === null){
      var user = new User();
      user.rollNumber = data.rollNumber;
      user.department = data.department;
      user.name = data.name;
      user.hardCopyRequested = false;
      user.photoName = "profilepic_temp.jpg";
      user.save().then(function (doc) {
        console.log("User Created:", doc.rollNumber);
        callback(null, doc);
      }).catch(function (err){
        callback(err);
      });
    }else if (typeof data.lastLogin !== 'undefined'){
      doc.lastLogin = data.lastLogin;
      doc.save().then(function (doc) {
        callback(null, doc);
      }).catch(function (err) {
        callback(err);
      });
      console.log("User Exists, Last Login Updated", doc.rollNumber);
    }else{
      console.log("User Exists", doc.rollNumber);
    }
  }).catch(function(err){
    console.log(err);
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

var fuzzySearch = function (search, department, isPg, callback) {
  User.find({
    department:department,
    rollNumber: isPg ? /^2/ : /^1/,
  }).then(function(users){
    var options={
      keys:['rollNumber','name','email']
    };
    var f = new fuse(users, options);
    var results = f.search(search);
    callback(null,results);
  });
};

var getAllUsers = function () {
  return User.find({});
};
var getAllFinalYearUsers = function(){
//  var pattern = /....1[12].../;
  var pattern = /....12.../;
  return User.find({rollNumber:pattern}).sort({rollNumber:'asc'}).exec();
};

module.exports.getUserByRollNumber = getUserByRollNumber;
module.exports.updateProfile = updateProfile;
module.exports.updatePhotoName = updatePhotoName;
module.exports.fuzzySearch = fuzzySearch;
module.exports.createProfile = createProfile;
module.exports.getAllUsers = getAllUsers;
module.exports.getAllFinalYearUsers = getAllFinalYearUsers;
