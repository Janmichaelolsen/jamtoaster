'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var plays = require('../../app/controllers/plays.server.controller');

	// Plays Routes
	app.route('/plays')
		.get(plays.list)
		.post(users.requiresLogin, plays.create);

	app.route('/plays/:playId')
		.get(plays.read)
		.put(users.requiresLogin, plays.hasAuthorization, plays.update)
		.delete(users.requiresLogin, plays.hasAuthorization, plays.delete);

	// Finish by binding the Play middleware
	app.param('playId', plays.playByID);
};
