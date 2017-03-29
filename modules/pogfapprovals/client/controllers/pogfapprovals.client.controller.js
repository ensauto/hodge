(function () {
  'use strict';

  // Pogfapprovals controller
  angular
    .module('pogfapprovals')
    .controller('PogfapprovalsController', PogfapprovalsController);

  PogfapprovalsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pogfapprovalResolve', 'FileUploader'];

  function PogfapprovalsController ($scope, $state, $window, Authentication, pogfapproval, FileUploader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pogfapproval = pogfapproval;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pogfapproval
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pogfapproval.$remove($state.go('pogfapprovals.list'));
      }
    }

    // Save Pogfapproval
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pogfapprovalForm');
        return false;
      }
      
      // TODO: move create/update logic to service
      if (vm.pogfapproval._id) {
        vm.pogfapproval.$update(successCallback, errorCallback);
      } else {
        vm.pogfapproval.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pogfapprovals.view', {
          pogfapprovalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    var uploader = $scope.uploader = new FileUploader({
            url: '/api/uploadfiles?processName=ogfapproval&processId=' + vm.pogfapproval._id ///?processName=ogfapproval&processId=' + vm.pogfapproval._id
        });

    // FILTERS
    //if(uploader)alert("I have uploader");
  
    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });
  
    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        $state.reload();
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    

  }
}());
