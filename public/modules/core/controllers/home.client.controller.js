'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$log', 'VideosService', 'PlayerService', 'Playlists',
	function($scope, Authentication, $http, $log, VideosService, PlayerService, Playlists) {
		$scope.loading = false;
		$scope.currentService = 'yt';
		$scope.p = Playlists.query();
		$scope.playlists = $scope.p;
		$scope.volumeVal = 50;
		$scope.changeVolume = function () {
			widget.setVolume($scope.volumeVal/100);
			$scope.youtube.player.setVolume($scope.volumeVal);
		};
		$scope.toggle = true;
		$scope.toggleText = 'Play';
		$scope.togglePlay = function () {
			$scope.toggle = !$scope.toggle;
			$scope.toggleText = $scope.toggle ? 'Play' : 'Pause';
			if($scope.toggle === true){
				$scope.youtube.player.pauseVideo();
			}else {
				$scope.youtube.player.playVideo();
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
	    }
	    init();
	    $scope.launch = function (id, title) {
	    	$log.info('Launched id:' + id + ' and title:' + title);
	      	VideosService.launchPlayer(id, title);

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
	        $log.info(data);
	      })
	      .error( function () {
					$scope.loading = false;
	        $scope.errorText="An error occured, check your connection or try refreshing the page.";
	      });
	    };
			$scope.findRelated = function(videoId){
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
					$scope.loading = false;
	        $scope.relatedVids = data;
	        $log.info($scope.relatedVids);
	      })
	      .error( function () {
					$scope.loading = false;
	        $scope.errorText="An error occured, check your connection or try refreshing the page.";
	      });
			}
	    $scope.addYTTrack = function (videoId, list) {
	    	$log.info(videoId + " to "+list);
				var songs = list.songs;
				songs.push("yt|"+videoId);
				var playlist = list;
				playlist.songs = songs;
				playlist.$update();

		};
	    //Soundcloud stuffs

        SC.initialize({
          client_id: '7ee4ea137d2c4782d07fc465eb841845'
        });

		var widgetIframe = document.getElementById('sc-widget'),
		    widget       = SC.Widget(widgetIframe);

		var newWidgetUrl = 'http://api.soundcloud.com/tracks/',
		    CLIENT_ID    = '7ee4ea137d2c4782d07fc465eb841845';

		$scope.searchSC = function () {
			$scope.loading = true;
			SC.get('/tracks', { q: $scope.SCquery }, function(tracks) {
				$scope.loading = false;
			$scope.$apply(function () {
	            $scope.SCresults = tracks.slice(0,10);
							$log.info($scope.SCresults);
	        });
			});
		};
		$scope.addSCTrack = function (soundId, list) {
			var songs = list.songs;
			songs.push("sc|"+soundId);
			var playlist = list;
			playlist.songs = songs;
			playlist.$update();
		};
		$scope.playSCTrack = function (soundId) {
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
		}

		//Hypem

		$scope.searchHypem = function () {
			$scope.loading = true;
			$http.get('http://hypem.com/playlist/search/'+$scope.Hquery+'/json/1')
			.success(function(tracks){
				$scope.loading = false;
				$scope.Hresults = tracks;
				$log.info(tracks);
			})
			.error(function(){
				$scope.loading = false;
				$scope.errorText = "An error occured, check your connection or try refreshing the page.";
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
				$scope.loading = true;
	    	$http.get('https://api.spotify.com/v1/search?q='+$scope.Squery+'&type=track')
	    	.success(function(tracks){
					$scope.loading = false;
	    		$scope.Sresults = tracks;
	    	})
				.error(function(){
						$scope.loading = false;
						$scope.errorText = "An error occured, check your connection or try refreshing the page.";
				});
	    };
	    $scope.addSTrack = function (trackId) {
				$log.info(trackId);
			};
	    $scope.authentication = Authentication;
	}
]);
