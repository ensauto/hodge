(function () {
  'use strict';

  angular
    .module('uploadfiles')
    .controller('UploadfilesListController', UploadfilesListController);

  UploadfilesListController.$inject = ['UploadfilesService', '$stateParams'];

  function UploadfilesListController(UploadfilesService, $stateParams) {
    var vm = this;
    vm.uploadfiles = UploadfilesService.query({processId: $stateParams.processId});
  }
}());
