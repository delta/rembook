import Vue from 'vue'

var NavComponent = Vue.extend({
    template: require('../../templates/NavComponent.tmpl'),
    computed: {
    	finalYear: function() {
	    var rollNumber = this.RemBook.currentRemBookOf.Profile.attributes.rollNumber;
            var fourYearCode = "1" + (new Date().getFullYear() - 2014); // for UGs
            var threeYearCode = "1" + (new Date().getFullYear() - 2013); // for MCA
            var twoYearCode = "1" + (new Date().getFullYear() - 2012); // for other PGs
            var finalYearCode = fourYearCode;

            if(rollNumber[0] != "1") {
                // MCA is a 3 year course. Everything else is 2 years.
                if(/^2051/.test(rollNumber)) { // MCA
                  finalYearCode = threeYearCode;
                } else {
                  finalYearCode = twoYearCode;
                }
            }

	    var yearCode = rollNumber.substr(4, 2);
	    return yearCode == finalYearCode || rollNumber == "203214030";
        },
    	graduated: function() {
	    var rollNumber = this.RemBook.currentRemBookOf.Profile.attributes.rollNumber;
            var fourYearCode = "1" + (new Date().getFullYear() - 2014); // for UGs
            var threeYearCode = "1" + (new Date().getFullYear() - 2013); // for MCA
            var twoYearCode = "1" + (new Date().getFullYear() - 2012); // for other PGs
            var finalYearCode = fourYearCode;

            if(rollNumber[0] != "1") {
                // MCA is a 3 year course. Everything else is 2 years.
                if(/^2051/.test(rollNumber)) { // MCA
                  finalYearCode = threeYearCode;
                } else {
                  finalYearCode = twoYearCode;
                }
            }

	    var yearCode = rollNumber.substr(4, 2);
	    return yearCode <= finalYearCode;
        },
    	isProfilePage: function() {
    		return this.RemBook.currentRemPage == 1;
    	},
    	isRemPage: function() {
    		return this.RemBook.currentRemPage > 1;
    	},
	self: function() {
		return this.RemBook.currentUser.Profile.attributes.rollNumber == this.RemBook.currentRemBookOf.Profile.attributes.rollNumber;
	}
    },
});

Vue.component('nav-component', NavComponent);

module.exports = NavComponent;
