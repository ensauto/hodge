(function () {
  'use strict';

  angular
    .module('uploadfiles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('uploadfiles', {
        abstract: true,
        url: '/uploadfiles',
        template: '<ui-view/>'
      })
      .state('uploadfiles.list', {
        url: '',
        templateUrl: '/modules/uploadfiles/client/views/list-uploadfiles.client.view.html',
        controller: 'UploadfilesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Uploadfiles List'
        }
      })
      .state('uploadfiles.create', {
        url: '/create',
        templateUrl: '/modules/uploadfiles/client/views/form-uploadfile.client.view.html',
        controller: 'UploadfilesController',
        controllerAs: 'vm',
        resolve: {
          uploadfileResolve: newUploadfile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Uploadfiles Create'
        }
      })
      .state('uploadfiles.edit', {
        url: '/:uploadfileId/edit',
        templateUrl: '/modules/uploadfiles/client/views/form-uploadfile.client.view.html',
        controller: 'UploadfilesController',
        controllerAs: 'vm',
        resolve: {
          uploadfileResolve: getUploadfile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Uploadfile {{ uploadfileResolve.name }}'
        }
      })
      .state('uploadfiles.view', {
        url: '/:uploadfileId',
        templateUrl: '/modules/uploadfiles/client/views/view-uploadfile.client.view.html',
        controller: 'UploadfilesController',
        controllerAs: 'vm',
        resolve: {
          uploadfileResolve: getUploadfile
        },
        data: {
          pageTitle: 'Uploadfile {{ uploadfileResolve.name }}'
        }
      });
  }

  getUploadfile.$inject = ['$stateParams', 'UploadfilesService'];

  function getUploadfile($stateParams, UploadfilesService) {
    return UploadfilesService.get({
      uploadfileId: $stateParams.uploadfileId
    }).$promise;
  }

  newUploadfile.$inject = ['UploadfilesService'];

  function newUploadfile(UploadfilesService) {
    return new UploadfilesService();
  }
}());
