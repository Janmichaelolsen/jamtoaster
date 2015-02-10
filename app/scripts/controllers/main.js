'use strict';

/**
 * @ngdoc function
 * @name jamtoasterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jamtoasterApp
 */
angular.module('jamtoasterApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
