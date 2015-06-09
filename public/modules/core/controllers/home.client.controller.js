'use strict';

angular.module('core').controller('HomeController', ['$scope', '$rootScope', 'Authentication', '$http', '$log', 'VideosService', 'Playlists', 'ngToast', '$q', '$interval', '$timeout', '$location',
	function($scope, $rootScope, Authentication, $http, $log, VideosService, Playlists, ngToast, $q, $interval, $timeout, $location) {
		$scope.visible = "{'visibility':'hidden'}";
		$scope.authentication = Authentication;
		$scope.loading = true;
		$scope.volumeVal = 50;
		$scope.YTresults =[];
		$scope.relatedVids =[];
		$scope.time = 0;
		$scope.displayTime = '00:00';
		$scope.setVal = $scope.time;
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
	      $rootScope.playlists = VideosService.getPlaylists();
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
			songs.push({videoId: videoId, thumb: thumb, title: title});
			var playlist = list;
			playlist.songs = songs;
			playlist.$update();
			ngToast.create('Added to '+list.name);
			
		};

		$scope.$watch(function() { return $scope.youtube.state; }, function(){
			if($scope.youtube.state === 'paused' || $scope.youtube.state === 'stopped'){
				$scope.toggleState = 'Play';
			}else if($scope.youtube.state === 'playing'){
				$scope.callAtInterval = function(){
					var totalSec = Math.floor($scope.youtube.player.getCurrentTime());
					var hours = parseInt( totalSec / 3600 ) % 24;
					var durSecs = Math.floor($scope.youtube.player.getDuration());
					var durHours = parseInt( durSecs / 3600 ) % 24;
					var minutes = parseInt( totalSec / 60 ) % 60;
					var seconds = totalSec % 60;
					var result = 0;
					if(durHours === 0){
						result = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);
					}else{
						result = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);
					}
					$scope.displayTime = result;
					$scope.time = $scope.youtube.player.getCurrentTime();
					$scope.setVal = $scope.time;
				};
				$interval($scope.callAtInterval, 500);
				$scope.toggleState = 'Pause';
			}
		});

		$scope.$watch(function() { return $scope.youtube.player.getDuration(); }, function(){
			var totalSec = Math.floor($scope.youtube.player.getDuration());
			var hours = parseInt( totalSec / 3600 ) % 24;
			var minutes = parseInt( totalSec / 60 ) % 60;
			var seconds = totalSec % 60;
			var result = 0;
			if(hours === 0){
				result = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);
			}else{
				result = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);
			}
			$scope.duration = $scope.youtube.player.getDuration();
			$scope.displayDuration = result;
			var seekBar = document.getElementById('seekBar');
			seekBar.max=$scope.youtube.player.getDuration();
		});


		$scope.seekTo = function(){
			$scope.youtube.player.seekTo($scope.setVal);
		};

		$scope.toggleState = 'Play';
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
	        });
			});
		};

		$scope.addSCTrack = function (soundId, list) {
			var songs = list.songs;
			songs.push(soundId);
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
		};
		$scope.$watch(function() { return $location.path(); }, function(){
			if($location.path() === '/'){
				$scope.visible = {'visibility':'hidden', 'height':'0'};
			} else if($location.path() === '/play'){
				$scope.visible = {'visibility':'visible', 'height':'500px'};
			} else {
				$scope.visible = {'visibility':'hidden','height':'0'};
			}
		});
	}
]);
