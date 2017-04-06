(function () {
  'use strict';

  angular
    .module('userprocesses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userprocesses', {
        abstract: true,
        url: '/userprocesses',
        template: '<ui-view/>'
      })
      .state('userprocesses.list', {
        url: '',
        templateUrl: '/modules/userprocesses/client/views/list-userprocesses.client.view.html',
        controller: 'UserprocessesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userprocesses List'
        }
      })
      .state('userprocesses.create', {
        url: '/create',
        templateUrl: '/modules/userprocesses/client/views/form-userprocess.client.view.html',
        controller: 'UserprocessesController',
        controllerAs: 'vm',
        resolve: {
          userprocessResolve: newUserprocess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Userprocesses Create'
        }
      })
      .state('userprocesses.edit', {
        url: '/:userprocessId/edit',
        templateUrl: '/modules/userprocesses/client/views/form-userprocess.client.view.html',
        controller: 'UserprocessesController',
        controllerAs: 'vm',
        resolve: {
          userprocessResolve: getUserprocess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userprocess {{ userprocessResolve.name }}'
        }
      })
      .state('userprocesses.view', {
        url: '/:userprocessId',
        templateUrl: '/modules/userprocesses/client/views/view-userprocess.client.view.html',
        controller: 'UserprocessesController',
        controllerAs: 'vm',
        resolve: {
          userprocessResolve: getUserprocess
        },
        data: {
          pageTitle: 'Userprocess {{ userprocessResolve.name }}'
        }
      });
  }

  getUserprocess.$inject = ['$stateParams', 'UserprocessesService'];

  function getUserprocess($stateParams, UserprocessesService) {
    return UserprocessesService.get({
      userprocessId: $stateParams.userprocessId
    }).$promise;
  }

  newUserprocess.$inject = ['UserprocessesService'];

  function newUserprocess(UserprocessesService) {
    return new UserprocessesService();
  }
}());
