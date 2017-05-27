(function () {
  'use strict';

  angular
    .module('dboard-erpreports')
    .controller('DboardErpreportsListController', DboardErpreportsListController);

  DboardErpreportsListController.$inject = ['DboardErpreportsService'];

  function DboardErpreportsListController(DboardErpreportsService) {
    var vm = this;

    vm.dboardErpreports = DboardErpreportsService.query();
  }
}());
