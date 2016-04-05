import Vue from 'vue';
import Backbone from 'backbone';

Vue.config.debug = true;

var RemBook = require('./models/RemBook');
var ProfilePageComponent = require('./components/ProfilePageComponent');
var RemsComponent = require('./components/RemsComponent');
var ConditionallyEditableComponent = require('./components/ConditionallyEditableComponent');
var ConditionallyEditableTextAreaComponent = require('./components/ConditionallyEditableTextAreaComponent');
var NavComponent = require('./components/NavComponent');
var SearchControlComponent = require('./components/SearchControlComponent');
var SearchResultsComponent = require('./components/SearchResultsComponent');

var RemBookRouter = null;
var $bookBlock = null;
var bookBlock = null;
var keyboardEventsHandlerRegistered = false;
var navComponent = null;
var searchControlComponent = null;
var searchResultsComponent = null;

function goLeft() {
	if(RemBook.currentRemPage >= 2) {
		safelyTurnPageTo(RemBook.currentRemBookOf.attributes.rollNumber, RemBook.currentRemPage - 1);
	}
	else {
		// just to give the 'no-more-pages' flip effect
		$('.rem-bookblock').bookblock( 'prev' );
	}
}

function goRight() {
	if(RemBook.currentRemPage <= RemBook.currentRemBookOf.Rems.models.length) {
		safelyTurnPageTo(RemBook.currentRemBookOf.attributes.rollNumber, RemBook.currentRemPage + 1);
	}
	else {
		// just to give the 'no-more-pages' flip effect
		$('.rem-bookblock').bookblock( 'next' );
	}
}

function safelyTurnPageTo(rollNumber, page) {
	if (!bookBlock || bookBlock.bookblock('isActive'))
		return ;/*setTimeout(function() {
			safelyTurnPageTo(rollNumber, page)
		}, 400);*/

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
			speed : 800,
			shadowSides : 0.8,
			shadowFlip : 0.5
		});
		initEvents();
	};
	var initEvents = function() {
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

function updateNav() {
	navComponent.$set('rollNumber', RemBook.currentRemBookOf.Profile.attributes.rollNumber);
	navComponent.$set('currentPage', RemBook.currentRemPage);
}

function onChangeBook() {
	function changeBio(e) {
		var questionId = e.dataId.match(/\#(.+)/)[1];
		var responses = RemBook.currentRemBookOf.Bio.attributes.responses;
		for(var [i,q] of responses.entries()) {
			if(questionId == q._id) {
				responses[i].response = e.newValue;
			}
		}
		RemBook.currentRemBookOf.Bio.save({
			responses: responses
		});
	}

	function changeRegularProfile(e) {
		RemBook.currentRemBookOf.Profile.set(e.dataId, e.newValue);
		RemBook.currentRemBookOf.Profile.save();
	}

	function changeHostel(e) {
		var hostelId = parseInt(e.dataId.match(/\#(.+)/)[1]);
		var hostels = RemBook.currentRemBookOf.Profile.attributes.hostels;
		hostels[hostelId] = e.newValue;
		RemBook.currentRemBookOf.Profile.set('hostels', hostels);
		RemBook.currentRemBookOf.Profile.save();
	}

	new ProfilePageComponent({
		el: '#profile-page-mount-point',
		data: {
			profile: RemBook.currentRemBookOf.Profile.attributes,
			bio: RemBook.currentRemBookOf.Bio.attributes,
			questionMap: __RemBookInit__.questions
		},
		events: {
			change: function(e) {
				if(/hostel\#/i.test(e.dataId))
					changeHostel(e);
				else if(/question\#/.test(e.dataId))
					changeBio(e);
				else
					changeRegularProfile(e);
			}
		}
	});

	updateNav();
	RemBook.currentRemBookOf.Rems.on('update', renderRems)
	renderRems();
}

function onChangeRemPage() {
	updateNav();
	$(".rem-bookblock").bookblock('jump', RemBook.currentRemPage);
}

RemBook.on('changeRemBook', onChangeBook);
RemBook.on('changeRemPage', onChangeRemPage);

var _RemBookRouter = Backbone.Router.extend({
	routes: {
		"(/)": "root",
		"login(/)": "root",
		":rollNumber(/)": "profile",
		":rollNumber/profile(/)": "profile",
		":rollNumber/rems(/)": "rems",
		":rollNumber/rems/:page(/)": "rems",
		":rollNumber/rems/write(/)": "writeRem",
		"*path": "root"
	},
	"root": function root() {
		searchResultsComponent.onclose();
		this.navigate(RemBook.currentUser.attributes.rollNumber + "/profile/", { trigger: true, replace: true });
	},
	"profile": function profile(rollNumber) {
		searchResultsComponent.onclose();
		this.navigate(rollNumber + "/rollNumber", { replace: true});
		safelyTurnPageTo(rollNumber, 1);
	},
	"rems": function rems(rollNumber, page) {
		searchResultsComponent.onclose();
		page = parseInt(page || 1);
		page = page > 1 ? (page+1) : 2;

		safelyTurnPageTo(rollNumber, page);
	},
	"writeRem": function writeRem(rollNumber) {
		searchResultsComponent.onclose();
		alert("Screw you");
	}
});

RemBookRouter = new _RemBookRouter();

navComponent = new NavComponent({
	el: '#nav-component-mount-point',
	data: {
		rollNumber: '',
		currentPage: 1
	}
});

searchResultsComponent = new SearchResultsComponent({
	el: '#search-results-mount-point',
	methods: {
		_moreResults: function _moreResults() {
			this.results = RemBook.search.models;
		},
		show: function show() {
			$(this.$el).show();
			RemBook.search.on('update', this._moreResults);
		},
		onclose: function onclose() {
			$(this.$el).hide();
			RemBook.search.off('update', this._moreResults);
		},
		onchange: function onchange(e) {
			RemBook.search.setDepartment($(this.$el).find('input').val());
		}
	},
	data: {
		results: RemBook.search.models
	}
});

searchControlComponent = new SearchControlComponent({
	el: '#search-control-mount-point',
	methods: {
		onsearchfocus(e) {
			searchResultsComponent.show();
		},
		oninput(e) {
			if(this._isDebouncing_) return;
			else {
				this._isDebouncing_ = true;
				var that = this;
				setTimeout(function() {
					RemBook.search.setQuery($(that.$el).find('input').val());
					that._isDebouncing_ = false;
				}, 300);
			}
		}
	}
});

searchResultsComponent.init();
restartBookBlock();
Backbone.history.start();