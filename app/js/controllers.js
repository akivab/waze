'use strict';

/* Controllers */

angular.module('Waze.controllers', ['Waze.services'])
.controller('NotificationCtrl', ['$compile', '$filter', '$http', '$route', '$scope', '$timeout', 'NotificationService',
  function($compile, $filter, $http, $route, $scope, $timeout, NotificationService) {
    var linkFunc = $compile('<div waze-new></div>');
    var editFunc = $compile('<div waze-edit></div>');
    var map = L.map('map');

    $scope.initialSetup = function() {
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);
      map.locate({setView: true, maxZoom: 16});
      map.on('click', function(e) {
        $scope.newNotification(e);
      });

      map.on('moveend', function(e) {
        $scope.$apply();
      })

      map.whenReady(function(){
        $scope.mapReady = true;
      });

      $scope.opened = null
      $scope.notifications = [];
      $scope.notification = {};
      $scope.notice = 'loading data...';
      NotificationService.request(NotificationService.Action.GET, {}).success(function(data) {
        $scope.resetNotifications(data);
        $scope.notice = 'done.';
      }).error(function(data) {
        $scope.notice = 'error. reload page.';
        $timeout(function(){ $route.reload() }, 100);
      });
    };

    $scope.newNotification = function(e) {
      var notification = {
        lat: e.latlng.lat,
        lon: e.latlng.lng
      };

      if ($scope.marker) {
        map.removeLayer($scope.marker);
      }

      $scope.marker = $scope.addNotification(notification,
        NotificationService.Action.ADD, { minWidth: 250 });
      $scope.marker.openPopup();
    };


    $scope.initialSetup();

    $scope.setSelected = function(notification) {
      if ($scope.opened == notification.id) {
        $scope.opened = null;
      } else {
        $scope.opened = notification.id;
      }
    };

    $scope.isSelected = function(notification) {
      return $scope.opened == notification.id;
    };

    $scope.mapEdit = function(notification, marker) {
      var scope = $scope.$new();
      scope.notification = angular.copy(notification);
      scope.marker = marker;
      var compiled = editFunc(scope);
      var popup =  L.popup({ minWidth: 250 }).setContent(compiled[0]);
      marker.bindPopup(popup).openPopup();
    };

    $scope.request = function(action, notification, marker) {
      if (marker) {
        var latlng = marker.getLatLng();
        notification.lat = latlng.lat;
        notification.lon = latlng.lng;
      }

      NotificationService.request(action, notification).success(function(data){
        $scope.notice = 'done.';
        $timeout(function(){
          $route.reload();
        }, 100);
      }).error(function(data){
        $scope.notice = 'error.';
      })
    };

    $scope.popupDelete = function(notification) {
      $scope.notification = angular.copy(notification);
      $scope.popup = {
        action: NotificationService.Action.DELETE,
        message: 'Delete notification',
        show: true
      };
    };

    $scope.popupUpvote = function(notification) {
      $scope.notification = angular.copy(notification);
      $scope.popup = {
        action: NotificationService.Action.UPVOTE,
        message: 'Upvoting notification',
        show: true
      };
    };

    $scope.popupEdit = function(notification, marker) {
      if (marker) {
        return $scope.mapEdit(notification, marker);
      }
      $scope.notification = angular.copy(notification);
      $scope.popup = {
        action: NotificationService.Action.EDIT,
        message: 'Edit notification',
        show: true
      };
    };

    $scope.getDistance = function(notification) {
      if (!$scope.mapReady || !notification)
        return 0;
      var center = map.getCenter();
      var radlat1 = Math.PI * center.lat/180;
      var radlat2 = Math.PI * notification.lat/180;
      var radlon1 = Math.PI * center.lng/180;
      var radlon2 = Math.PI * notification.lon/180;
      var theta = center.lng - notification.lon;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      return dist;
    };

    $scope.getCount = function() {
      var visible = 0;
      for (var i = 0; i < $scope.notifications.length; ++i) {
        if ($scope.isVisible($scope.notifications[i])) {
          ++visible;
        }
      }
      var total = $scope.notifications.length;
      if (visible < total) return visible + " of " + total;
      return "all";
    };

    $scope.isVisible = function(notification) {
      if (!$scope.mapReady || !notification)
        return false;
      var border = map.getBounds();
      return border.contains(new L.LatLng(notification.lat, notification.lon));
    };

    $scope.center = function(notification) {
      map.panTo(new L.LatLng(notification.lat, notification.lon), 8);
    };

    $scope.showDeleteForm = function() {
      return $scope.popup && ($scope.popup.action == NotificationService.Action.DELETE);
    };

    $scope.showEditForm = function() {
      return $scope.popup && ($scope.popup.action == NotificationService.Action.EDIT);
    };

    $scope.showUpvoteForm = function() {
      return $scope.popup && ($scope.popup.action == NotificationService.Action.UPVOTE);
    };

    $scope.requestDelete = function(notification) {
      $scope.notice = "deleting...";
      $scope.request(NotificationService.Action.DELETE, notification);
    };

    $scope.requestEdit = function(notification, marker) {
      $scope.notice = "editing...";
      $scope.request(NotificationService.Action.EDIT, notification, marker);
    };

    $scope.requestUpvote = function(notification) {
      $scope.notice = "upvoting...";
      $scope.request(NotificationService.Action.UPVOTE, notification);
    };

    $scope.requestAdd = function(notification, marker) {
      $scope.notice = "adding...";
      $scope.request(NotificationService.Action.ADD, notification, marker);
    };


    $scope.cancelAdd = function() {
      map.removeLayer($scope.marker);
    };

    $scope.cancelEdit = function(notification, marker) {
      if (marker) {
        marker.closePopup();
        marker.bindPopup($scope.getNotificationPopupText(notification, marker));
        marker.setLatLng([notification.lat, notification.lon]);
      } else {
        $scope.popup = null;
      }
    };

    $scope.getNotificationPopupText = function(notification, marker) {
        var scope = $scope.$new();
        scope.notification = notification;
        scope.marker = marker;
        var compiled = $compile('<div waze-popup></div>')(scope);
        var html = compiled[0];
        return html;
    };

    $scope.addNotification = function(notification, action, popupOptions) {
      var html, options;

      if (action == NotificationService.Action.EDIT) {
        options = { draggable: true };
      };

      var marker = L.marker([notification.lat, notification.lon], options).addTo(map);      

      if (action == NotificationService.Action.EDIT) {
        html = $scope.getNotificationPopupText(notification, marker);
      } else if (action == NotificationService.Action.ADD) {
        var compiled = linkFunc($scope);
        html = compiled[0];
      }

      var popup = L.popup(popupOptions).setContent(html);

      marker.bindPopup(popup);

      if (action == NotificationService.Action.EDIT) {
        marker.on('dragend', function(e){
          $scope.mapEdit(notification, marker);
          $scope.$apply();
          marker.openPopup();
        });
      }
      return marker;
    };

    $scope.resetNotifications = function(data) {
      for (var i = 0; i < data.length; ++i) {
        if (!data[i] || !data[i].is_active) {
          continue;
        }
        $scope.notifications.push(data[i]);
        $scope.addNotification(data[i], NotificationService.Action.EDIT);
      }
    };
  }]);
