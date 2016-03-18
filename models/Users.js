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

var getUserByRollno = function (rollno, next) {
  User.findOne({rollno : rollno}, function (err, doc) {
    if (err) {
      // console.log("Error:",JSON.stringify(err));
      next(err);
      return;
    }
    if (!doc){
      var error = {
        name:"Not Found",
      };
      next(error);
    }
    if (doc){
      next(null,doc);
    }
  });
};

var createUser = function (userData, next) {
  var user = new User(userData);
  user.save(function (err, doc) {
    if (err) {
      // console.log("Error:",JSON.stringify(err));
      return next(err);
    }
    if (doc){
      next(null,doc);
    }
  });
};

var updateUser = function (rollno, update, next){
  getUserByRollno(rollno, function (err, doc) {
    if (err){
      next(err);
    }
    if (doc){
      var condition = {rollno:rollno};
      var options = { multi: false };
      var callback = function(err, NumAffectedRows){
        getUserByRollno(rollno,function (err,updatedUser) {
          next(err,updatedUser);
        });
      };
      User.update(condition, update, options, callback);
    }
  });
};

module.exports.getUserByRollno = getUserByRollno;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
