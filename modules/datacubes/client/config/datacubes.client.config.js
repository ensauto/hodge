(function () {
  'use strict';

  angular
    .module('datacubes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Datacubes',
      state: 'datacubes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'datacubes', {
      title: 'List Datacubes',
      state: 'datacubes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'datacubes', {
      title: 'Create Datacube',
      state: 'datacubes.create',
      roles: ['user']
    });
  }
}());
