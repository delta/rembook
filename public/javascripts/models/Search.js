var Backbone = require('backbone');

var defaultParams = {
	query: '',
	department: undefined
};

var Search = Backbone.Collection.extend({
	params: defaultParams,
	sort: false,
	modelId: function(attr) {
		return attr.rollNumber;
	},
	parse: function(response) {
		if(response.success == 0) return [];
		return response.users.filter(function(s) {	
			var rollNumber = "" + s.rollNumber;
			return (parseInt(rollNumber.substr(3,3)) + 1900 == (new Date()).getFullYear() - 4);
		});
	},
	url: function() {
		var s = "/search?q=" + this.params.query;
		if(this.params.department)
			s += "&department=" + this.params.department;
		return s;
	},
	setQuery: function(q) {
		this.params.query = q;
		this.fetch({reset:true});
	},
	setDepartment: function(d) {
		this.params.department = d;
		this.fetch({reset:true});
	}
});

module.exports = Search;
