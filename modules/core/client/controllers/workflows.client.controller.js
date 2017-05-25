(function () {
  'use strict';

  angular
    .module('core')
    .controller('WorkflowsController', WorkflowsController);
  WorkflowsController.$inject = ['$state', 'Authentication', '$translate'];
  function WorkflowsController($state, Authentication, $translate) {
    var vm = this;
  }
}());
