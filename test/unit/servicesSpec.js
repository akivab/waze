'use strict';

/* jasmine specs for services go here */

describe('NotificationService', function() {
  beforeEach(module('Waze.services'));

  describe('Tests', function() {
    var params = {
      id: 'id',
      title: 'title',
      description: 'desc',
      lat: 10,
      lon: 10
    };

    var Action = {
      ADD: 0,
      EDIT: 1,
      DELETE: 2,
      UPVOTE: 3,
      UPDATE: 4,
      GET: 5
    };

    var expectations = [
      {
        action: Action.GET,
        method: 'get',
        url: '/notification.json'
      }, {
        action: Action.ADD,
        method: 'post',
        url: '/notifications.json'
      }, {
        action: Action.EDIT,
        method: 'put',
        url: '/notifications/id.json'
      }, {
        action: Action.DELETE,
        method: 'delete',
        url: '/notifications/id.json'
      }, {
        action: Action.UPVOTE,
        method: 'put',
        url: '/notifications/id/upvote.json'
      }, {
        action: Action.UPDATE,
        method: 'get',
        url: '/notifications/updates.json'
      }
    ];

    it('should modify correct params', inject(function(NotificationService) {
      var copyParams = angular.copy(params);
      NotificationService.ModifyNotificationParams(copyParams);
      var keys = ['title', 'description', 'lat', 'lon'];
      for (var i in keys) {
        var key = keys[i];
        expect(copyParams['notification[' + key + ']']).toEqual(params[key]);
      }
    }));

    for (var i in expectations) {
      var expectation = expectations[i];
      it('should be correct action for ' + expectation.action,
        inject(function(NotificationService) {
          var copyParams = angular.copy(params);
          var url = NotificationService.GetUrl(expectation.action, copyParams);
          NotificationService.SetMethod(expectation.action, copyParams)
          expect(copyParams.method).toEqual(expectation.method);
          expect(url).toEqual(expectation.url);
        }));
    }
  });
});
