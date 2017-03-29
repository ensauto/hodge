// Pogfapprovals service used to communicate Pogfapprovals REST endpoints
(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .factory('PogfapprovalsService', PogfapprovalsService);

  PogfapprovalsService.$inject = ['$resource'];

  function PogfapprovalsService($resource) {
    return $resource('/api/pogfapprovals/:pogfapprovalId', {
      pogfapprovalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
