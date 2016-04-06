var path = require('path');

module.exports = {
	entry: './public/javascripts/main.js',
	resolve: {
		root: [
			path.resolve('./public/')
		]
	},
	cache: {},
	output: {
		path: './public/javascripts',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015']
			}
		}, {
			test: /\.tmpl$/,
			loader: 'raw'
		}]
	},
	externals: {
		'jquery': 'jQuery',
		'backbone': 'Backbone',
		'underscore': '_'
	}
}