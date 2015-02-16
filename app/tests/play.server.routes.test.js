'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Play = mongoose.model('Play'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, play;

/**
 * Play routes tests
 */
describe('Play CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Play
		user.save(function() {
			play = {
				name: 'Play Name'
			};

			done();
		});
	});

	it('should be able to save Play instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Play
				agent.post('/plays')
					.send(play)
					.expect(200)
					.end(function(playSaveErr, playSaveRes) {
						// Handle Play save error
						if (playSaveErr) done(playSaveErr);

						// Get a list of Plays
						agent.get('/plays')
							.end(function(playsGetErr, playsGetRes) {
								// Handle Play save error
								if (playsGetErr) done(playsGetErr);

								// Get Plays list
								var plays = playsGetRes.body;

								// Set assertions
								(plays[0].user._id).should.equal(userId);
								(plays[0].name).should.match('Play Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Play instance if not logged in', function(done) {
		agent.post('/plays')
			.send(play)
			.expect(401)
			.end(function(playSaveErr, playSaveRes) {
				// Call the assertion callback
				done(playSaveErr);
			});
	});

	it('should not be able to save Play instance if no name is provided', function(done) {
		// Invalidate name field
		play.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Play
				agent.post('/plays')
					.send(play)
					.expect(400)
					.end(function(playSaveErr, playSaveRes) {
						// Set message assertion
						(playSaveRes.body.message).should.match('Please fill Play name');
						
						// Handle Play save error
						done(playSaveErr);
					});
			});
	});

	it('should be able to update Play instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Play
				agent.post('/plays')
					.send(play)
					.expect(200)
					.end(function(playSaveErr, playSaveRes) {
						// Handle Play save error
						if (playSaveErr) done(playSaveErr);

						// Update Play name
						play.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Play
						agent.put('/plays/' + playSaveRes.body._id)
							.send(play)
							.expect(200)
							.end(function(playUpdateErr, playUpdateRes) {
								// Handle Play update error
								if (playUpdateErr) done(playUpdateErr);

								// Set assertions
								(playUpdateRes.body._id).should.equal(playSaveRes.body._id);
								(playUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Plays if not signed in', function(done) {
		// Create new Play model instance
		var playObj = new Play(play);

		// Save the Play
		playObj.save(function() {
			// Request Plays
			request(app).get('/plays')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Play if not signed in', function(done) {
		// Create new Play model instance
		var playObj = new Play(play);

		// Save the Play
		playObj.save(function() {
			request(app).get('/plays/' + playObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', play.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Play instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Play
				agent.post('/plays')
					.send(play)
					.expect(200)
					.end(function(playSaveErr, playSaveRes) {
						// Handle Play save error
						if (playSaveErr) done(playSaveErr);

						// Delete existing Play
						agent.delete('/plays/' + playSaveRes.body._id)
							.send(play)
							.expect(200)
							.end(function(playDeleteErr, playDeleteRes) {
								// Handle Play error error
								if (playDeleteErr) done(playDeleteErr);

								// Set assertions
								(playDeleteRes.body._id).should.equal(playSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Play instance if not signed in', function(done) {
		// Set Play user 
		play.user = user;

		// Create new Play model instance
		var playObj = new Play(play);

		// Save the Play
		playObj.save(function() {
			// Try deleting Play
			request(app).delete('/plays/' + playObj._id)
			.expect(401)
			.end(function(playDeleteErr, playDeleteRes) {
				// Set message assertion
				(playDeleteRes.body.message).should.match('User is not logged in');

				// Handle Play error error
				done(playDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Play.remove().exec();
		done();
	});
});