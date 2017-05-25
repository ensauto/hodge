(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    

    $stateProvider
      .state('pogfapprovals', {
        abstract: true,
        url: '/pogfapprovals',
        template: '<ui-view/>'
      })
      .state('pogfapprovals.list', {
        url: '',
        templateUrl: '/modules/pogfapprovals/client/views/list-pogfapprovals.client.view.html',
        controller: 'PogfapprovalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pogfapprovals List'
        }
      })
      .state('pogfapprovals.taskdone', {
        url: '/taskdone',
        templateUrl: '/modules/pogfapprovals/client/views/taskdone-pogfapprovals.client.view.html',
        controller: 'PogfapprovalsTaskDoneController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pogfapprovals Task Done'
        }
      })
      .state('pogfapprovals.create', {
        url: '/create',
        templateUrl: '/modules/pogfapprovals/client/views/form-pogfapproval.client.view.html',
        controller: 'PogfapprovalsController',
        controllerAs: 'vm',
        resolve: {
          pogfapprovalResolve: newPogfapproval
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pogfapprovals Create'
        }
      })
      .state('pogfapprovals.edit', {
        url: '/:pogfapprovalId/edit',
        templateUrl: '/modules/pogfapprovals/client/views/form-pogfapproval.client.view.html',
        controller: 'PogfapprovalsController',
        controllerAs: 'vm',
        resolve: {
          pogfapprovalResolve: getPogfapproval
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pogfapproval {{ pogfapprovalResolve.name }}'
        }
      })
      .state('pogfapprovals.view', {
        url: '/:pogfapprovalId',
        templateUrl: '/modules/pogfapprovals/client/views/view-pogfapproval.client.view.html',
        controller: 'PogfapprovalsController',
        controllerAs: 'vm',
        resolve: {
          pogfapprovalResolve: getPogfapproval
        },
        data: {
          pageTitle: 'Pogfapproval {{ pogfapprovalResolve.name }}'
        }
      });
  }

  getPogfapproval.$inject = ['$stateParams', 'PogfapprovalsService'];

  function getPogfapproval($stateParams, PogfapprovalsService) {
    return PogfapprovalsService.get({
      pogfapprovalId: $stateParams.pogfapprovalId
    }).$promise;
  }

  newPogfapproval.$inject = ['PogfapprovalsService'];

  function newPogfapproval(PogfapprovalsService) {
    return new PogfapprovalsService();
  }
}());
