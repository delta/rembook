import Vue from 'vue'

var ConditionallyEditableComponent = Vue.extend({
	props: [
		'dataId',
		'data',
		'placeholder',
		'placeholderInput',
		'placeholderEmpty',
		'limit',
		'editable',
		'type',
		'characterCount'
	],
    template: require('../../templates/ConditionallyEditableComponent.tmpl'),
    computed: {
	
    },
    methods: {
    	onfocusdummy(e) {
    		$(e.target).hide();
    		$(this.$el).find("._real_").show().focus();
    	},
    	onblurreal(e) {
		$(e.target).hide();
    		$(this.$el).find("._dummy_").show();
		var that = this;
		that.$dispatch('blur', {
			DOMEvent: e,
			dataId: that.dataId,
			newValue: that.data
		});
    	},
    	onchange(e) {
    		var that = this;
    		this.$dispatch('change', {
    			DOMEvent: e,
    			dataId: that.dataId,
    			newValue: that.data
    		})
    	}
    }
});

Vue.component('conditionally-editable-component', ConditionallyEditableComponent);

module.exports = ConditionallyEditableComponent;
