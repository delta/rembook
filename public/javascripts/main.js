import Vue from 'vue';
import Backbone from 'backbone';

Vue.config.debug = true;

var RemBook = require('./models/RemBook');
var Rem = require('./models/Rem');

var ProfilePageComponent = require('./components/ProfilePageComponent');
var RemsComponent = require('./components/RemsComponent');
var WriteRemPageComponent = require('./components/WriteRemPageComponent');
var ConditionallyEditableComponent = require('./components/ConditionallyEditableComponent');
var ConditionallyEditableTextAreaComponent = require('./components/ConditionallyEditableTextAreaComponent');
var NavComponent = require('./components/NavComponent');
var SearchControlComponent = require('./components/SearchControlComponent');
var SearchResultsComponent = require('./components/SearchResultsComponent');
var ImageUploaderComponent = require('./components/ImageUploaderComponent');
var InstructionsComponent = require('./components/InstructionsComponent');

var RemBookRouter = null;
var $bookBlock = null;
var bookBlock = null;
var keyboardEventsHandlerRegistered = false;
var navComponent = null;
var searchControlComponent = null;
var searchResultsComponent = null;
var writeRemPageComponent = null;
var imageUploaderComponent = null;
var instructionsComponent = null;
var remsComponent = null;

Vue.filter('isFinalYear', function (str) {
	return RemBook.isFinalYear(str);
});

if (!localStorage.getItem('instructions')) {
	localStorage.setItem('instructions', true);
	window.location.href = "#instructions";
}

function displayLoader() {
	$("body").append("<div class='rem-loader' style='position:absolute;top:0;left:0;right:0;bottom:0;'><div class='ui active dimmer'><div class='ui loader'></div></div></div>").show();
}
function hideLoader() {
	$(".rem-loader").remove();
}
function displayError(msg) {
	$("<div class='ui basic modal'><div class='header'>Error</div><div class='content'><p>" + msg + "</p></div></div>").modal('show');
}

function goLeft() {
	if (RemBook.currentRemPage >= 2) {
		navigateToPage(RemBook.currentRemPage - 1);
	}
	else {
		// just to give the 'no-more-pages' flip effect
		$('.rem-bookblock').bookblock('prev');
	}
}

function goRight() {
	if (RemBook.currentRemPage <= RemBook.currentRemBookOf.Rems.models.length) {
		navigateToPage(RemBook.currentRemPage + 1);
	}
	else {
		// just to give the 'no-more-pages' flip effect
		$('.rem-bookblock').bookblock('next');
	}
}

// utility for goLeft and goRight
function navigateToPage(page) {
	var rollNumber = RemBook.currentRemBookOf.Profile.attributes.rollNumber;
	updateNav();
	if (page <= 1) {
		if (safelyTurnPageTo(rollNumber, page))
			RemBookRouter.navigate(rollNumber + "/profile");
	}
	else {
		if (safelyTurnPageTo(rollNumber, page))
			RemBookRouter.navigate(rollNumber + "/rems/" + (page - 1));
	}
}

function safelyTurnPageTo(rollNumber, page) {
	if (!bookBlock || bookBlock.bookblock('isActive'))
		return false;
	if (!RemBook.currentRemBookOf || RemBook.currentRemBookOf.attributes.rollNumber != rollNumber)
		displayLoader();
	RemBook.loadRemPage(rollNumber, page);
	return true;
}

