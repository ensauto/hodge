'use strict';

/**
 * Module dependencies
 */
var processesPolicy = require('../policies/processes.server.policy'),
  processes = require('../controllers/processes.server.controller');

module.exports = function(app) {
  // Processes Routes
  app.route('/api/processes').all(processesPolicy.isAllowed)
    .get(processes.list)
    .post(processes.create);

  app.route('/api/processes/:processId').all(processesPolicy.isAllowed)
    .get(processes.read)
    .put(processes.update)
    .delete(processes.delete);

  // Finish by binding the Process middleware
  app.param('processId', processes.processByID);
};
