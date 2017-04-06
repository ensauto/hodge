(function () {
  'use strict';

  angular
    .module('core.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
    $stateProvider
      .state('process', {
        abstract: true,
        url: '/process',
        template: '<ui-view/>',
        data: {
          roles: ['user']
        }
      });

  }
}());
