'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SCService', '$http', '$log',
	function($scope, Authentication, SCService, $http, $log) {
        SC.initialize({
          client_id: '7ee4ea137d2c4782d07fc465eb841845'
        });
        
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
			SC.get('/tracks', { q: $scope.SCquery, license: 'cc-by-sa' }, function(tracks) {
			$scope.$apply(function () {
	            $scope.SCresults = tracks.slice(1, 11);
	        });
			  $log.info(tracks.slice(1,11));
			});
		};
		$scope.addSCTrack = function (soundId) {
			$log.info(soundId);
		};
		
		$scope.searchHypem = function () {
			$http.get('http://hypem.com/playlist/search/'+$scope.Hquery+'/json/1')
			.success(function(tracks){
				$scope.Hresults = tracks;
				$log.info(tracks);
			});
		};
		$scope.addHTrack = function (hypeId) {
			$log.info(hypeId);
		};
	    
	    $scope.searchSpotify = function () {
	    	$http.get('https://api.spotify.com/v1/search?q='+$scope.Squery+'&type=track')
	    	.success(function(tracks){
	    		$log.info(tracks);
	    		$scope.Sresults = tracks;
	    	});
	    };
	    $scope.addSTrack = function (trackId) {
			$log.info(trackId);
		};
	    $scope.authentication = Authentication;
	}
]);