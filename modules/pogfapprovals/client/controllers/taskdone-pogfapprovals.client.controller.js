(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsTaskDoneController', PogfapprovalsTaskDoneController);

  PogfapprovalsTaskDoneController.$inject = ['PogfapprovalsService', 'UserprocessesService', '$scope', 'Authentication', 'usSpinnerService'];

  function PogfapprovalsTaskDoneController(PogfapprovalsService, UserprocessesService, $scope, Authentication, usSpinnerService) {
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
    usSpinnerService.spin('spinner-1');
    UserprocessesService.query({findBy: "userId"}).$promise.then(function (taskDoneProcesses) {
      
      var userProcess = taskDoneProcesses[0];
      var taskDone = userProcess.taskDone;
      var processIds = []
      for(var i = 0; i < taskDone.length; i++) {
        if (taskDone[i].processName === "pogfapproval") {
          processIds.push(taskDone[i].processId);
        }
      }
      PogfapprovalsService.query({processIds: processIds.toString()}).$promise.then(function(pogfapprovals){
        vm.pogfapprovals = pogfapprovals;
        usSpinnerService.stop('spinner-1');
      });

    });;

    //vm.pogfapprovals = PogfapprovalsService.query();
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
