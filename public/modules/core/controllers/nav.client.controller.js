'use strict';

angular.module('core').controller('NavController', ['$scope', 'Authentication', '$location', '$log',
	function($scope, Authentication, $location, $log) {
		$scope.authentication = Authentication;
		$scope.searchClass = 'btn btn-success';
		$scope.playClass = 'btn btn-default';
		$scope.visible = "{'visibility':'hidden'}";

		$scope.goToSearch = function() {
			$location.path('/');
		};
		$scope.goToPlay = function() {
			$location.path('/play');
		};

		$scope.$watch(function() { return $location.path(); }, function(){
			if($location.path() === '/'){
				$scope.searchClass = 'btn btn-success';
				$scope.playClass = 'btn btn-default';
				$scope.visible = "{'visibility':'hidden'}";
			} else if($location.path() === '/play'){
				$scope.playClass = 'btn btn-success';
				$scope.searchClass = 'btn btn-default';
				$scope.visible = "{'visibility':'visible'}";
			} else {
 				$scope.playClass = 'btn btn-default';
				$scope.searchClass = 'btn btn-default';
				$scope.visible = "{'visibility:'hidden'}";
			}
		});
	}
]);