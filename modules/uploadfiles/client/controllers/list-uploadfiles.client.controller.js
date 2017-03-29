(function () {
  'use strict';

  angular
    .module('uploadfiles')
    .controller('UploadfilesListController', UploadfilesListController);

  UploadfilesListController.$inject = ['UploadfilesService'];

  function UploadfilesListController(UploadfilesService) {
    var vm = this;

    vm.uploadfiles = UploadfilesService.query();
  }
}());
