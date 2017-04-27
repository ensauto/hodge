(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
  HomeController.$inject = ['$state'];
  function HomeController($state) {
    var vm = this;
    $state.go("pogfapprovals.list");
  }
}());
