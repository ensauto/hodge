'use strict';

/**
 * Module dependencies
 */
var datacubesPolicy = require('../policies/datacubes.server.policy'),
  datacubes = require('../controllers/datacubes.server.controller');

module.exports = function(app) {
  // Datacubes Routes
  app.route('/api/datacubes').all(datacubesPolicy.isAllowed)
    .get(datacubes.list)
    .post(datacubes.create);

  app.route('/api/datacubes/:datacubeId').all(datacubesPolicy.isAllowed)
    .get(datacubes.read)
    .put(datacubes.update)
    .delete(datacubes.delete);

  // Finish by binding the Datacube middleware
  app.param('datacubeId', datacubes.datacubeByID);
};
