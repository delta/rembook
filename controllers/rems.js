var Rem = require('../models/Rems');
var Notification = require('../models/Notifications');
var fs = require('fs');
var easyimage = require('easyimage');

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
      var rem;
      for (i=0;i<doc.length;i++){
        rem = {};
        if ( (doc[i].approved !== true) && (rollNumber !== requestedBy)){
          continue;
        }else if (rollNumber === requestedBy){
          rem.approved = doc[i].approved;
          rem.print = doc[i].print;
        }
        rem.id = doc[i].id;
        rem.to = doc[i].to;
        rem.toName = doc[i].toName;
        rem.from = doc[i].from;
        rem.fromName = doc[i].fromName;
        rem.responses = doc[i].responses;
        rem.photoName = doc[i].photoName;
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
  var fromName = req.session.name;
  var to = req.params.rollNumber;
  var data = {};
  data.from = from;
  data.fromName = fromName;
  data.to = to;
  data.toName = req.body.toName;
  data.responses = JSON.parse(req.body.responses);
  var i = 0;
  var maxCharPerResonose = 1000;
  var isResonseValid = 1;
  for (i = 0; i< data.responses.length; i++){
    if (data.responses[i].response.length > maxCharPerResonose){
      isResonseValid = 0;
    }
  }
  if (isResonseValid){
    var callback = function (err, doc) {
      var response={};
      if (err){
        next(err);
      }else{
        var notificationCallback = function (err, doc) {
          if(err){
            // next(err);
          }else{
            // console.log(JSON.stringify(doc));
          }
        };
        var message = fromName +" wrote a rem about you";
        Notification.notify(to, message, notificationCallback);
        response.success = 1;
        response.message = "";
        res.json(response);
      }
    };
    Rem.updateRem(data, callback);
  }else {
    var response = {};
    response.success = 0;
    response.message = "Response is above Character Limit("+maxCharPerResonose+")";
    res.json(response);
  }
};

var uploadPic = function(req, res, next){
  var from = req.session.rollNumber;
  var fromName = req.session.name;
  var to = req.params.rollNumber;
  var ext = req.file.mimetype.split("/")[1];
  var fileType = req.file.mimetype.split("/")[0];
  var response = {};
  if (fileType !== "image"){
    fs.unlink(req.file.path, function(err,data){
      if (err){
        next(err);
      }else {
        response.success = 0;
        response.message = "Not a Image File";
        res.json(response);
      }
    });
  }else{
    var photoName = from + "_" + to + ".jpg";
    var finalPath = "./public/rempic/"+photoName;
    easyimage.convert({
      src:req.file.path,
      dst:finalPath,
      quality:100,
    })
    .then(function(file){
      fs.unlink(req.file.path,function(err){
        console.log(err);
      });
      var callback = function (err, doc) {
        if (err){
          next(err);
        }else {
          var notificationCallback = function (err, doc) {};
          var message = fromName +" uploaded a Photo";
          Notification.notify(to, message, notificationCallback);
          response.success = 1;
          response.message = "";
          res.json(response);
        }
      };
      Rem.updateRemPhoto(from, to, photoName, callback);
    })
    .catch(function(err){
      next(err);
    });
  }
};
var approveRem = function(req, res, next){
  var id = req.params.id;
  var requestedBy = req.session.rollNumber;
  var callback = function (err, doc) {
    var response={};
    if (err){
      if (err.error === "printLimitExceeded"){
        response.success = 0;
        response.message = err.message;
        res.json(response);
      } else if(err.error === "permissionError"){
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
    var approved = JSON.parse(req.body.approved);
    Rem.approveRemForDisplay(id, requestedBy, approved, callback);
  }else if (typeof req.body.print !== 'undefined'){
    var print = JSON.parse(req.body.print);
    console.log(print);
    Rem.approveRemForPrint(id, requestedBy, print, callback);
  }
};

module.exports.getAllRemsTo = getAllRemsTo;
module.exports.updateRem = updateRem;
module.exports.approveRem = approveRem;
module.exports.uploadPic = uploadPic;