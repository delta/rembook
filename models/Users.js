var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  name : String,
  rollno : {type : Number, index: {unique:true}},
  image : String,
  branch : String,
  year : String,
  isfinalyear : Boolean,
  batch : String,
  gender : String,
  dob : Date,
  myrem : {type : mongoose.Schema.Types.ObjectId, ref : 'Rem'},
  rems : [{type : mongoose.Schema.Types.ObjectId, ref : 'Rem'}]
});

var User = mongoose.model('User', UsersSchema);

module.exports.getUserByRollno = function (rollno, next) {
  User.findOne({rollno : rollno}, function (err, doc) {
    next(err,doc);
  });
};

module.exports.createUser = function (userData, next) {
  var user = new User(userData);
  user.save(function (err, doc) {
    next(err, doc);
  });
};

module.exports.updateUser = function (rollno, update, next){
  var conditions = { rollno: rollno };
  var options = { multi: false };
  User.update(conditions, update , options, next);
 };
