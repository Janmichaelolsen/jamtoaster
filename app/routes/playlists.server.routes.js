'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var playlists = require('../../app/controllers/playlists.server.controller');

	// Playlists Routes
	app.route('/playlists')
		.get(playlists.list)
		.post(users.requiresLogin, playlists.create);

	app.route('/playlists/:playlistId')
		.get(playlists.read)
		.put(users.requiresLogin, playlists.hasAuthorization, playlists.update)
		.delete(users.requiresLogin, playlists.hasAuthorization, playlists.delete);

	// Finish by binding the Playlist middleware
	app.param('playlistId', playlists.playlistByID);
};
