import Vue from 'vue';

Vue.config.debug = true;

var RemBook = require('./models/RemBook');
var ProfilePageComponent = require('./components/ProfilePageComponent');
var RemsComponent = require('./components/RemsComponent');

new ProfilePageComponent({
	el: '#profile-page-mount-point',
	data: {
		profile: RemBook.currentRemBookOf.Profile.attributes,
		bio: RemBook.currentRemBookOf.Bio.attributes
	}
});

function restartBookBlock() {
	var Page = (function() {

		var config = {
			$bookBlock : $( '.rem-bookblock' ),
			$navNext : $( '#bb-nav-next' ),
			$navPrev : $( '#bb-nav-prev' ),
			$navFirst : $( '#bb-nav-first' ),
			$navLast : $( '#bb-nav-last' )
		},
		init = function() {
			config.$bookBlock.bookblock( {
				speed : 1250,
				shadowSides : 0.8,
				shadowFlip : 0.5
			} );
			initEvents();
		},
		initEvents = function() {

			var $slides = config.$bookBlock.children();

			// add navigation events
			config.$navNext.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'next' );
				return false;
			} );

			config.$navPrev.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'prev' );
				return false;
			} );

			config.$navFirst.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'first' );
				return false;
			} );

			config.$navLast.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'last' );
				return false;
			} );

			// add swipe events
			$slides.on( {
				'swipeleft' : function( event ) {
					config.$bookBlock.bookblock( 'next' );
					return false;
				},
				'swiperight' : function( event ) {
					config.$bookBlock.bookblock( 'prev' );
					return false;
				}
			} );

			// add keyboard events
			$( document ).keydown( function(e) {
				var keyCode = e.keyCode || e.which,
				arrow = {
					left : 37,
					up : 38,
					right : 39,
					down : 40
				};

				switch (keyCode) {
					case arrow.left:
					config.$bookBlock.bookblock( 'prev' );
					break;
					case arrow.right:
					config.$bookBlock.bookblock( 'next' );
					break;
				}
			});
		};

		return { init : init };
	})();
	Page.init();
}

function renderRems() {
	var m = RemBook.currentRemBookOf.Rems.models.map((r) => r.attributes);

	$(".rem-component").remove();
	$("#profile-page-mount-point").after("<div id='rems-component-mount-point'><rems-component></rems-component></div>");

	new RemsComponent({
		el: '#rems-component-mount-point',
		data: {
			rems: m
		}
	});

	restartBookBlock();
}
RemBook.currentRemBookOf.Rems.on('update', renderRems)
renderRems();
