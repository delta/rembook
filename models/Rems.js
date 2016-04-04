var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var globalConfig = require('../config').config;


var remSchema = new Schema({
  from : String,
  fromName : String,
  to : String,
  toName : String,
  approved: Boolean,
  photoName: {type :String, default:""},
  print : Boolean,
  responses:  [{
                questionId:   Schema.Types.ObjectId,
                response:     String,
              }]
});

var maxRemsForPrint = globalConfig.maxRemsForPrint;

var Rem = mongoose.model('Rem', remSchema);

var getAllRemsTo = function (rollNumber) {
  return Rem.find({to:rollNumber});
};

var updateRem = function (data, callback) {
  var to = data.to;
  var from = data.from;
  var toName = data.toName;
  var fromName = data.fromName;
  Rem.findOne({to:to, from:from}).then(function (doc) {
    if (doc === null){
      doc = new Rem();
      doc.to = to;
      doc.from = from;
      doc.fromName = formName;
      doc.toName = toName;
    }
    doc.responses = data.responses;
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
     if (approved){
       Rem.find({to:requestedBy,print:true}).then(function(approvedRems){
         if (approvedRems.length < maxRemsForPrint){
           doc.print = approved;
           doc.save().then(function () {
             callback(null, doc);
           }).catch(function (err) {
             console.log(err);
             callback(err);
           });
         }else{
           var err = {
             error: "printLimitExceeded",
             message : "You can only approve " + maxRemsForPrint + " rems for printing",
           };
           callback(err);
         }
       }).catch(function(err){
         next(err);
       });
     }else{
       doc.print = approved;
       doc.save().then(function () {
         callback(null, doc);
       }).catch(function (err) {
         console.log(err);
         callback(err);
       });
     }

   }
 });
};

var getAllApprovedForPrintRems = function (rollNumber) {
  return Rem.find({print:true});
};

var updateRemPhoto = function (from, to, photoName, callback) {
  Rem.findOne({from : from, to : to}).then(function (doc) {
    doc.photoName = photoName;
    doc.save().then(function (doc) {
      callback(null, doc);
    }).catch(function (err){
      callback(err);
    });
  });
};

module.exports.getAllRemsTo = getAllRemsTo;
module.exports.updateRem = updateRem;
module.exports.approveRemForPrint = approveRemForPrint;
module.exports.approveRemForDisplay = approveRemForDisplay;
module.exports.getAllApprovedForPrintRem = getAllApprovedForPrintRems;
module.exports.updateRemPhoto = updateRemPhoto;
