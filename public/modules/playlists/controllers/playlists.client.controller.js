'use strict';

// Playlists controller
angular.module('playlists').controller('PlaylistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Playlists', 'VideosService', '$log', '$http', '$q', 'ngToast',
	function($scope, $stateParams, $location, Authentication, Playlists, VideosService, $log, $http, $q, ngToast) {
		$scope.authentication = Authentication;
		$scope.youtube = VideosService.getYoutube();
		$log.info($scope.youtube);

		// Create new Playlist
		$scope.create = function() {
			// Create new Playlist object
			var playlist = new Playlists ({
				name: this.name
			});

			// Redirect after save
			playlist.$save(function(response) {
				$location.path('playlists/' + playlist._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Playlist
		$scope.remove = function(playlist) {
			if ( playlist ) {
				playlist.$remove();

				for (var i in $scope.playlists) {
					if ($scope.playlists [i] === playlist) {
						$scope.playlists.splice(i, 1);
					}
				}
			} else {
				$scope.playlist.$remove(function() {
					$location.path('playlists');
				});
			}
		};

		// Update existing Playlist
		$scope.update = function() {
			var playlist = $scope.playlist;

			playlist.$update(function() {
				$location.path('playlists/' + playlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.removeSong = function(songId) {
			var playlist = $scope.playlist;
			var songs = playlist.songs;
			var index = songs.indexOf(songId);
			if(index > -1){
				songs.splice(index, 1);
			}
			playlist.songs = songs;
			playlist.$update(function() {
				$location.path('playlists/' + playlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Playlists
		$scope.find = function() {
			$scope.playlists = Playlists.query();
		};

		// Find existing Playlist
		$scope.findOne = function() {
			$scope.playlist = Playlists.get({
				playlistId: $stateParams.playlistId
			});
		};
		$scope.launchList = function(list){
			ngToast.create('Shuffle playing '+$scope.playlist.name);
			VideosService.launchList(list);
		};
		$scope.playSong = function(song, list){
			VideosService.launchListSpes(song, list);
		};
		$scope.discover = function(list){
			ngToast.create('Discovering '+$scope.playlist.name);
			$scope.getDiscSongs(list)
			.then(function (res){
				VideosService.launchDiscover(res);
			});
		};
		$scope.getDiscSongs = function(array){
			// Mark which request we're currently doing
		  var currentRequest = 0;
		  // Make this promise based.
		  var deferred = $q.defer();
		  // Set up a result array
		  var results = [];
		  function makeNextRequest() {

				$http.get('https://www.googleapis.com/youtube/v3/search', {
					params: {
						key: 'AIzaSyBi6y6Vu-y_tDrpT5YdNsFAHKlgKD_TGuM',
						type: 'video',
						maxResults: '3',
						part: 'id,snippet',
						fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
						relatedToVideoId: array[currentRequest].videoId
					}
				})
				.success( function (data) {
					results.push(data.items[0]);
					results.push(data.items[1]);
					results.push(data.items[2]);
					currentRequest++;
					if (currentRequest < array.length){
		        makeNextRequest();
		      }
		      // Resolve the promise otherwise.
		      else {
		        deferred.resolve(results);
		      }
				})
				.error( function () {
				});
		  }
		  makeNextRequest();
		  // return a promise for the completed requests
		  return deferred.promise;
		};
	}
]);
