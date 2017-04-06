(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsTaskDoneController', PogfapprovalsTaskDoneController);

  PogfapprovalsTaskDoneController.$inject = ['PogfapprovalsService', 'UserprocessesService', '$scope', 'Authentication'];

  function PogfapprovalsTaskDoneController(PogfapprovalsService, UserprocessesService, $scope, Authentication) {
    var vm = this;
    //if(UserprocessesService) 
    /*alert('I have the service'+Authentication.user);
    var user = Authentication.user;
    var keyset = "";
    for (var key in user){
      keyset = keyset + key + '-';
    }
    alert(keyset);
    */
    UserprocessesService.query({processName: "pogfapproval"}).$promise.then(function (result) {
      alert(result.length);
    });;

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
