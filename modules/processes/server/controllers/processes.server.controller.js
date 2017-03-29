'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Process = mongoose.model('Process'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Process
 */
exports.create = function(req, res) {
  console.log('processes');
  var process = new Process(req.body);
  process.user = req.user;

  process.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(process);
    }
  });
};

/**
 * Show the current Process
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var process = req.process ? req.process.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  process.isCurrentUserOwner = req.user && process.user && process.user._id.toString() === req.user._id.toString();

  res.jsonp(process);
};

/**
 * Update a Process
 */
exports.update = function(req, res) {
  var process = req.process;

  process = _.extend(process, req.body);

  process.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(process);
    }
  });
};

/**
 * Delete an Process
 */
exports.delete = function(req, res) {
  var process = req.process;

  process.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(process);
    }
  });
};

/**
 * List of Processes
 */
exports.list = function(req, res) {
  Process.find().sort('-created').populate('user', 'displayName').exec(function(err, processes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(processes);
    }
  });
};

/**
 * Process middleware
 */
exports.processByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Process is invalid'
    });
  }

  Process.findById(id).populate('user', 'displayName').exec(function (err, process) {
    if (err) {
      return next(err);
    } else if (!process) {
      return res.status(404).send({
        message: 'No Process with that identifier has been found'
      });
    }
    req.process = process;
    next();
  });
};
