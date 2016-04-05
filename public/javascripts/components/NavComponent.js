import Vue from 'vue'

var NavComponent = Vue.extend({
    template: require('../../templates/NavComponent.tmpl')
});

Vue.component('nav-component', NavComponent);

module.exports = NavComponent;