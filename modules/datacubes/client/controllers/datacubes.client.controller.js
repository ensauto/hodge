(function () {
  'use strict';

  // Datacubes controller
  angular
    .module('datacubes')
    .controller('DatacubesController', DatacubesController);

  DatacubesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'datacubeResolve'];

  function DatacubesController ($scope, $state, $window, Authentication, datacube) {
    var vm = this;

    vm.authentication = Authentication;
    vm.datacube = datacube;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Datacube
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.datacube.$remove($state.go('datacubes.list'));
      }
    }

    // Save Datacube
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.datacubeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.datacube._id) {
        vm.datacube.$update(successCallback, errorCallback);
      } else {
        vm.datacube.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('datacubes.view', {
          datacubeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
