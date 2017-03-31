(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsListController', PogfapprovalsListController);

  
  

  PogfapprovalsListController.$inject = ['PogfapprovalsService', '$scope'];

  function PogfapprovalsListController(PogfapprovalsService, $scope) {
    var vm = this;

    vm.pogfapprovals = PogfapprovalsService.query();
    var str = "";
    // while(true){
    //   if(vm.pogfapprovals.length){
    //     var appro = vm.pogfapprovals[0];
    //     for(var key in appro) {
    //       alert('key'+key);
    //     }
    //   }
    // }
  }

  
}());
