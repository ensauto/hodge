(function () {
  'use strict';

  angular
    .module('core')
    .controller('ModulesController', ModulesController);
  ModulesController.$inject = ['$state', 'Authentication'];
  function ModulesController($state, Authentication) {
    var vm = this;
  }
}());
