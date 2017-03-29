(function () {
  'use strict';

  angular
    .module('processes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('processes', {
        abstract: true,
        url: '/processes',
        template: '<ui-view/>'
      })
      .state('processes.list', {
        url: '',
        templateUrl: '/modules/processes/client/views/list-processes.client.view.html',
        controller: 'ProcessesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Processes List'
        }
      })
      .state('processes.create', {
        url: '/create',
        templateUrl: '/modules/processes/client/views/form-process.client.view.html',
        controller: 'ProcessesController',
        controllerAs: 'vm',
        resolve: {
          processResolve: newProcess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Processes Create'
        }
      })
      .state('processes.edit', {
        url: '/:processId/edit',
        templateUrl: '/modules/processes/client/views/form-process.client.view.html',
        controller: 'ProcessesController',
        controllerAs: 'vm',
        resolve: {
          processResolve: getProcess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Process {{ processResolve.name }}'
        }
      })
      .state('processes.view', {
        url: '/:processId',
        templateUrl: '/modules/processes/client/views/view-process.client.view.html',
        controller: 'ProcessesController',
        controllerAs: 'vm',
        resolve: {
          processResolve: getProcess
        },
        data: {
          pageTitle: 'Process {{ processResolve.name }}'
        }
      });
  }

  getProcess.$inject = ['$stateParams', 'ProcessesService'];

  function getProcess($stateParams, ProcessesService) {
    return ProcessesService.get({
      processId: $stateParams.processId
    }).$promise;
  }

  newProcess.$inject = ['ProcessesService'];

  function newProcess(ProcessesService) {
    return new ProcessesService();
  }
}());
