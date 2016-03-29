var Notifications = require('../models/Notifications');

var getAllNotifications = function(req, res, next){
  var rollNumber = req.session.rollNumber;
  Notifications.getAllNotificationTo(rollNumber).then(function(doc){
    var response={};
    if (doc.length === 0){
      response.success = 1;
      response.message = "No Notifications";
      res.json(response);
    }else{
      response.success = 1;
      response.success = "";
      response.notifications = doc;
      res.json(response);
    }
  }).catch(function(err){
    next(err);
  });

};

module.exports.getAllNotifications = getAllNotifications;
