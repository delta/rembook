import Vue from 'vue'

var ConditionallyEditableComponent = Vue.extend({
	props: [
		'data',
		'maxlength',
		'editable'
	],
    template: require('../../templates/ConditionallyEditableComponent.tmpl')
});

Vue.component('conditionally-editable', ConditionallyEditableComponent);

module.exports = ConditionallyEditableComponent;