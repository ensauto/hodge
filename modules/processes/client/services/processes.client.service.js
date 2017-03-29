// Processes service used to communicate Processes REST endpoints
(function () {
  'use strict';

  angular
    .module('processes')
    .factory('ProcessesService', ProcessesService);

  ProcessesService.$inject = ['$resource'];

  function ProcessesService($resource) {
    return $resource('/api/processes/:processId', {
      processId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
