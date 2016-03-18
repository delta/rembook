var mongoose = require('mongoose');
var Users = require("./Users");

var RemsSchema = new mongoose.Schema({
  from : Number,
  to : Number,
  isApproved : {type:Boolean, default:0},
  nicknames : String,
  words : String,
  features :String,
  about : String
});

var Rem = mongoose.model('Rem', RemsSchema);

var createRem = function (remData, next) {
  var rem = new Rem(remData);
  Users.getUserByRollno(rem.from,function (err, doc) {
    if (err) return next(err);
    if (doc){
      // console.log(rem.from,":",JSON.stringify(doc));
      Users.getUserByRollno(rem.to, function (err, doc) {
        if (err)return next(err);
        if (doc){
          // console.log(rem.to,":",JSON.stringify(doc));
          var rems = doc.rems;
          rem.save(function (err, doc) {
            if (err) return next(err);
            if (doc){
              var remFrom = doc.from;
              var remid = doc._id;
              var remTo = doc.to;
              if (remTo === remFrom){
                Users.updateUser(remTo, {myrem:remid}, function(err, updatedUser){
                  next(err,rem,updatedUser);
                });
              }else {
                rems.push(remid);
                Users.updateUser(remTo, {rems:rems}, function(err, updatedUser){
                  next(err,rem,updatedUser);
                });
              }
            }
          });
        }
      });
    }
  });
};

module.exports.createRem = createRem;
