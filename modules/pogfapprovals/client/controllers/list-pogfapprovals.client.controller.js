(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsListController', PogfapprovalsListController);
PogfapprovalsListController.$inject = ['PogfapprovalsService', '$scope', 'usSpinnerService', 'Authentication'];

  function PogfapprovalsListController(PogfapprovalsService, $scope, usSpinnerService, Authentication) {
    var vm = this;
    //usSpinnerService.spin('spinner-1');
    PogfapprovalsService.query().$promise.then(function (pogfapprovals) {
      vm.pogfapprovals = pogfapprovals;
      //usSpinnerService.stop('spinner-1');
    });
    
  }

  
}());
