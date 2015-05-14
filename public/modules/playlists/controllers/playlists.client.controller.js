'use strict';

// Playlists controller
angular.module('playlists').controller('PlaylistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Playlists', 'VideosService',
	function($scope, $stateParams, $location, Authentication, Playlists, VideosService) {
		$scope.authentication = Authentication;

		// Create new Playlist
		$scope.create = function() {
			// Create new Playlist object
			var playlist = new Playlists ({
				name: this.name
			});

			// Redirect after save
			playlist.$save(function(response) {
				$location.path('/');

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
			VideosService.launchList(list);
		};
		$scope.playSong = function(song, list){
			VideosService.launchListSpes(song.videoId, list);
		};
	}
]);
