import Vue from 'vue'

var NavComponent = Vue.extend({
    template: require('../../templates/NavComponent.tmpl'),
    computed: {
    	finalYear: function() {
    		return parseInt(this.rollNumber.substr(3,3)) + 1900 <= (new Date()).getFullYear() - 4;
    	}
    }
});

Vue.component('nav-component', NavComponent);

module.exports = NavComponent;