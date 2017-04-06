// Userprocesses service used to communicate Userprocesses REST endpoints
(function () {
  'use strict';

  angular
    .module('userprocesses')
    .factory('UserprocessesService', UserprocessesService);

  UserprocessesService.$inject = ['$resource'];

  function UserprocessesService($resource) {
    return $resource('/api/userprocesses/:userprocessId', {
      userprocessId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
