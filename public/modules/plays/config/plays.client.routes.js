'use strict';

//Setting up route
angular.module('plays').config(['$stateProvider',
	function($stateProvider) {
		// Plays state routing
		$stateProvider.
		state('playlists', {
			url: '/playlists',
			templateUrl: 'modules/plays/views/playlists.client.view.html'
		}).
		state('listPlays', {
			url: '/plays',
			templateUrl: 'modules/plays/views/list-plays.client.view.html'
		}).
		state('createPlay', {
			url: '/plays/create',
			templateUrl: 'modules/plays/views/create-play.client.view.html'
		}).
		state('viewPlay', {
			url: '/plays/:playId',
			templateUrl: 'modules/plays/views/view-play.client.view.html'
		}).
		state('editPlay', {
			url: '/plays/:playId/edit',
			templateUrl: 'modules/plays/views/edit-play.client.view.html'
		});
	}
]);