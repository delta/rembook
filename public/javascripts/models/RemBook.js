var Backbone = require('backbone');
var _ = require('underscore');
var User = require('./User');
var Notifications = require('./Notifications');
var Search = require('./Search');

var _RemBookLoaded = false;
var currentUser = {};
var RemBook = {};

currentUser = new User({
	name: __RemBookInit__.name,
	rollNumber: __RemBookInit__.rollNumber,
	department: __RemBookInit__.department,
}); 

currentUser.fetch({
	success: function() {
		_RemBookLoaded = true;
	}
});

RemBook = {
	currentUser: currentUser,
	currentRemBookOf: null,
	currentRemPage: -1,
	departmentCodeMap: __RemBookInit__.departmentCodes,
	questionMap: __RemBookInit__.questions,
	notifications: new Notifications(__RemBookInit__.notifications),
	hardCopyRequested: __RemBookInit__.hardCopyRequested,
	search: new Search(),
	_usersCache_: {
		[currentUser.rollNumber]: currentUser
	},
	loadRemBook: function(rollNumber) {
		var that = this;
		if(this.currentRemBookOf && this.currentRemBookOf.attributes.rollNumber == rollNumber && _RemBookLoaded) return;
		if(this._usersCache_[rollNumber]) {
			this.currentRemBookOf = this._usersCache_[rollNumber];
			this.trigger("changeRemBook", this);
		}
		this.currentRemBookOf = new User({ rollNumber: rollNumber });
		this.currentRemBookOf.fetch({
			success: function() {
				that._usersCache_[rollNumber] = that.currentRemBookOf;
				that.trigger("changeRemBook", that);
			}
		});
	},
	loadRemPage: function(rollNumber, page) {
		var that = this;
		if(this.currentRemBookOf && this.currentRemBookOf.attributes.rollNumber == rollNumber && _RemBookLoaded) {
			if(this.currentRemPage == page) return;
			this.currentRemPage = page;
			this.trigger("changeRemPage", this);
		}
		else {
			this.loadRemBook(rollNumber);
			this.on('changeRemBook', function changeNotifier() {
				if(that.currentRemBookOf.attributes.rollNumber == rollNumber) {
					that.currentRemPage = page;
					that.trigger("changeRemPage", that);
					that.on('changeRemBook', changeNotifier);
				}
			});
		}
	}
};

_.extend(RemBook, Backbone.Events);

module.exports = RemBook;