import Vue from 'vue'

var NavComponent = Vue.extend({
    template: require('../../templates/NavComponent.tmpl'),
    computed: {
    	finalYear: function() {
		var x = this.rollNumber;
    		return parseInt(x.substr(3,3)) + 1900 <= (new Date()).getFullYear() - 4;
    	},
    	isProfilePage: function() {
    		return this.RemBook.currentRemPage == 1;
    	},
    	isRemPage: function() {
    		return this.RemBook.currentRemPage > 1;
    	},
	self: function() {
		return this.RemBook.currentUser.Profile.attributes.rollNumber == this.RemBook.currentRemBookOf.Profile.attributes.rollNumber;
	}
    },
});

Vue.component('nav-component', NavComponent);

module.exports = NavComponent;
