'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.load_script = function(){
			var s = document.createElement('script'); // use global document since Angular's $document is weak
	        s.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize';
	        document.body.appendChild(s);
		};
	}
]);