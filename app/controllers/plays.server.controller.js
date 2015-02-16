'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Play = mongoose.model('Play'),
	_ = require('lodash');

/**
 * Create a Play
 */
exports.create = function(req, res) {
	var play = new Play(req.body);
	play.user = req.user;

	play.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(play);
		}
	});
};

/**
 * Show the current Play
 */
exports.read = function(req, res) {
	res.jsonp(req.play);
};

/**
 * Update a Play
 */
exports.update = function(req, res) {
	var play = req.play ;

	play = _.extend(play , req.body);

	play.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(play);
		}
	});
};

/**
 * Delete an Play
 */
exports.delete = function(req, res) {
	var play = req.play ;

	play.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(play);
		}
	});
};

/**
 * List of Plays
 */
exports.list = function(req, res) { 
	Play.find().sort('-created').populate('user', 'displayName').exec(function(err, plays) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plays);
		}
	});
};

/**
 * Play middleware
 */
exports.playByID = function(req, res, next, id) { 
	Play.findById(id).populate('user', 'displayName').exec(function(err, play) {
		if (err) return next(err);
		if (! play) return next(new Error('Failed to load Play ' + id));
		req.play = play ;
		next();
	});
};

/**
 * Play authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.play.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
