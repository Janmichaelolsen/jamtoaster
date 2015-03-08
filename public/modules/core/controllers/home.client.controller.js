'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		var youtube = document.createElement('script'); // use global document since Angular's $document is weak
        youtube.src = 'https://apis.google.com/js/client.js?onload=OnLoadCallback';
        document.body.appendChild(youtube);
	}
]);