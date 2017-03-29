// Uploadfiles service used to communicate Uploadfiles REST endpoints
(function () {
  'use strict';

  angular
    .module('uploadfiles')
    .factory('UploadfilesService', UploadfilesService);

  UploadfilesService.$inject = ['$resource'];

  function UploadfilesService($resource) {
    return $resource('/api/uploadfiles/:uploadfileId', {
      uploadfileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
