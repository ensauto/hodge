'use strict';

/**
 * Module dependencies
 */
var dboardErpreportsPolicy = require('../policies/dboard-erpreports.server.policy'),
  dboardErpreports = require('../controllers/dboard-erpreports.server.controller');

module.exports = function(app) {
  // Dboard erpreports Routes
  app.route('/api/dboard-erpreports').all(dboardErpreportsPolicy.isAllowed)
    .get(dboardErpreports.list)
    .post(dboardErpreports.create);

  app.route('/api/dboard-erpreports/:dboardErpreportId').all(dboardErpreportsPolicy.isAllowed)
    .get(dboardErpreports.read)
    .put(dboardErpreports.update)
    .delete(dboardErpreports.delete);

  // Finish by binding the Dboard erpreport middleware
  app.param('dboardErpreportId', dboardErpreports.dboardErpreportByID);
};
