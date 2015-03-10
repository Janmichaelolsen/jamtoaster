'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$log',
	function($scope, Authentication, $http, $log) {
		$scope.init = function(soundcloud) {
        	var SC = soundcloud;
        	SC.get('/tracks', { q: 'buskers', license: 'cc-by-sa' }, function(tracks) {
			 $log.info(tracks);
			});
    	};
	    $log.info($scope.html_metadata);
		$scope.searchYT = function () {
	    	$http.get('https://www.googleapis.com/youtube/v3/search', {
	        params: {
	          key: 'AIzaSyBi6y6Vu-y_tDrpT5YdNsFAHKlgKD_TGuM',
	          type: 'video',
	          maxResults: '10',
	          part: 'id,snippet',
	          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
	          q: $scope.YTquery
	        }
	      })
	      .success( function (data) {
	        $log.info(data);
	        $scope.YTresults = data;
	      })
	      .error( function () {
	        $log.info('Search error');
	      });
	    };
	    $scope.addYTTrack = function (videoId) {
	    	$log.info(videoId);
		};

		$scope.searchSC = function () {

		};
		$scope.addSCTrack = function () {

		};
	    $scope.authentication = Authentication;
	}
]);