import Vue from 'vue';
import Backbone from 'backbone';

Vue.config.debug = true;

var RemBook = require('./models/RemBook');
var ProfilePageComponent = require('./components/ProfilePageComponent');
var RemsComponent = require('./components/RemsComponent');
var RemBookRouter = null;

function goLeft() {
	if(RemBook.currentRemPage >= 2) {
		safelyTurnPageTo(RemBook.currentRemPage - 1);
	}
	else {
		$('.rem-bookblock').bookblock( 'prev' );
	}
}

function goRight() {
	if(RemBook.currentRemPage <= RemBook.currentRemBookOf.Rems.models.length) {
		safelyTurnPageTo(RemBook.currentRemPage + 1);
	}
	else {
		$('.rem-bookblock').bookblock( 'next' );
	}
}

function safelyTurnPageTo(page) {
	// a very dirty hack below.
	// Changed the bookblock plugin to
	// throw an error saying "RemBook Hack: BookBlock currently animating"
	// whenever it is currently animating and we command it 
	// to jump. This is required because BookBlock ignores any commands
	// given to it while it is animating, and we need to know 
	// when it ignores that, so that we don't update the 
	// current window location.
	try {
		RemBook.loadRemPage(RemBook.currentRemBookOf.attributes.rollNumber, page);
	}
	catch(e) {
		if(/hack/i.test(e.message))
			return;
	}
	if(page == 1) {
		RemBookRouter.navigate(RemBook.currentRemBookOf.attributes.rollNumber + "/profile/");
	}
	else {
		RemBookRouter.navigate(RemBook.currentRemBookOf.attributes.rollNumber + "/rems/" + (page-1));
	}
}

function restartBookBlock() {
	var Page = (function() {

		var config = {
			$bookBlock : $( '.rem-bookblock' )
		},
		init = function() {
			config.$bookBlock.bookblock( {
				speed : 1000,
				shadowSides : 0.8,
				shadowFlip : 0.5
			} );
			initEvents();
		},
		initEvents = function() {

			var $slides = config.$bookBlock.children();

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
				if(e.target != document.body) return true;
				var keyCode = e.keyCode || e.which;

				var arrow = {
					left : 37,
					up : 38,
					right : 39,
					down : 40
				};

				switch (keyCode) {
					case arrow.left:
					goLeft();
					break;
					case arrow.right:
					goRight();
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

function onChangeBook() {
	new ProfilePageComponent({
		el: '#profile-page-mount-point',
		data: {
			profile: RemBook.currentRemBookOf.Profile.attributes,
			bio: RemBook.currentRemBookOf.Bio.attributes
		}
	});

	RemBook.currentRemBookOf.Rems.on('update', renderRems)
	renderRems();
}

function onChangeRemPage() {
	$(".rem-bookblock").bookblock('jump', RemBook.currentRemPage);
}

RemBook.on('changeRemBook', onChangeBook);
RemBook.on('changeRemPage', onChangeRemPage);


var _RemBookRouter = Backbone.Router.extend({
	routes: {
		"(/)": "root",
		"login(/)": "root",
		":rollNumber/profile(/)": "profile",
		":rollNumber/rems(/)": "rems",
		":rollNumber/rems/:page(/)": "rems",
		":rollNumber/rems/write(/)": "writeRem",
		"*path": "root"
	},
	"root": function root() {
		this.navigate(RemBook.currentUser.attributes.rollNumber + "/profile/", { trigger: true });
	},
	"profile": function profile(rollNumber) {
		safelyTurnPageTo(1);
	},
	"rems": function rems(rollNumber, page) {
		page = parseInt(page || 2);
		page = page > 1 ? page : 2;

		safelyTurnPageTo(page);
	},
	"writeRem": function writeRem(rollNumber) {
		alert("Screw you");
	}
});

RemBookRouter = new _RemBookRouter();

Backbone.history.start();
//onChangeBook();