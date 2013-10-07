'use strict';

/* Directives */


angular.module('Waze.directives', [])
  .directive('wazePopup', [function(){
    return {
      restrict: 'A',
      replace: false,
      scope: true,
      templateUrl: 'partials/popup-marker.html',
    }
  }])
  .directive('wazeNew', [function(){
    return {
      restrict: 'A',
      replace: false,
      scope: true,
      templateUrl: 'partials/popup-new.html',
    }
  }])
  .directive('wazeEdit', [function(){
    return {
      restrict: 'A',
      replace: false,
      scope: true,
      templateUrl: 'partials/popup-edit.html',
    }
  }])
  .directive('wazeInfo', [function(){
    return {
      restrict: 'A',
      replace: false,
      scope: true,
      templateUrl: 'partials/popup-info.html',
    }
  }])