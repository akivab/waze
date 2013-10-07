'use strict';

/* Services */

angular.module('Waze.services', [])
.factory('NotificationService', function($http) {
  var NotificationService = function() {
    this.request = function(action, params) {
      this.ModifyNotificationParams(params);
      var cleanParams = this.WithoutUnusedParams(params);
      var url = this.GetUrl(action, cleanParams);
      this.SetMethod(action, cleanParams);     
      return $http.get(url, { params: cleanParams });
    };

    this.GetUrl = function(action, params) {
      var url = '/notifications';
      switch (action) {
        case this.Action.EDIT:
        case this.Action.DELETE:
          url += '/' + params.id + '.json';
          break;
        case this.Action.ADD:
        case this.Action.GET:
          url += '.json';
          break;
        case this.Action.UPVOTE:
          url += '/' + params.id + '/upvote.json';
          break;
        case this.Action.UPDATE:
          url += '/updates.json';
          break;
        default:
          throw Error('Not recognized action: ' + action);
          break;
      }
      return url;
    };

    this.SetMethod = function(action, params) {
      switch (action) {
        case this.Action.UPDATE:
        case this.Action.GET:
          params.method = 'get';          
          break;
        case this.Action.EDIT:
        case this.Action.UPVOTE:
          params.method = 'put';
          break;
        case this.Action.DELETE:
          params.method = 'delete';
          break;
        case this.Action.ADD:
          params.method = 'post';
          break;
        default:
          throw Error('Not recognized action: ' + action);
          break;
        }
     };

    this.ModifyNotificationParams = function(params) {
      var keys = ['title', 'description', 'lat', 'lon']
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        params['notification[' + key + ']'] = params[key]; 
      }
    };

    this.WithoutUnusedParams = function(params) {
      var tokeep = ['notification[title]',
                    'notification[description]',
                    'notification[lat]',
                    'notification[lon]',
                    'since',
                    'id',
                    'method'];
      var tmp = {};
      for (var i = 0; i < tokeep.length; ++i) {
        if (params[tokeep[i]]) {
          tmp[tokeep[i]] = params[tokeep[i]];
        }
      }
      return tmp;
    };

    this.Action = {
      ADD: 'ADD',
      EDIT: 'EDIT',
      DELETE: 'DELETE',
      UPVOTE: 'UPVOTE',
      UPDATE: 'UPDATE',
      GET: 'GET'
    };
  }
  return new NotificationService();
});
