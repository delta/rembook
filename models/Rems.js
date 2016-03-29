var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var remSchema = new Schema({
  from : String,
  to : String,
  approved: Boolean,
  print : Boolean,
  responses:  [{
                questionId:   Schema.Types.ObjectId,
                response:     String,
              }]
});

var Rem = mongoose.model('Rem', remSchema);

var getAllRemsTo = function (rollNumber) {
  return Rem.find({to:rollNumber});
};

var updateRem = function (from, to, data, callback) {
  Rem.findOne({to:to, from:from}).then(function (doc) {
    if (doc === null){
      doc = new Rem();
    }
    doc.responses = data;
    doc.save().then(function(){
      callback(null,doc);
    }).catch(function (err) {
      console.log(err);
      callback(err);
    });
  });
};

var approveRemForDisplay = function (id, requestedBy, approved,callback) {
 var _id = mongoose.Types.ObjectId(id);
 Rem.findOne({_id:_id}).then(function (doc) {
   if(requestedBy !== doc.to){
     var err={error:"permissionError"};
     callback(err);
   }else{
     doc.approved = approved;
     doc.save().then(function () {
       callback(null, doc);
     }).catch(function (err) {
       console.log(err);
       callback(err);
     });
   }
 });
};

var approveRemForPrint = function (id, requestedBy, approved,callback) {
 var _id = mongoose.Types.ObjectId(id);
 Rem.findOne({_id:_id}).then(function (doc) {
   if(requestedBy !== doc.to){
     var err={error:"permissionError"};
     callback(err);
   }else {
     doc.print = approved;
     doc.save().then(function () {
       callback(null, doc);
     }).catch(function (err) {
       console.log(err);
       callback(err);
     });
   }
 });
};

module.exports.getAllRemsTo = getAllRemsTo;
module.exports.updateRem = updateRem;
module.exports.approveRemForPrint = approveRemForPrint;
module.exports.approveRemForDisplay = approveRemForDisplay;
