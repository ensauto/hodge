(function () {
  'use strict';

  angular
    .module('processes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Processes',
      state: 'processes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'processes', {
      title: 'List Processes',
      state: 'processes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'processes', {
      title: 'Create Process',
      state: 'processes.create',
      roles: ['user']
    });
  }
}());
