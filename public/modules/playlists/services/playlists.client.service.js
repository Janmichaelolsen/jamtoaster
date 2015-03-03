'use strict';

//Playlists service used to communicate Playlists REST endpoints
angular.module('playlists').factory('Playlists', ['$resource',
	function($resource) {
		return $resource('playlists/:playlistId', { playlistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);