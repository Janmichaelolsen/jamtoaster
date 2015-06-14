angular.module('core').controller('PlayController', ['$scope', 'Authentication', '$log', 'VideosService',
	function($scope, Authentication, $log, VideosService) {
		$scope.authentication = Authentication;
    $scope.init = function(){
      $scope.playQueue = VideosService.getPlaylist();
      $scope.youtube = VideosService.getYoutube();
    }
	}
]);
