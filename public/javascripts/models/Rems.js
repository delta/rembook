var Backbone = require('backbone');
var Rem = require('./Rem');

var Rems = Backbone.Collection.extend({
	initialize: function(models, options) {
		this.rollNumber = options.rollNumber;
	},
	url: function() {
		return "/rem/" + this.rollNumber;
	},
	model: Rem,
	parse: function(response) {
		if(response.success == 0) return [];
		return response;
	}
});

module.exports = Rems;