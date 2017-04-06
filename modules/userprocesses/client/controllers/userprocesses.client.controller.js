(function () {
  'use strict';

  // Userprocesses controller
  angular
    .module('userprocesses')
    .controller('UserprocessesController', UserprocessesController);

  UserprocessesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userprocessResolve'];

  function UserprocessesController ($scope, $state, $window, Authentication, userprocess) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userprocess = userprocess;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Userprocess
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.userprocess.$remove($state.go('userprocesses.list'));
      }
    }

    // Save Userprocess
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userprocessForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userprocess._id) {
        vm.userprocess.$update(successCallback, errorCallback);
      } else {
        vm.userprocess.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('userprocesses.view', {
          userprocessId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
