'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Datacube = mongoose.model('Datacube'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Datacube
 */
exports.create = function(req, res) {
  var datacube = new Datacube(req.body);
  datacube.user = req.user;

  datacube.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datacube);
    }
  });
};

/**
 * Show the current Datacube
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var datacube = req.datacube ? req.datacube.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  datacube.isCurrentUserOwner = req.user && datacube.user && datacube.user._id.toString() === req.user._id.toString();

  res.jsonp(datacube);
};

/**
 * Update a Datacube
 */
exports.update = function(req, res) {
  var datacube = req.datacube;

  datacube = _.extend(datacube, req.body);

  datacube.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datacube);
    }
  });
};

/**
 * Delete an Datacube
 */
exports.delete = function(req, res) {
  var datacube = req.datacube;

  datacube.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datacube);
    }
  });
};

/**
 * List of Datacubes
 */
exports.list = function(req, res) {
  Datacube.find().sort('-created').populate('user', 'displayName').exec(function(err, datacubes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datacubes);
    }
  });
};

/**
 * Datacube middleware
 */
exports.datacubeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Datacube is invalid'
    });
  }

  Datacube.findById(id).populate('user', 'displayName').exec(function (err, datacube) {
    if (err) {
      return next(err);
    } else if (!datacube) {
      return res.status(404).send({
        message: 'No Datacube with that identifier has been found'
      });
    }
    req.datacube = datacube;
    next();
  });
};
