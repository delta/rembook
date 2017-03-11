import Vue from 'vue'
var ConditionallyEditableComponent = require('./ConditionallyEditableComponent');
var autosize = require('../autosize');

var ConditionallyEditableTextAreaComponent = ConditionallyEditableComponent.extend({
	template: require('../../templates/ConditionallyEditableTextAreaComponent.tmpl'),
	activate: function(done) {
		autosize($(this.$el).find('textarea'));
        $(this.$el).find('.character-limit').text("Only first 500 characters will be used for printing")
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
        updateCharLimit() {
            var left = Math.max(0, 500 - $(this.$el).find('._real_').val().length);
            var msg = "";

            if(left != 0) {
                msg = left + " characters left for printing";
            } else {
                var text = $(this.$el).find('._real_').val()
                var hint = text.substr(490, 10)
                msg = "Only first 500 characters (upto '" + hint + "') will be used for printing";
            }
            $(this.$el).find('.character-limit').text(msg);
        },
	oninput(e) {
		this.$set('data', $(this.$el).find('._real_').val());
		var that = this;
		this.$dispatch('input', {
			DOMEvent: e,
			dataId: that.dataId,
			newValue: that.data
		});
        this.updateCharLimit();
	},
    	onchange(e) {
    		var that = this;
    		this.$set('data', $(this.$el).find('._real_').val());
    		this.$dispatch('change', {
    			DOMEvent: e,
    			dataId: that.dataId,
    			newValue: that.data
    		});
            this.updateCharLimit();
    	}
    }
});

Vue.component('conditionally-editable-text-area-component', ConditionallyEditableTextAreaComponent);

module.exports = ConditionallyEditableTextAreaComponent;
