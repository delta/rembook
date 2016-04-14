import Vue from 'vue'
var ConditionallyEditableComponent = require('./ConditionallyEditableComponent');
var autosize = require('../autosize');

var ConditionallyEditableTextAreaComponent = ConditionallyEditableComponent.extend({
	template: require('../../templates/ConditionallyEditableTextAreaComponent.tmpl'),
	activate: function(done) {
		autosize($(this.$el).find('textarea'));
		done();
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
		this.$dispatch('blur', {
			DOMEvent: e,
			dataId: that.dataId,
			newValue: that.data
		});
    	},
	oninput(e) {
		this.$set('data', $(this.$el).find('._real_').val());
		$(this.$el).find('.character-limit').text(this.limit - $(this.$el).find('._real_').val().length + " characters left");
		var that = this;
		this.$dispatch('input', {
			DOMEvent: e,
			dataId: that.dataId,
			newValue: that.data
		});
	},
    	onchange(e) {
    		var that = this;
    		this.$set('data', $(this.$el).find('._real_').val());
    		this.$dispatch('change', {
    			DOMEvent: e,
    			dataId: that.dataId,
    			newValue: that.data
    		});
    	}
    }
});

Vue.component('conditionally-editable-text-area-component', ConditionallyEditableTextAreaComponent);

module.exports = ConditionallyEditableTextAreaComponent;
