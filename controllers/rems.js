var Rem = require('../models/Rems');
var Notification = require('../models/Notifications');

var getAllRemsTo = function (req, res, next) {
  var rollNumber = req.params.rollNumber;
  var requestedBy = req.session.rollNumber;
  Rem.getAllRemsTo(rollNumber).then(function (doc) {
    var response = {};
    if (doc.length === 0){
      response.success = 0;
      response.message = "No Rems Found";
      res.json(response);
    }else{
      var rems =[];
      var i;
      for (i=0;i<doc.length;i++){
        var rem = {};
        rem.id = doc[i].id;
        rem.to = doc[i].to;
        rem.from = doc[i].from;
        rem.responses = doc[i].responses;
        if (rollNumber === requestedBy){
          rem.approved = doc[i].approved;
          rem.print = doc[i].print;
        }
        rems.push(rem);
      }
      response.rems = rems;
      res.json(rems);
    }
  }).catch(function(err){
    console.log(err);
    next(err);
  });
};

var updateRem = function(req, res, next){
  var from = req.session.rollNumber;
  var fromName = req.session.rollNumber; //TO change later
  var to = req.params.rollNumber;
  var data = JSON.parse(req.body.responses);
  var callback = function (err, doc) {
    var response={};
    if (err){
      next(err);
    }else{
      var notificationCallback = function (err, doc) {
        console.log(JSON.stringify(doc));
      };
      var message = fromName +" wrote a rem about you";
      Notification.notify(to, message, notificationCallback);
      response.success = 1;
      response.message = "";
      res.json(response);
    }
  };
  Rem.updateRem(from, to, data, callback);
};

var approveRem = function(req, res, next){
  var id = req.params.id;
  var requestedBy = req.session.rollNumber;
  var callback = function (err, doc) {
    var response={};
    if (err){
      if(err.error === "permissionError"){
        response.success = 0;
        response.message = "You do not have permission to Change this";
        res.send(response);
      }else {
        next(err);
      }
    }else{
      response.success = 1;
      response.message = "";
      res.json(response);
    }
  };
  if (typeof req.body.approved !== 'undefined') {
    var approved = req.body.approved;
    Rem.approveRemForDisplay(id, requestedBy, approved, callback);
  }else if (typeof req.body.print !== 'undefined'){
    var print = req.body.print;
    Rem.approveRemForPrint(id, requestedBy, print, callback);
  }
};

module.exports.getAllRemsTo = getAllRemsTo;
module.exports.updateRem = updateRem;
module.exports.approveRem = approveRem;
