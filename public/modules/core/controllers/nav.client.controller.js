'use strict';

angular.module('core').controller('NavController', ['$scope', 'Authentication', '$location', '$log',
	function($scope, Authentication, $location, $log) {
		$scope.authentication = Authentication;

		$scope.goToSearch = function() {
			$location.path('/');
		};
		$scope.goToPlay = function() {
			$location.path('/play');
		};

		$scope.$watch(function() { return $location.path(); }, function(){
			if($location.path() === '/'){
				$scope.searchClass = 'toptabButton toptabButton-select';
				$scope.playClass = 'toptabButton';
			} else if($location.path() === '/play'){
				$scope.playClass = 'toptabButton toptabButton-select';
				$scope.searchClass = 'toptabButton';
			} else {
 				$scope.playClass = 'toptabButton';
				$scope.searchClass = 'toptabButton';
			}
		});
	}
]);