import Vue from 'vue'

var ProfilePageComponent = Vue.extend({
    template: require('../../templates/profile.tmpl')
});

Vue.component('profile-page', ProfilePageComponent);

module.exports = ProfilePageComponent;