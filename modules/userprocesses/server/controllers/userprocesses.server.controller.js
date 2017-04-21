'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Userprocess = mongoose.model('Userprocess'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Userprocess
 */
exports.create = function(req, res) {
  var userprocess = new Userprocess(req.body);
  userprocess.user = req.user;

  userprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userprocess);
    }
  });
};

/**
 * Show the current Userprocess
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userprocess = req.userprocess ? req.userprocess.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userprocess.isCurrentUserOwner = req.user && userprocess.user && userprocess.user._id.toString() === req.user._id.toString();

  res.jsonp(userprocess);
};

/**
 * Update a Userprocess
 */
exports.update = function(req, res) {
  var userprocess = req.userprocess;

  userprocess = _.extend(userprocess, req.body);

  userprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userprocess);
    }
  });
};

/**
 * Delete an Userprocess
 */
exports.delete = function(req, res) {
  var userprocess = req.userprocess;

  userprocess.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userprocess);
    }
  });
};

/**
 * List of Userprocesses
 */
exports.list = function(req, res) {
  var findBy = req.query.findBy;
  var findCriteria = {};
  if (findBy === 'userId') {
    findCriteria.user = req.user._id;
  }
  Userprocess.find(findCriteria).sort('-created').populate('user', 'displayName').exec(function(err, userprocesses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userprocesses);
    }
  });
};

/**
 * Userprocess middleware
 */
exports.userprocessByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userprocess is invalid'
    });
  }

  Userprocess.findById(id).populate('user', 'displayName').exec(function (err, userprocess) {
    if (err) {
      return next(err);
    } else if (!userprocess) {
      return res.status(404).send({
        message: 'No Userprocess with that identifier has been found'
      });
    }
    req.userprocess = userprocess;
    next();
  });
};
