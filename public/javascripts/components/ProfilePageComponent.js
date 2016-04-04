import Vue from 'vue'

var ProfilePageComponent = Vue.extend({
    template: require('../../templates/ProfilePageComponent.tmpl')
});

Vue.component('profile-page', ProfilePageComponent);

module.exports = ProfilePageComponent;