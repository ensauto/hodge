(function () {
  'use strict';

  angular
    .module('pogfapprovals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    // Set top bar menu items
    $translate(['Outgoing_File_Approval', 'Outgoing_File_Approval', 'List_Outgoing_File_Approval', 'Create_Outgoing_File_Approval', 'Task_Done']).then(function (translations) {
      menuService.addMenuItem('topbar', {
        title: translations.Outgoing_File_Approval,
        state: 'pogfapprovals',
        type: 'dropdown',
        roles: ['user']
      });
      menuService.addSubMenuItem('topbar', 'pogfapprovals', {
        title: translations.List_Outgoing_File_Approval,
        state: 'pogfapprovals.list'
      });

      // Add the dropdown create item
      menuService.addSubMenuItem('topbar', 'pogfapprovals', {
        title: translations.Create_Outgoing_File_Approval,
        state: 'pogfapprovals.create',
        roles: ['user']
      });

      // Add the dropdown list item
      menuService.addSubMenuItem('topbar', 'pogfapprovals', {
        title: translations.Task_Done,
        state: 'pogfapprovals.taskdone'
      });
      

    });
    

    // Add the dropdown list item
    
  }
}());
