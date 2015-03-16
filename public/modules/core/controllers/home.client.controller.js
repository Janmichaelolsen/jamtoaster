'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$log', 'VideosService',
	function($scope, Authentication, $http, $log, VideosService) {
		//Youtube stuffs
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		function init() {
	      $scope.youtube = VideosService.getYoutube();
	      $scope.playlist = true;
	    }
	    init();
	    $scope.launch = function (id, title) {
	    	$log.info('Launched id:' + id + ' and title:' + title);
	      	VideosService.launchPlayer(id, title);
	      
	    };
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
	        $scope.YTresults = data;
	        $log.info(data);
	      })
	      .error( function () {
	        $log.info('Search error');
	      });
	    };
	    $scope.addYTTrack = function (videoId) {
	    	$log.info(videoId);
		};


	    //Soundcloud stuffs

        SC.initialize({
          client_id: '7ee4ea137d2c4782d07fc465eb841845'
        });

		var widgetIframe = document.getElementById('sc-widget'),
		    widget       = SC.Widget(widgetIframe)

		var newWidgetUrl = 'http://api.soundcloud.com/tracks/',
		    CLIENT_ID    = '7ee4ea137d2c4782d07fc465eb841845'

		$scope.searchSC = function () {
			SC.get('/tracks', { q: $scope.SCquery }, function(tracks) {
			$scope.$apply(function () {
	            $scope.SCresults = tracks;
	        });
			});
		};
		$scope.addSCTrack = function (soundId) {
			widget.load('http://api.soundcloud.com/tracks/'+soundId, {
			  show_artwork: false,
			  auto_play:true,
			  show_comments:false,
			  buying:false,
			  liking:false,
			  sharing:false,
			  show_playcount:false,
			  show_user:false,
			});
			$log.info(soundId);
		};
		
		//Hypem

		$scope.searchHypem = function () {
			$http.get('http://hypem.com/playlist/search/'+$scope.Hquery+'/json/1')
			.success(function(tracks){
				$scope.Hresults = tracks;
			});
		};
		$scope.addHTrack = function (hypeId) {
			widget.load('http://api.soundcloud.com/tracks/'+hypeId, {
			  show_artwork: false,
			  auto_play:true,
			  show_comments:false,
			  buying:false,
			  liking:false,
			  sharing:false,
			  show_playcount:false,
			  show_user:false,
			});
			$log.info(hypeId);
		};

		//Spotify
	    
	    $scope.searchSpotify = function () {
	    	$http.get('https://api.spotify.com/v1/search?q='+$scope.Squery+'&type=track')
	    	.success(function(tracks){
	    		$scope.Sresults = tracks;
	    	});
	    };
	    $scope.addSTrack = function (trackId) {
			$log.info(trackId);
		};
	    $scope.authentication = Authentication;
	}
]);