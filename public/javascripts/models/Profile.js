var Backbone = require('backbone');

var Profile = Backbone.Model.extend({
	idAttribute: "rollNumber",
	urlRoot: "/profile",
	defaults: {
		name:               "Name not available",
		rollNumber:         "Roll number not available",
		email:              "",
		contact:            "",
		address:            "",
		hostels:          	['','','',''],
		dob:                "",
		department:         "",
		photoName:          "temp.png",
		hardCopyRequested:  false
	}
});

module.exports = Profile;