// Dboard erpreports service used to communicate Dboard erpreports REST endpoints
(function () {
  'use strict';

  angular
    .module('dboard-erpreports')
    .factory('DboardErpreportsService', DboardErpreportsService);

  DboardErpreportsService.$inject = ['$resource'];

  function DboardErpreportsService($resource) {
    return $resource('api/dboard-erpreports/:dboardErpreportId', {
      dboardErpreportId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
