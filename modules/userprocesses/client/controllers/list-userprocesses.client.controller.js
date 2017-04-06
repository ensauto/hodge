(function () {
  'use strict';

  angular
    .module('userprocesses')
    .controller('UserprocessesListController', UserprocessesListController);

  UserprocessesListController.$inject = ['UserprocessesService'];

  function UserprocessesListController(UserprocessesService) {
    var vm = this;

    vm.userprocesses = UserprocessesService.query();
  }
}());
