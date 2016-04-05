import Vue from 'vue'

var ProfilePageComponent = Vue.extend({
    template: require('../../templates/ProfilePageComponent.tmpl'),
    computed: {
        _isEditable_: function() {
            return this.profile.lastLogin === null;
        }
    }
});

Vue.component('profilepage-component', ProfilePageComponent);

module.exports = ProfilePageComponent;