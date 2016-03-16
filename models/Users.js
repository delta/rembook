var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  name : String,
  rollno : Number,
  image : String,
  branch : String,
  year : String,
  isfinalyear : Boolean,
  batch : String,
  gender : String,
  myrem : {type : mongoose.Schema.Types.ObjectId, ref : 'Rem'},
  rems : [{type : mongoose.Schema.Types.ObjectId, ref : 'Rem'}]
});

mongoose.model('User', UsersSchema);
