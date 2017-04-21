(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsTaskDoneController', PogfapprovalsTaskDoneController);

  PogfapprovalsTaskDoneController.$inject = ['PogfapprovalsService', 'UserprocessesService', '$scope', 'Authentication', 'usSpinnerService', '$http', '$state'];

  function PogfapprovalsTaskDoneController(PogfapprovalsService, UserprocessesService, $scope, Authentication, usSpinnerService, $http, $state) {
    var vm = this;
    vm.dismiss = dismiss;
    function dismiss(processId) {
      $http.delete('/api/pogfapprovals/' + processId, {params: {deleteType: "dismiss"}}).then(function () {
        $state.reload();
      }); 
    }

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
        var processIdsRev = [];
        while (processIds.length) {
          processIdsRev.push(processIds.pop());
        }
        PogfapprovalsService.query({processIds: processIdsRev.toString()}).$promise.then(function(pogfapprovals){
          vm.pogfapprovals = pogfapprovals;
          usSpinnerService.stop('spinner-1');
        });
      }
      
    });;

  }

  
}());
