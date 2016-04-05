var Backbone = require('backbone');

var defaults = {
	rollNumber: '',
	responses: []
};

for(var key of Object.keys(__RemBookInit__.questions)) {
	var question = __RemBookInit__.questions[key];
	defaults.responses.push({ 
		_id: question._id,
		title: question.title, 
		description: question.descriptiion, 
		bio_description: question.bio_description, 
		response: '' 
	});
}

var Bio = Backbone.Model.extend({
	idAttribute: "rollNumber",
	urlRoot: "/bio",
	defaults: defaults,
	parse: function(response) {
		if(response.success == 0) return {};
		response.rollNumber = response.user;
		delete response.user;
		return response;
	}
});

module.exports = Bio;