(function () {
  'use strict';

  // Dboard erpreports controller
  angular
    .module('dboard-erpreports')
    .controller('DboardErpreportsController', DboardErpreportsController);

  DboardErpreportsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dboardErpreportResolve'];

  function DboardErpreportsController ($scope, $state, $window, Authentication, dboardErpreport) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dboardErpreport = dboardErpreport;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Dboard erpreport
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.dboardErpreport.$remove($state.go('dboard-erpreports.list'));
      }
    }

    // Save Dboard erpreport
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dboardErpreportForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dboardErpreport._id) {
        vm.dboardErpreport.$update(successCallback, errorCallback);
      } else {
        vm.dboardErpreport.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('dboard-erpreports.view', {
          dboardErpreportId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
