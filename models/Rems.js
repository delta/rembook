var mongoose = require('mongoose');

var RemsSchema = new mongoose.Schema({
  from : {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  to : {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  isApproved : {type:Boolean, default:0},
  nicknames : String,
  words : String,
  features :String,
  about : String
});

mongoose.model('Rem', RemsSchema);
