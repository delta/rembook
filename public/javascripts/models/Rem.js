var Backbone = require('backbone');

var Rem = Backbone.Model.extend({
	idAttribute: "id",
	url: "/rem",
	defaults: {
		from: '',
		fromName: '',
		fromPhotoName: 'temp.png',
		to: '',
		toName: '',
		toPhotoName: 'temp.png',
		trivia: [],
		memories: '',
		pictureUrl: ''
	},
	initialize: function(attr) {
		var that = this;
		$.get('/profile/' + attr.from, function(user) {
			that.set('fromPhotoName', user.photoName);
		});
		$.get('/profile/' + attr.to, function(user) {
			that.set('toPhotoName', user.photoName);
		});
	},
	parse: function(obj) {
		var ret = obj;
		ret.trivia = [];
		for(var q of obj.responses) {
			if (/about/i.test(__RemBookInit__.questions[q.questionId].title)) {
				ret.memories = q.response;
			}
			else {
				ret.trivia.push({
					title: __RemBookInit__.questions[q.questionId].title,
					description: __RemBookInit__.questions[q.questionId].description,
					bio_description: __RemBookInit__.questions[q.questionId].bio_description,
					response: q.response
				});
			}
		}
		return ret;
	}
});

module.exports = Rem;