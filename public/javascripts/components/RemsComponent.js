import Vue from 'vue'

var RemsComponent = Vue.extend({
    template: require('../../templates/rems.tmpl')
});

Vue.component('rems-component', RemsComponent);

module.exports = RemsComponent;