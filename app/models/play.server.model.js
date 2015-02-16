'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Play Schema
 */
var PlaySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Play name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Play', PlaySchema);