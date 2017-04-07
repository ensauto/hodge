(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsTaskDoneController', PogfapprovalsTaskDoneController);

  PogfapprovalsTaskDoneController.$inject = ['PogfapprovalsService', 'UserprocessesService', '$scope', 'Authentication', 'usSpinnerService'];

  function PogfapprovalsTaskDoneController(PogfapprovalsService, UserprocessesService, $scope, Authentication, usSpinnerService) {
    var vm = this;
    usSpinnerService.spin('spinner-1');
    UserprocessesService.query({findBy: "userId"}).$promise.then(function (taskDoneProcesses) {
      
      if (taskDoneProcesses.length > 1 || taskDoneProcesses.length === 0) {
        usSpinnerService.stop('spinner-1');
      } else {
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
      }
      
    });;

  }

  
}());
