'use strict';

// Plays controller
angular.module('plays').controller('PlaysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plays',
	function($scope, $stateParams, $location, Authentication, Plays) {
		$scope.authentication = Authentication;

		// Create new Play
		$scope.create = function() {
			// Create new Play object
			var play = new Plays ({
				name: this.name
			});

			// Redirect after save
			play.$save(function(response) {
				$location.path('plays/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Play
		$scope.remove = function(play) {
			if ( play ) { 
				play.$remove();

				for (var i in $scope.plays) {
					if ($scope.plays [i] === play) {
						$scope.plays.splice(i, 1);
					}
				}
			} else {
				$scope.play.$remove(function() {
					$location.path('plays');
				});
			}
		};

		// Update existing Play
		$scope.update = function() {
			var play = $scope.play;

			play.$update(function() {
				$location.path('plays/' + play._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Plays
		$scope.find = function() {
			$scope.plays = Plays.query();
		};

		// Find existing Play
		$scope.findOne = function() {
			$scope.play = Plays.get({ 
				playId: $stateParams.playId
			});
		};
	}
]);