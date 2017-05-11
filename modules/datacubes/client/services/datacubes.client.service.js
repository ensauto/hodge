// Datacubes service used to communicate Datacubes REST endpoints
(function () {
  'use strict';

  angular
    .module('datacubes')
    .factory('DatacubesService', DatacubesService);

  DatacubesService.$inject = ['$resource'];

  function DatacubesService($resource) {
    return $resource('/api/datacubes/:datacubeId', {
      datacubeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
