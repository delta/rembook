var Backbone = require('backbone');
var memoriesQID = "";
var defaults = {
	from: '',
	fromName: '',
	fromPhotoName: 'temp.png',
	to: '',
	toName: '',
	toPhotoName: 'temp.png',
	trivia: [],
	memories: '',
	pictureUrl: ''
};

for(var i of Object.keys(__RemBookInit__.questions)) {
	var q = __RemBookInit__.questions[i];
	if (/about/i.test(q.title)) {
		memoriesQID = q._id;
		defaults.memories = '';
	}
	else {
		defaults.trivia.push({
			_id: q._id,
			title: q.title,
			description: q.description,
			bio_description: q.bio_description,
			response: ''
		});
	}
}

var Rem = Backbone.Model.extend({
	idAttribute: "id",
	url: "/rem",
	defaults: defaults,
	initialize: function(attr) {
		this.set('fromPhotoName', attr.from + '.jpg');
		this.set('toPhotoName', attr.to + '.jpg');
	//	var that = this;
	//	$.get('/profile/' + attr.from, function(user) {
	//		that.set('fromPhotoName', user.photoName);
	//	});
	//	$.get('/profile/' + attr.to, function(user) {
	//		that.set('toPhotoName', user.photoName);
	//	});
	},
	parse: function(obj) {
		if(obj.success && obj.success == 1) return {};
		var ret = obj;
		ret.trivia = [];
		for(var q of obj.responses) {
			if (/about/i.test(__RemBookInit__.questions[q.questionId].title)) {
				ret.memories = q.response;
			}
			else {
				ret.trivia.push({
					_id: __RemBookInit__.questions[q.questionId]._id,
					title: __RemBookInit__.questions[q.questionId].title,
					description: __RemBookInit__.questions[q.questionId].description,
					bio_description: __RemBookInit__.questions[q.questionId].bio_description,
					response: q.response
				});
			}
		}
		return ret;
	},
	toJSON: function() {
		var o = this.attributes;
		return {
			from: o.from,
			fromName: o.fromName,
			to: o.to,
			toName: o.toName,
			responses: [{
				questionId: o.trivia[0]._id,
				response: o.trivia[0].response
			},{
				questionId: o.trivia[1]._id,
				response: o.trivia[1].response
			},{
				questionId: o.trivia[2]._id,
				response: o.trivia[2].response
			},{
				questionId: memoriesQID,
				response: o.memories
			}]
		}
	}
});

module.exports = Rem;
