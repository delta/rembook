import Vue from 'vue'

var ProfilePageComponent = Vue.extend({
    template: require('../../templates/ProfilePageComponent.tmpl'),
    computed: {
        _isEditable_: function() {
            return this.profile.lastLogin !== undefined;
        }
    }
});

Vue.component('profilepage-component', ProfilePageComponent);
Vue.filter('formatDateForInputEl', function(val) {
	if(!val) return "";
	val = new Date(val);
	var year = val.getFullYear() + "";
	var month = (1 + val.getMonth()) + "";
	var date = val.getDate() + "";

	if(month.length < 2) month = "0" + month;
	if(date.length < 2) date = "0" + date;
	return year + "-" + month + "-" + date;
});

module.exports = ProfilePageComponent;