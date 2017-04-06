'use strict';

/**
 * Module dependencies
 */
var userprocessesPolicy = require('../policies/userprocesses.server.policy'),
  userprocesses = require('../controllers/userprocesses.server.controller');

module.exports = function(app) {
  // Userprocesses Routes
  app.route('/api/userprocesses').all(userprocessesPolicy.isAllowed)
    .get(userprocesses.list)
    .post(userprocesses.create);

  app.route('/api/userprocesses/:userprocessId').all(userprocessesPolicy.isAllowed)
    .get(userprocesses.read)
    .put(userprocesses.update)
    .delete(userprocesses.delete);

  // Finish by binding the Userprocess middleware
  app.param('userprocessId', userprocesses.userprocessByID);
};
