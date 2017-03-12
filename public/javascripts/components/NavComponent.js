import Vue from 'vue'

var isFinalYear = require("../models/RemBook.js").isFinalYear;

var NavComponent = Vue.extend({
    template: require('../../templates/NavComponent.tmpl'),
    computed: {
    	finalYear: function() {
            return isFinalYear(this.RemBook.currentRemBookOf.Profile.attributes.rollNumber);
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
