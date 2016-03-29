var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
  user:       String,
  message:    String,
  read:       Boolean,
  createdAt:  {type: Date, default: Date.now}
});

var Notification = mongoose.model('Notification', notificationSchema);

var notify = function (rollNumber, message, callback) {
  var notification = new Notification();
  notification.user = rollNumber;
  notification.message = message;
  notification.read = false;
  notification.save().then(function (doc) {
    callback(null, doc);
  }).catch(function (err) {
    console.log(err);
    callback(err);
  });
};

var getAllNotificationTo = function (rollNumber) {
  return Notification.find({user: rollNumber}).exec();
};

var readNotification = function (id, callback) {
  var _id = mongoose.Types.ObjectId(id);
  Notification.findOne({_id:_id}).then(function (doc) {
    doc.read = true;
    doc.save().then(function (doc) {
      callback(null, doc);
    }).catch(function (err) {
      callback(err);
    });
  });
};

module.exports.notify = notify;
module.exports.getAllNotificationTo = getAllNotificationTo;
module.readNotification = readNotification;
