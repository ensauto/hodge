(function () {
  'use strict';

  angular
    .module('datacubes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('datacubes', {
        abstract: true,
        url: '/datacubes',
        template: '<ui-view/>'
      })
      .state('datacubes.list', {
        url: '',
        templateUrl: '/modules/datacubes/client/views/list-datacubes.client.view.html',
        controller: 'DatacubesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Datacubes List'
        }
      })
      .state('datacubes.create', {
        url: '/create',
        templateUrl: '/modules/datacubes/client/views/form-datacube.client.view.html',
        controller: 'DatacubesController',
        controllerAs: 'vm',
        resolve: {
          datacubeResolve: newDatacube
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Datacubes Create'
        }
      })
      .state('datacubes.edit', {
        url: '/:datacubeId/edit',
        templateUrl: '/modules/datacubes/client/views/form-datacube.client.view.html',
        controller: 'DatacubesController',
        controllerAs: 'vm',
        resolve: {
          datacubeResolve: getDatacube
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Datacube {{ datacubeResolve.name }}'
        }
      })
      .state('datacubes.view', {
        url: '/:datacubeId',
        templateUrl: '/modules/datacubes/client/views/view-datacube.client.view.html',
        controller: 'DatacubesController',
        controllerAs: 'vm',
        resolve: {
          datacubeResolve: getDatacube
        },
        data: {
          pageTitle: 'Datacube {{ datacubeResolve.name }}'
        }
      });
  }

  getDatacube.$inject = ['$stateParams', 'DatacubesService'];

  function getDatacube($stateParams, DatacubesService) {
    return DatacubesService.get({
      datacubeId: $stateParams.datacubeId
    }).$promise;
  }

  newDatacube.$inject = ['DatacubesService'];

  function newDatacube(DatacubesService) {
    return new DatacubesService();
  }
}());
