var Backbone = require('backbone');
var Notification = require('./Notification');

var Notifications = Backbone.Collection.extend({
	urlRoot: "/notifications",
});

module.exports = Notifications;