import Vue from 'vue'

var ConditionallyEditableComponent = Vue.extend({
	props: [
		'dataId',
		'data',
		'placeholder',
		'placeholderInput',
		'placeholderEmpty',
		'maxlength',
		'editable',
		'type'
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
