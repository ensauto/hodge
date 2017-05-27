(function () {
  'use strict';

  angular
    .module('dboard-erpreports')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dboard-erpreports', {
        abstract: true,
        url: '/dboard-erpreports',
        template: '<ui-view/>'
      })
      .state('dboard-erpreports.list', {
        url: '',
        templateUrl: 'modules/dboard-erpreports/client/views/list-dboard-erpreports.client.view.html',
        controller: 'DboardErpreportsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dboard erpreports List'
        }
      })
      .state('dboard-erpreports.create', {
        url: '/create',
        templateUrl: 'modules/dboard-erpreports/client/views/form-dboard-erpreport.client.view.html',
        controller: 'DboardErpreportsController',
        controllerAs: 'vm',
        resolve: {
          dboard-erpreportResolve: newDboardErpreport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Dboard erpreports Create'
        }
      })
      .state('dboard-erpreports.edit', {
        url: '/:dboardErpreportId/edit',
        templateUrl: 'modules/dboard-erpreports/client/views/form-dboard-erpreport.client.view.html',
        controller: 'DboardErpreportsController',
        controllerAs: 'vm',
        resolve: {
          dboard-erpreportResolve: getDboardErpreport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Dboard erpreport {{ dboard-erpreportResolve.name }}'
        }
      })
      .state('dboard-erpreports.view', {
        url: '/:dboardErpreportId',
        templateUrl: 'modules/dboard-erpreports/client/views/view-dboard-erpreport.client.view.html',
        controller: 'DboardErpreportsController',
        controllerAs: 'vm',
        resolve: {
          dboard-erpreportResolve: getDboardErpreport
        },
        data: {
          pageTitle: 'Dboard erpreport {{ dboard-erpreportResolve.name }}'
        }
      });
  }

  getDboardErpreport.$inject = ['$stateParams', 'DboardErpreportsService'];

  function getDboardErpreport($stateParams, DboardErpreportsService) {
    return DboardErpreportsService.get({
      dboardErpreportId: $stateParams.dboardErpreportId
    }).$promise;
  }

  newDboardErpreport.$inject = ['DboardErpreportsService'];

  function newDboardErpreport(DboardErpreportsService) {
    return new DboardErpreportsService();
  }
}());
