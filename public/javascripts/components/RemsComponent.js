import Vue from 'vue'

var RemsComponent = Vue.extend({
    template: require('../../templates/RemsComponent.tmpl')
});

Vue.component('rems-component', RemsComponent);

module.exports = RemsComponent;