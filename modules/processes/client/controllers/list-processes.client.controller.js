(function () {
  'use strict';

  angular
    .module('processes')
    .controller('ProcessesListController', ProcessesListController);

  ProcessesListController.$inject = ['ProcessesService'];

  function ProcessesListController(ProcessesService) {
    var vm = this;

    vm.processes = ProcessesService.query();
  }
}());
