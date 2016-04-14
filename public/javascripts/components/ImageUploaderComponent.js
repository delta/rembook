import Vue from 'vue'

var ImageUploaderComponent = Vue.extend({
	template: require('../../templates/ImageUploaderComponent.tmpl')
});

Vue.component('image-uploader-component', ImageUploaderComponent);
module.exports = ImageUploaderComponent;
