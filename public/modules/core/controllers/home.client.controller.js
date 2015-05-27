'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$log', 'VideosService', 'Playlists', 'ngToast', 'CommService', '$q',
	function($scope, Authentication, $http, $log, VideosService, Playlists, ngToast, CommService, $q) {
		$scope.loading = true;
		$scope.loadingrelated = true;
		$scope.p = Playlists.query();
		$scope.playlists = $scope.p;
		$scope.volumeVal = 50;
		$scope.YTresults =[];
		$scope.relatedVids =[];
		$scope.fetchPlaylists = function() {
			$scope.playlists = Playlists.query();
		};
		$scope.changeVolume = function () {
			$scope.youtube.player.setVolume($scope.volumeVal);
		};
		$scope.togglePlay = function () {
			if($scope.youtube.state === 'stopped' || $scope.youtube.state === 'paused'){
				$scope.youtube.player.playVideo();
			}else if($scope.youtube.state === 'playing') {
				$scope.youtube.player.pauseVideo();
			}
		};
		//Youtube stuffs
		var tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		function init() {
	      $scope.youtube = VideosService.getYoutube();
	      $scope.playlist = true;
	      $scope.loggedIn = CommService.getLoggedIn();
	    }
	    init();
	    $scope.launch = function (id, title, thumb) {
	      	VideosService.launchPlayer(id, title, thumb);
	    };
	    $scope.nextSong = function(){
	    	VideosService.nextSong();
	    };
	    $scope.searchYT = function () {
			$scope.loading = true;
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
					$scope.loading = false;
	        $scope.YTresults = data;
	      })
	      .error( function () {
					$scope.loading = false;
	        $scope.errorText='An error occured, check your connection or try refreshing the page.';
	      });
	    };
			$scope.findRelated = function(videoId){
				$scope.loadingrelated = true;
				$http.get('https://www.googleapis.com/youtube/v3/search', {
	        params: {
	          key: 'AIzaSyBi6y6Vu-y_tDrpT5YdNsFAHKlgKD_TGuM',
	          type: 'video',
	          maxResults: '10',
	          part: 'id,snippet',
	          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
			  		relatedToVideoId: videoId
	        }
	      })
	      .success( function (data) {
					$scope.loadingrelated = false;
	        $scope.relatedVids = data;
	      })
	      .error( function () {
					$scope.loadingrelated = false;
	        $scope.errorText='An error occured, check your connection or try refreshing the page.';
	      });
			};
			$scope.addTrackFromMenu = function(list) {
				$scope.addYTTrack($scope.youtube.videoId, $scope.youtube.thumb, $scope.youtube.videoTitle, list);

			};
	    $scope.addYTTrack = function (videoId, thumb, title, list) {
				var songs = list.songs;
				songs.push({videoId, thumb, title});
				var playlist = list;
				playlist.songs = songs;
				playlist.$update();
				ngToast.create('Added to '+list.name);
		};
		$scope.$watch(function() { return $scope.youtube.state; }, function(){
			if($scope.youtube.state === 'paused' || $scope.youtube.state === 'stopped'){
				$scope.toggleState = 'Play';
			}else if($scope.youtube.state === 'playing'){
				$scope.toggleState = 'Pause';
			}
		});
		$scope.$watch(function() { return $scope.loggedIn; }, function(){
			var wait = function() {
		    var deferred = $q.defer();
		    $scope.playlists = Playlists.query();
		    return deferred.promise;
		  };

		  wait()
		  .then(function(rest) {
		    $scope.$apply();
		  })
		  .catch(function(fallback) {
		  });
			
		});
		$scope.toggleState = 'Play';
	    //Soundcloud stuffs
	    /*
        SC.initialize({
          client_id: '7ee4ea137d2c4782d07fc465eb841845'
        });

		var widgetIframe = document.getElementById('sc-widget'),
		    widget       = SC.Widget(widgetIframe);

		var newWidgetUrl = 'http://api.soundcloud.com/tracks/',
		    CLIENT_ID    = '7ee4ea137d2c4782d07fc465eb841845';
		*/
		$scope.searchSC = function () {
			/*
			$scope.loading = true;
			SC.get('/tracks', { q: $scope.SCquery }, function(tracks) {
				$scope.loading = false;
			$scope.$apply(function () {
	            $scope.SCresults = tracks.slice(0,10);
	        });
			});
*/
		};

		$scope.addSCTrack = function (soundId, list) {
			var songs = list.songs;
			songs.push(soundId);
			var playlist = list;
			playlist.songs = songs;
			playlist.$update();
		};
		$scope.playSCTrack = function (soundId) {
			/*widget.load('http://api.soundcloud.com/tracks/'+soundId, {
			  show_artwork: false,
			  auto_play:true,
			  show_comments:false,
			  buying:false,
			  liking:false,
			  sharing:false,
			  show_playcount:false,
			  show_user:false,
			});
			*/
		};

		//Hypem

		$scope.searchHypem = function () {
			$scope.loading = true;
			$http.get('http://hypem.com/playlist/search/'+$scope.Hquery+'/json/1')
			.success(function(tracks){
				$scope.loading = false;
				$scope.Hresults = tracks;
			})
			.error(function(){
				$scope.loading = false;
				$scope.errorText = 'An error occured, check your connection or try refreshing the page.';
			});
		};
		$scope.addHTrack = function (hypeId) {
			/*
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
			*/
		};

		//Spotify

	    $scope.searchSpotify = function () {
				$scope.loading = true;
	    	$http.get('https://api.spotify.com/v1/search?q='+$scope.Squery+'&type=track')
	    	.success(function(tracks){
					$scope.loading = false;
	    		$scope.Sresults = tracks;
	    	})
				.error(function(){
						$scope.loading = false;
						$scope.errorText = 'An error occured, check your connection or try refreshing the page.';
				});
	    };
	    $scope.addSTrack = function (trackId) {
				$log.info(trackId);
			};
	    $scope.authentication = Authentication;
	    $scope.$apply();
	}
]);
