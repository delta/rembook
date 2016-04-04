import Vue from 'vue';
import Backbone from 'backbone';

Vue.config.debug = true;

var RemBook = require('./models/RemBook');
var ProfilePageComponent = require('./components/ProfilePageComponent');
var RemsComponent = require('./components/RemsComponent');
var RemBookRouter = null;
var $bookBlock = null;
var bookBlock = null;
var keyboardEventsHandlerRegistered = false;

function goLeft() {
	if(RemBook.currentRemPage >= 2) {
		safelyTurnPageTo(RemBook.currentRemBookOf.attributes.rollNumber, RemBook.currentRemPage - 1);
	}
	else {
		$('.rem-bookblock').bookblock( 'prev' );
	}
}

function goRight() {
	if(RemBook.currentRemPage <= RemBook.currentRemBookOf.Rems.models.length) {
		safelyTurnPageTo(RemBook.currentRemBookOf.attributes.rollNumber, RemBook.currentRemPage + 1);
	}
	else {
		$('.rem-bookblock').bookblock( 'next' );
	}
}

function safelyTurnPageTo(rollNumber, page) {
	if (!bookBlock || bookBlock.bookblock('isActive'))
		return setTimeout(function() {
			safelyTurnPageTo(rollNumber, page)
		}, 500);

	RemBook.loadRemPage(rollNumber, page);
	if(page == 1) {
		RemBookRouter.navigate(rollNumber + "/profile/");
	}
	else {
		RemBookRouter.navigate(RemBook.currentRemBookOf.attributes.rollNumber + "/rems/" + (page-1));
	}
}

function bookBlockKeyHandler(e) {
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
}

function restartBookBlock() {
	$bookBlock = $( '.rem-bookblock' );
	var init = function() {
		bookBlock = $bookBlock.bookblock({
			speed : 1000,
			shadowSides : 0.8,
			shadowFlip : 0.5
		});
		initEvents();
	};
	var initEvents = function() {
		var $slides = $bookBlock.children();
			// add swipe events
		$slides.on( {
			'swipeleft' : function( event ) {
				$bookBlock.bookblock( 'next' );
				return false;
			},
			'swiperight' : function( event ) {
				$bookBlock.bookblock( 'prev' );
				return false;
			}
		} );

		// add keyboard events
		if(!keyboardEventsHandlerRegistered) {
			keyboardEventsHandlerRegistered = true;
			$( document ).keydown( bookBlockKeyHandler );
		}
	};
	
	init();
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
		safelyTurnPageTo(rollNumber, 1);
	},
	"rems": function rems(rollNumber, page) {
		page = parseInt(page || 1);
		page = page > 1 ? (page+1) : 2;

		safelyTurnPageTo(rollNumber, page);
	},
	"writeRem": function writeRem(rollNumber) {
		alert("Screw you");
	}
});

RemBookRouter = new _RemBookRouter();

restartBookBlock();
Backbone.history.start();