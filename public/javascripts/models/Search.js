var Backbone = require('backbone');

var defaultParams = {
	query: 'a',
	department: undefined
};

var Search = Backbone.Collection.extend({
	params: defaultParams,
	modelId: function(attr) {
		return attr.rollNumber;
	},
	parse: function(response) {
		if(response.success == 0) return [];
		return response.users;
	},
	url: function() {
		var s = "/search?q=" + this.params.query;
		if(this.params.department)
			s += "&department=" + this.params.department;
		return s;
	},
	setQuery: function(q) {
		this.params.query = q;
		this.fetch();
	},
	setDepartment: function(d) {
		this.params.department = d;
		this.fetch();
	}
});

module.exports = Search;