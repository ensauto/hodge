(function () {
  'use strict';

  angular
    .module('userprocesses')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Userprocesses',
      state: 'userprocesses',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userprocesses', {
      title: 'List Userprocesses',
      state: 'userprocesses.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'userprocesses', {
      title: 'Create Userprocess',
      state: 'userprocesses.create',
      roles: ['admin']
    });
  }
}());
