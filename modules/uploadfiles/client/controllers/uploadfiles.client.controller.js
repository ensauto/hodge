(function () {
  'use strict';

  // Uploadfiles controller
  angular
    .module('uploadfiles')
    .controller('UploadfilesController', UploadfilesController);

  UploadfilesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'uploadfileResolve'];

  function UploadfilesController ($scope, $state, $window, Authentication, uploadfile) {
    var vm = this;

    vm.authentication = Authentication;
    vm.uploadfile = uploadfile;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Uploadfile
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.uploadfile.$remove($state.go('uploadfiles.list'));
      }
    }

    // Save Uploadfile
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.uploadfileForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.uploadfile._id) {
        vm.uploadfile.$update(successCallback, errorCallback);
      } else {
        vm.uploadfile.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('uploadfiles.view', {
          uploadfileId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
