'use strict';

/**
 * Module dependencies
 */
var pogfapprovalsPolicy = require('../policies/pogfapprovals.server.policy'),
  pogfapprovals = require('../controllers/pogfapprovals.server.controller'),
  filter = require('../../../core/server/filters/core.server.filter');

module.exports = function(app) {
  // Pogfapprovals Routes
  app.route('/api/pogfapprovals').all(pogfapprovalsPolicy.isAllowed)
    .get(pogfapprovals.list)
    .post(pogfapprovals.create);

  app.route('/api/pogfapprovals/:pogfapprovalId').all(pogfapprovalsPolicy.isAllowed)
    .get(filter.cors, pogfapprovals.read)
    .put(pogfapprovals.update)
    .delete(pogfapprovals.delete);

  // Finish by binding the Pogfapproval middleware
  app.param('pogfapprovalId', pogfapprovals.pogfapprovalByID);
};
