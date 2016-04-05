import Vue from 'vue'

var SearchResultsComponent = Vue.extend({
	template: require('../../templates/SearchResultsComponent.tmpl'),
	methods: {
		init: function() {
			if(!this._inited_) {
				this._inited_ = true;
				$(this.$el).find('.dropdown').dropdown();
			}
		}
	}
});

module.exports = SearchResultsComponent;