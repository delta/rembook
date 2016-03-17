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

module.exports.createRem = function (remData, next) {
  var rem = new Rem(remData);
  rem.save(function (err, doc) {
    if(!err){
      var remFrom = doc.from;
      var remid = doc._id;
      var remTo = doc.to;
      if (remTo === remFrom){
        var update = {
          myrem : remid,
        };
        Users.updateUser(remTo, update, next);
      }else{
        Users.getUserByRollno(remTo, function (err, doc) {
          if(!err){
            var rems = doc.rems;
            rems.push(remid);
            var update = {
              rems : rems,
            };
            Users.updateUser(remTo, update, next);
          }
        });
      }
    }
  });
};
