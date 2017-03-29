(function () {
  'use strict';

  // Processes controller
  angular
    .module('processes')
    .controller('ProcessesController', ProcessesController);

  ProcessesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'processResolve'];

  function ProcessesController ($scope, $state, $window, Authentication, process) {
    var vm = this;

    vm.authentication = Authentication;
    vm.process = process;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Process
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.process.$remove($state.go('processes.list'));
      }
    }

    // Save Process
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.processForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.process._id) {
        vm.process.$update(successCallback, errorCallback);
      } else {
        vm.process.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('processes.view', {
          processId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
