import Vue from 'vue'

var WriteRemPageComponent = Vue.extend({
    template: require('../../templates/WriteRemPageComponent.tmpl'),
    computed: {
        
    }
});

Vue.component('write-rem-page-component', WriteRemPageComponent);

module.exports = WriteRemPageComponent;