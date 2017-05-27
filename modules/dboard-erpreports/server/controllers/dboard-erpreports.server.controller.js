'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  DboardErpreport = mongoose.model('DboardErpreport'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Dboard erpreport
 */
exports.create = function(req, res) {
  var dboardErpreport = new DboardErpreport(req.body);
  dboardErpreport.user = req.user;

  dboardErpreport.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dboardErpreport);
    }
  });
};

/**
 * Show the current Dboard erpreport
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dboardErpreport = req.dboardErpreport ? req.dboardErpreport.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dboardErpreport.isCurrentUserOwner = req.user && dboardErpreport.user && dboardErpreport.user._id.toString() === req.user._id.toString();

  res.jsonp(dboardErpreport);
};

/**
 * Update a Dboard erpreport
 */
exports.update = function(req, res) {
  var dboardErpreport = req.dboardErpreport;

  dboardErpreport = _.extend(dboardErpreport, req.body);

  dboardErpreport.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dboardErpreport);
    }
  });
};

/**
 * Delete an Dboard erpreport
 */
exports.delete = function(req, res) {
  var dboardErpreport = req.dboardErpreport;

  dboardErpreport.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dboardErpreport);
    }
  });
};

/**
 * List of Dboard erpreports
 */
exports.list = function(req, res) {
  DboardErpreport.find().sort('-created').populate('user', 'displayName').exec(function(err, dboardErpreports) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dboardErpreports);
    }
  });
};

/**
 * Dboard erpreport middleware
 */
exports.dboardErpreportByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dboard erpreport is invalid'
    });
  }

  DboardErpreport.findById(id).populate('user', 'displayName').exec(function (err, dboardErpreport) {
    if (err) {
      return next(err);
    } else if (!dboardErpreport) {
      return res.status(404).send({
        message: 'No Dboard erpreport with that identifier has been found'
      });
    }
    req.dboardErpreport = dboardErpreport;
    next();
  });
};
