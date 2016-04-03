var Backbone = require('backbone');

var Profile = Backbone.Model.extend({
	idAttribute: "rollNumber",
	urlRoot: "profile",
	defaults: {
		name:               "Name not available",
		rollNumber:         "Roll number not available",
		email:              "Email not available",
		contact:            "Contact not available",
		address:            "Address not available",
		hostels:          	['Hostel not available'],
		dob:                "N/A",
		department:         "Department not available",
		photoName:          "temp.png",
		hardCopyRequested:  false
	}
});

module.exports = Profile;