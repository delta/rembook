var Backbone = require('backbone');
var User = require('./User');
var Notifications = require('./Notifications');

var currentUser = new User({
	name: __RemBookInit__.name,
	rollNumber: __RemBookInit__.rollNumber,
	department: __RemBookInit__.department,
}); 

currentUser.fetch({
	success: function() {
		console.log(currentUser.Profile.attributes);
		console.log(currentUser.Bio.attributes);
		console.log(currentUser.Rems.models);
	}
});

var RemBook = {
	currentUser: currentUser,
	currentRemBookOf: currentUser,
	departmentCodeMap: __RemBookInit__.departmentCodes,
	questionMap: __RemBookInit__.questions,
	notifications: new Notifications(__RemBookInit__.notifications),
	hardCopyRequested: __RemBookInit__.hardCopyRequested
};

module.exports = RemBook;