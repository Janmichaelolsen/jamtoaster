'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Playlist = mongoose.model('Playlist'),
	_ = require('lodash');

/**
 * Create a Playlist
 */
exports.create = function(req, res) {
	var playlist = new Playlist(req.body);
	playlist.user = req.user;

	playlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * Show the current Playlist
 */
exports.read = function(req, res) {
	res.jsonp(req.playlist);
};

/**
 * Update a Playlist
 */
exports.update = function(req, res) {
	var playlist = req.playlist ;

	playlist = _.extend(playlist , req.body);

	playlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * Delete an Playlist
 */
exports.delete = function(req, res) {
	var playlist = req.playlist ;

	playlist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(playlist);
		}
	});
};

/**
 * List of Playlists
 */
exports.list = function(req, res) {
	Playlist.find({'user': mongoose.Types.ObjectId(req.user._id)}).sort('-created').populate('user', 'displayName').exec(function(err, pets) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pets);
        }
    });
};

/**
 * Playlist middleware
 */
exports.playlistByID = function(req, res, next, id) {
	Playlist.findById(id).populate('user', 'displayName').exec(function(err, playlist) {
		if (err) return next(err);
		if (! playlist) return next(new Error('Failed to load Playlist ' + id));
		req.playlist = playlist ;
		next();
	});
};

/**
 * Playlist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.playlist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
