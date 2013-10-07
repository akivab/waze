'use strict';


// Declare app level module which depends on filters, and services
angular.module('Waze', ['Waze.filters', 'Waze.services', 'Waze.directives', 'Waze.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/main-view.html', controller: 'NotificationCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
