var Backbone = require('backbone');
var Profile = require('./Profile');
var Bio = require('./Bio');
var Rems = require('./Rems');

var User = Backbone.Model.extend({
	idAttribute: "rollNumber",
	initialize: function(attr) {
		this.Profile = new Profile(attr);
		this.Bio = new Bio({ rollNumber: attr.rollNumber});
		this.Rems = new Rems(null, { rollNumber: attr.rollNumber });
	},
	fetch: function(options) {
		var that = this;
		(function() {
			var counter = 0;
			var error_raised = false;

			function _success(model, response, opt) {
				counter++;
				counter == 3 
					&& options 
					&& options.success 
					&& options.success(that);
			}
			function _error(model, response, opt) {
				!error_raised 
					&& options 
					&& options.error 
					&& options.error(that, response, opt) 
					&& (error_raised = true);
			}

			that.Profile.fetch({success: _success, error: _error});
			that.Bio.fetch({success: _success, error: _error});
			that.Rems.fetch({success: _success, error: _error});
		})();
	}
});

module.exports = User;