function bookBlockKeyHandler(e) {
	if (e.target != document.body && e.target.tagName.toLowerCase() != 'a') return true;
	if (writeRemPageComponent.isopen || imageUploaderComponent.isopen || instructionsComponent.isopen || searchResultsComponent.isopen)
		return true;
	var keyCode = e.keyCode || e.which;
	var arrow = {
		left: 37,
		up: 38,
		right: 39,
		down: 40
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
	$bookBlock = $('.rem-bookblock');
	var init = function () {
		bookBlock = $bookBlock.bookblock({
			speed: 800,
			shadowSides: 0.8,
			shadowFlip: 0.5
		});
		initEvents();
	};
	var initEvents = function () {
		var $slides = $bookBlock.children();

		$slides.on({
			'swipeleft': function (event) {
				$bookBlock.bookblock('next');
				return false;
			},
			'swiperight': function (event) {
				$bookBlock.bookblock('prev');
				return false;
			}
		});
		// add keyboard events
		if (!keyboardEventsHandlerRegistered) {
			keyboardEventsHandlerRegistered = true;
			$(document).keydown(bookBlockKeyHandler);
		}
	};

	init();
}

function renderRems(all) {
	var m = RemBook.currentRemBookOf.Rems.models.map((r) => r.attributes);
	//	for(var i = 0; i < m.length; i++) {
	//		m._originalPhotoName_ = m.photoName;
	//		m.photoName = 'temp.png';
	//	}

	$(".rem-component").remove();
	$("#profile-page-mount-point").after("<div id='rems-component-mount-point'><rems-component></rems-component></div>");

	remsComponent = new RemsComponent({
		el: '#rems-component-mount-point',
		computed: {
			isFinalYear() {
				return RemBook.isFinalYear(this.RemBook.currentRemBookOf.attributes.rollNumber)
			},
			self() {
				return this.RemBook.currentRemBookOf.attributes.rollNumber == this.RemBook.currentUser.attributes.rollNumber;
			}
		},
		data: {
			rems: m,
			RemBook: RemBook
		},
		methods: {
			'togglePrint': function (e) {
				e.target.blur();
				var id = e.target.id.match(/print#(.+)$/)[1];
				var cur = this.rems.find((x) => { return x.id == id });
				var that = this;
				displayLoader();
				$.ajax({
					type: "POST",
					url: '/rem/approve/' + id,
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify({ print: !cur.print }),
					dataType: "json",
					success: function (returned) {
						hideLoader();
						if (returned.success == 0) {
							displayError(returned.message);
							return;
						}
						for (var i in that.rems) {
							if (that.rems[i].id == id) {
								var x = that.rems[i];
								x.print = !cur.print;
								that.rems.$set(i, x);
							}
						}
					},
					failure: function (error) {
						hideLoader();
						displayError("There seems to be a network error. Please retry.");
						console.log(error);
					}
				});
			},
			'toggleApprove': function (e) {
				var cur = this.rems.find((x) => { return x.id == e.target.id });
				var that = this;
				$.post('/rem/approve/' + e.target.id, { approved: !cur.approved }, function () {
					for (var i in that.rems) {
						if (that.rems[i].id == e.target.id) {
							var x = that.rems[i];
							x.approved = !cur.approved;
							that.rems.$set(i, x);
						}
					}
				});
			}
		}
	});

	$(".button").popup();
	restartBookBlock();
}

//function updateNav() {
//	navComponent.$set('rollNumber', RemBook.currentRemBookOf.Profile.attributes.rollNumber);
//	navComponent.$set('RemBook', RemBook);
//}

function lazyLoadImages() {
	for (var i = -1; i < 3; i++) {
		var curPage = RemBook.currentRemPage - 1 + i;
		if (curPage < 0) continue;
		var curRem = RemBook.currentRemBookOf.Rems.models[curPage];
		if (!curRem) break;
		curRem = curRem.attributes;
		var fromImgId = "#remFromPhoto_" + curRem.from;
		var remPicId = "#rempic_from" + curRem.from + "_to_" + curRem.to;

		var isFromLoaded = $(fromImgId).data("loaded");
		var isRemPicLoaded = $(remPicId).data("loaded");

		if (!isFromLoaded && curRem.fromPhotoName != 'temp.png') {
			$(fromImgId).attr("src", "/profilepic/" + curRem.fromPhotoName)
				.data("loaded", true);
		}

		if (!isRemPicLoaded && curRem.photoName) {
			$(remPicId).attr("src", "/rempics/" + curRem.photoName)
				.data("loaded", true);
		}
	}
}

function onChangeBook() {
	function changeBio(e) {
		var questionId = e.dataId.match(/\#(.+)/)[1];
		var responses = RemBook.currentRemBookOf.Bio.attributes.responses;
		for (var [i, q] of responses.entries()) {
			if (questionId == q._id) {
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
			change: function (e) {
				if (/hostel\#/i.test(e.dataId))
					changeHostel(e);
				else if (/question\#/.test(e.dataId))
					changeBio(e);
				else if (e.dataId != 'dob')
					changeRegularProfile(e);
			},
			blur: function (e) {
				if (e.dataId == "dob")
					changeRegularProfile(e);
			}
		},
		methods: {
			_onImageSave_() {
				var img = $(".profile-side img.dp")[0];
				img.src = "/profilepic/" + RemBook.currentUser.Profile.attributes.rollNumber + ".jpg?" + Math.random();
			},
			uploadImage(e) {
				var input = $(this.$el).find('input')[0];
				var that = this;
				if (input.files && input.files[0]) {
					var reader = new FileReader();
					reader.onload = function (e) {
						imageUploaderComponent.uploadFieldName = 'profilepic';
						imageUploaderComponent.uploadUrl = '/profilepic';
						imageUploaderComponent.saveCallback = that._onImageSave_;
						imageUploaderComponent.load(e, 1);
					}
					reader.readAsDataURL(input.files[0]);
				}
			},
			toggleHardCopy(e) {
				e.target.blur();
				var that = this;
				var curval = RemBook.currentUser.Profile.attributes.hardCopyRequested;
				displayLoader();
				RemBook.currentUser.Profile.save({ 'hardCopyRequested': !curval }, {
					success: function (model, res) {
						hideLoader();
						that.profile.hardCopyRequested = !curval;
						if (res.success == 0) {
							displayError(res.message);
							return;
						}
					},
					error: function () {
						displayError("There seems to be a network issue. Please retry.");
					},
					wait: true
				});
			}
		}
	});

	hideLoader();
	updateNav();
	RemBook.currentRemBookOf.Rems.on('update change', renderRems)
	renderRems();
}

function onChangeRemPage() {
	updateNav();
	lazyLoadImages();
	$(".rem-bookblock").bookblock('jump', RemBook.currentRemPage);
}

function renderWriteRemPage() {
	var tmpRem = new Rem({
		from: RemBook.currentUser.Profile.attributes.rollNumber,
		fromName: RemBook.currentUser.Profile.attributes.name,
		fromPhotoName: RemBook.currentUser.Profile.attributes.fromPhotoName,
		to: RemBook.currentRemBookOf.Profile.attributes.rollNumber,
		toName: RemBook.currentRemBookOf.Profile.attributes.name
	});

	var oldRem = RemBook.currentRemBookOf.Rems.findWhere({
		from: RemBook.currentUser.Profile.attributes.rollNumber
	});

	if (oldRem) {
		tmpRem = oldRem;
	}

	tmpRem = tmpRem.attributes;
	writeRemPageComponent.from = tmpRem.from;
	writeRemPageComponent.fromPhotoName = tmpRem.fromPhotoName;
	writeRemPageComponent.fromName = tmpRem.fromName;
	writeRemPageComponent.to = tmpRem.to;
	writeRemPageComponent.toName = tmpRem.toName;
	writeRemPageComponent.toPhotoName = tmpRem.toPhotoName;
	writeRemPageComponent.trivia = tmpRem.trivia;
	writeRemPageComponent.memories = tmpRem.memories;
	writeRemPageComponent.photoName = tmpRem.photoName;

	//createWriteRemPage();
	writeRemPageComponent.show();
}

RemBook.on('changeRemBook', onChangeBook);
RemBook.on('changeRemPage', onChangeRemPage);

var _RemBookRouter = Backbone.Router.extend({
	routes: {
		"(/)": "root",
		"login(/)": "root",
		"instructions": "instructions",
		":rollNumber(/)": "profile",
		":rollNumber/profile(/)": "profile",
		":rollNumber/rems(/)": "rems",
		":rollNumber/rems/write(/)": "writeRem",
		":rollNumber/rems/:page(/)": "rems",
		"*path": "root"
	},
	"root": function root() {
		searchResultsComponent.onclose();
		this.navigate(RemBook.currentUser.Profile.attributes.rollNumber + "/profile/", { trigger: true, replace: true });
	},
	"profile": function profile(rollNumber) {
		searchResultsComponent.onclose();
		writeRemPageComponent.onclose({ dontgoback: true });
		instructionsComponent.onclose({ dontgoback: true });
		imageUploaderComponent.onclose();
		this.navigate(rollNumber + "/profile/", { replace: true });
		safelyTurnPageTo(rollNumber, 1);
		//		updateNav();
	},
	"rems": function rems(rollNumber, page) {
		if (!RemBook.isFinalYear(rollNumber))
			return this.navigate(rollNumber + "/profile/", { replace: true });

		searchResultsComponent.onclose();
		writeRemPageComponent.onclose({ dontgoback: true });
		instructionsComponent.onclose({ dontgoback: true });
		//writeRemPageComponent.onclose();
		//instructionsComponent.onclose();
		imageUploaderComponent.onclose();

		page = parseInt(page || 1);
		page = page > 1 ? (page + 1) : 2;
		//		updateNav();

		//		remsComponent.rems[page-2].photoName = remsComponent.rems[page-2]._originalPhotoName_;

		safelyTurnPageTo(rollNumber, page);
	},
	"writeRem": function writeRem(rollNumber) {
		if (!RemBook.isFinalYear(rollNumber))
			return this.navigate(rollNumber + "/profile/", { replace: true });

		searchResultsComponent.onclose();
		writeRemPageComponent.onclose({ dontgoback: true });
		//instructionsComponent.onclose();
		imageUploaderComponent.onclose();

		//		updateNav();
		RemBook.loadRemBook(rollNumber, function () {
			renderWriteRemPage();
			//RemBook.currentRemBookOf.Rems.fetch({
			//	success: renderWriteRemPage
			//})
		});
	},
	"instructions": function () {
		searchResultsComponent.onclose();
		writeRemPageComponent.onclose({ dontgoback: true });
		//writeRemPageComponent.onclose();
		imageUploaderComponent.onclose();
		instructionsComponent.show();
	}
});

RemBookRouter = new _RemBookRouter();

function updateNav() {
	navComponent = new NavComponent({
		el: '#main-nav',
		data: {
			rollNumber: RemBook.currentRemBookOf.Profile.attributes.rollNumber,
			RemBook: RemBook
		}
	});
}

searchResultsComponent = new SearchResultsComponent({
	el: '#search-results-mount-point',
	methods: {
		_moreResults: function _moreResults() {
			this.results = RemBook.search.models;
		},
		show: function show() {
			$(this.$el).show();
			this.isopen = true;
			RemBook.search.on('reset', this._moreResults);
		},
		onclose: function onclose() {
			$(this.$el).hide();
			this.isopen = false;
			RemBook.search.off('reset', this._moreResults);
			this.querySent = false;
		},
		onchange: function onchange(e) {
			RemBook.search.setDepartment($(this.$el).find('input').val());
			this.isLoading = false;
			this.querySent = true;
		}
	},
	data: {
		results: RemBook.search.models,
		RemBook: RemBook,
		isLoading: false,
		querySent: false,
	}
});

searchControlComponent = new SearchControlComponent({
	el: '#search-control-mount-point',
	methods: {
		onsearchfocus(e) {
			searchResultsComponent.show();
		},
		oninput(e) {
			if (this._isDebouncing_) return;
			else {
				this._isDebouncing_ = true;
				var that = this;
				setTimeout(function () {
					RemBook.search.setQuery($(that.$el).find('input').val());
					searchResultsComponent.isLoading = true;
					that._isDebouncing_ = false;
				}, 1000);
			}
		}
	}
});

function createWriteRemPage() {
	writeRemPageComponent = new WriteRemPageComponent({
		el: '#write-rem-mount-point',
		methods: {
			show: function show() {
				this.isopen = true;
				$(this.$el).show();
				var that = this;
				var query_or_new = {
					from: that.from,
					to: that.to
				};
				this._Rem_ = RemBook.currentRemBookOf.Rems.findWhere(query_or_new);
				this._Rem_ = this._Rem_ || new Rem(query_or_new);
			},
			onclose: function onclose(o) {
				this.isopen = false;
				$(this.$el).hide();
				if (!o.dontgoback) window.history.back();
			},
			_onImageSave_: function () {
				var img = $(".write-rem-component img.rem-pic")[0];
				img.src = "/rempics/" + RemBook.currentUser.Profile.attributes.rollNumber + "_" + RemBook.currentRemBookOf.Profile.attributes.rollNumber + ".jpg?" + Math.random();
				this.onsave(null, false);
			},
			uploadImage(e) {
				var input = $(this.$el).find('input')[0];
				if (input.files && input.files[0]) {
					var reader = new FileReader();
					var that = this;
					reader.onload = function (e) {
						imageUploaderComponent.uploadFieldName = 'rempic';
						imageUploaderComponent.uploadUrl = '/rempic/' + RemBook.currentRemBookOf.Profile.attributes.rollNumber;
						imageUploaderComponent.saveCallback = that._onImageSave_;
						imageUploaderComponent.load(e);
					};
					reader.readAsDataURL(input.files[0]);
				}
			},
			onsave(e, highlight) {
				highlight = false;//highlight || true;
				var that = this;
				that._isDebouncing_ = false;
				that._Rem_.save({
					fromName: RemBook.currentUser.Profile.attributes.name,
					toName: RemBook.currentRemBookOf.Profile.attributes.name,
					trivia: that.trivia,
					memories: that.memories
				}, {
						success: function (model, response) {
							if (response.success != 1) return that.saveSoon();
							if (highlight) {
								$(e.DOMEvent.target).removeClass('unsaved').addClass('saved');
								setTimeout(function () { $(e.DOMEvent.target).removeClass('saved'); }, 500);
							}
							$(that.$el).removeClass('unsaved').addClass('saved');
							if (!that._Rem_.collection) RemBook.currentRemBookOf.Rems.add(that._Rem_, { merge: true });
						},
						error: that.saveNow
					});
			}
		},
		data: (new Rem({
			from: RemBook.currentUser.Profile.attributes.rollNumber,
			fromName: RemBook.currentUser.Profile.attributes.name,
			to: '',
			toName: '',
			trivia: [],
			memories: '',
			photoName: ''
		})).attributes,
		events: {
			input: function (e) {
				var that = this;
				$(e.DOMEvent.target).removeClass('saved').addClass('unsaved');
				$(that.$el).removeClass('saved').addClass('unsaved');
				return;

				if (this._isDebouncing_) return;
				else {
					this._isDebouncing_ = true;

					(function saveSoon() {
						setTimeout(that.setNow, 1500);
						/*function saveNow() {
							that._isDebouncing_ = false;
							that._Rem_.save({
								fromName: that.fromName,
								toName: that.toName,
								trivia: that.trivia,
								memories: that.memories 
							}, {
								success: function(model, response) {
									if(response.success != 1) return saveSoon();
									$(e.DOMEvent.target).removeClass('unsaved').addClass('saved');
									setTimeout(function() { $(e.DOMEvent.target).removeClass('saved'); }, 500);
									$(that.$el).removeClass('unsaved').addClass('saved');
									if(!that._Rem_.collection) RemBook.currentRemBookOf.Rems.add(that._Rem_, {merge: true});
								},
								error: saveNow
							});
						}, 1500);*/
					})();
				}
			}
		}
	});
}
createWriteRemPage();

imageUploaderComponent = new ImageUploaderComponent({
	el: '#image-uploader-mount-point',
	methods: {
		load(e, aspectRatio) {
			$(this.$el).show().find('img').attr('src', e.target.result).cropper('destroy');
			$(this.$el).find('img').cropper({
				aspectRatio: aspectRatio
			});
		},
		save(e) {
			var that = this;
			displayLoader();
			$(this.$el).find('img.original').cropper('getCroppedCanvas').toBlob(function (blob) {
				var formData = new FormData();

				formData.append(that.uploadFieldName, blob);
				formData.append('to', RemBook.currentRemBookOf.Profile.attributes.rollNumber);
				formData.append('toName', RemBook.currentRemBookOf.Profile.attributes.name);
				formData.append('from', RemBook.currentUser.attributes.rollNumber);
				formData.append('fromName', RemBook.currentUser.attributes.name);

				$.ajax(that.uploadUrl, {
					method: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function () {
						hideLoader();
						that.onclose();
						if (that.saveCallback) that.saveCallback();
						that.saveCallback = null;
					},
					error: function () {
						hideLoader();
						displayError("There seems to be a network problem. Please retry");//console.log('Upload error');
					}
				});
			}, 'image/jpeg');
		},
		show(e) {
			$(this.$el).show();
			this.isopen = true;
		},
		onclose(e) {
			$(this.$el).hide();
			this.isopen = false;
		}
	}
});

instructionsComponent = new InstructionsComponent({
	el: '#instructions-mount-point',
	methods: {
		show: function show() {
			$(this.$el).show();
			this.isopen = true;
		},
		onclose: function onclose(o) {
			$(this.$el).hide();
			if (!o.dontgoback) window.history.back();
			this.isopen = false;
		}
	}
});

searchResultsComponent.init();
restartBookBlock();
Backbone.emulateHTTP = true;
Backbone.history.start();
