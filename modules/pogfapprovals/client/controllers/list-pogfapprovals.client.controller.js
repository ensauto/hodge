(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsListController', PogfapprovalsListController);

  
  

  PogfapprovalsListController.$inject = ['PogfapprovalsService', '$scope'];

  function PogfapprovalsListController(PogfapprovalsService, $scope) {
    var vm = this;

    vm.pogfapprovals = PogfapprovalsService.query();
    
  }

  
}());
