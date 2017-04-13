(function () {
  'use strict';

  angular
    .module('uploadfiles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Uploadfiles',
      state: 'uploadfiles',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'uploadfiles', {
      title: 'List Uploadfiles',
      state: 'uploadfiles.list',
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'uploadfiles', {
      title: 'Create Uploadfile',
      state: 'uploadfiles.create',
      roles: ['admin']
    });
  }
}());
