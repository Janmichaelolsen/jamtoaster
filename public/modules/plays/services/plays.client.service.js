'use strict';

//Plays service used to communicate Plays REST endpoints
angular.module('plays').factory('Plays', ['$resource',
	function($resource) {
		return $resource('plays/:playId', { playId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);