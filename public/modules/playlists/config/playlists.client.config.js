'use strict';

// Configuring the Articles module
angular.module('playlists').run(['Menus', 'Playlists', '$log',
	function(Menus, Playlists, $log) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Playlists', 'playlists', 'dropdown', '/playlists(/create)?');
		Menus.addSubMenuItem('topbar', 'playlists', 'List Playlists', 'playlists');
		Menus.addSubMenuItem('topbar', 'playlists', 'New Playlist', 'playlists/create');
	}
]);
