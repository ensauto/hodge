(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Outgoing File Approval',
      state: 'pogfapprovals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pogfapprovals', {
      title: 'List Outgoing File Approval',
      state: 'pogfapprovals.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pogfapprovals', {
      title: 'Create Outgoing File Approval',
      state: 'pogfapprovals.create',
      roles: ['user']
    });
  }
}());
