'use strict';

(function() {
	// Plays Controller Spec
	describe('Plays Controller Tests', function() {
		// Initialize global variables
		var PlaysController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Plays controller.
			PlaysController = $controller('PlaysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Play object fetched from XHR', inject(function(Plays) {
			// Create sample Play using the Plays service
			var samplePlay = new Plays({
				name: 'New Play'
			});

			// Create a sample Plays array that includes the new Play
			var samplePlays = [samplePlay];

			// Set GET response
			$httpBackend.expectGET('plays').respond(samplePlays);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.plays).toEqualData(samplePlays);
		}));

		it('$scope.findOne() should create an array with one Play object fetched from XHR using a playId URL parameter', inject(function(Plays) {
			// Define a sample Play object
			var samplePlay = new Plays({
				name: 'New Play'
			});

			// Set the URL parameter
			$stateParams.playId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/plays\/([0-9a-fA-F]{24})$/).respond(samplePlay);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.play).toEqualData(samplePlay);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Plays) {
			// Create a sample Play object
			var samplePlayPostData = new Plays({
				name: 'New Play'
			});

			// Create a sample Play response
			var samplePlayResponse = new Plays({
				_id: '525cf20451979dea2c000001',
				name: 'New Play'
			});

			// Fixture mock form input values
			scope.name = 'New Play';

			// Set POST response
			$httpBackend.expectPOST('plays', samplePlayPostData).respond(samplePlayResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Play was created
			expect($location.path()).toBe('/plays/' + samplePlayResponse._id);
		}));

		it('$scope.update() should update a valid Play', inject(function(Plays) {
			// Define a sample Play put data
			var samplePlayPutData = new Plays({
				_id: '525cf20451979dea2c000001',
				name: 'New Play'
			});

			// Mock Play in scope
			scope.play = samplePlayPutData;

			// Set PUT response
			$httpBackend.expectPUT(/plays\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/plays/' + samplePlayPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid playId and remove the Play from the scope', inject(function(Plays) {
			// Create new Play object
			var samplePlay = new Plays({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Plays array and include the Play
			scope.plays = [samplePlay];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/plays\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePlay);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.plays.length).toBe(0);
		}));
	});
}());