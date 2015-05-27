'use strict';

angular.module('core').service('CommService', ['$log', function ($log) {

	var loginChange = false;
	this.getLoggedIn = function () {
	    return loginChange;
	};

	this.setLoggedIn = function () {
	    loginChange = !loginChange;
	};

}]);