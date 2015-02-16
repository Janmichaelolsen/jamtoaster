'use strict';

// Configuring the Articles module
angular.module('plays').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Plays', 'plays', 'dropdown', '/plays(/create)?');
		Menus.addSubMenuItem('topbar', 'plays', 'List Plays', 'plays');
		Menus.addSubMenuItem('topbar', 'plays', 'New Play', 'plays/create');
	}
]);