'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Uploadfile = mongoose.model('Uploadfile'),
  PogfapprovalProcess = mongoose.model('PogfapprovalProcess'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  async = require('async');

/**
 * Create a Uploadfile
 */
exports.create = function(req, res) {
  var processId = req.query.processId,
    processName = req.query.processName;
  
  if (!req.files) {
    return res.status(400).send({
      message: 'No files posted'
    });
  }
  async.waterfall([
    function(callback) {
      switch(processName) {
        case 'ogfapproval':
          PogfapprovalProcess.findOne({processId: processId}).exec(function(err, pogfapproval) {
            if (!pogfapproval) {
              return res.status(400).send({
                message: 'No process found'
              });
            }
            callback(null);
          });
          break;
        default:
          ;
      }
    },
    function(callback) {
      var file = req.files[0];
      fs.readFile(file.path, function (err, data) {
        if(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        var newPath = "/storage.hodge/uploads.process/" + processName + '-' + processId + '-' + file.fieldname + '-' + file.filename + '.' + file.mimetype.split('/')[1];
        fs.writeFile(newPath, data, function (err) {
          if(err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          callback(null, file);
        });
      });
    }
  ], function(err, file) { 
    var uploadfile = new Uploadfile({processName: processName, processId: processId, fileFieldName: file.fieldname, filename: file.filename, mimeType: file.mimetype, fileOriginalName: file.originalname, openAccess: false});
    uploadfile.user = req.user;
    uploadfile.save(function(err) {
      if (err) {
        console.log(err, err.stack);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(uploadfile);
      }
    });
  });
  
};

/**
 * Show the current Uploadfile
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var uploadfile = req.uploadfile ? req.uploadfile.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  uploadfile.isCurrentUserOwner = req.user && uploadfile.user && uploadfile.user._id.toString() === req.user._id.toString();
  var get = req.query.get;
  if (get != 'download') {
    res.jsonp(uploadfile);
  } else {
    var processName = uploadfile.processName;
    switch(processName) {
      case 'ogfapproval':
        if(uploadfile.user._id === req.user._id || req.user.roles.indexOf('ogfapprover') || uploadfile.openAccess) {
          //res.download()path.resolve('./modules/core/server/controllers/errors.server.controller')
          res.download(path.resolve('/storage.hodge/uploads.process/' + uploadfile.processName + '-' + uploadfile.processId + '-' + uploadfile.fileFieldName + '-' + uploadfile.filename + '.' + uploadfile.mimeType.split('/')[1]));
          //res.end();
        }
        break;
      case 'approval':
        break;
      default:
          ;
    }
  }
  
   
};

/**
 * Update a Uploadfile
 */
exports.update = function(req, res) {
  var uploadfile = req.uploadfile;

  uploadfile = _.extend(uploadfile, req.body);

  uploadfile.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(uploadfile);
    }
  });
};

/**
 * Delete an Uploadfile
 */
exports.delete = function(req, res) {
  var uploadfile = req.uploadfile;

  uploadfile.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(uploadfile);
    }
  });
};

/**
 * List of Uploadfiles
 */
exports.list = function(req, res) {
  Uploadfile.find().sort('-created').populate('user', 'displayName').exec(function(err, uploadfiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(uploadfiles);
    }
  });
};

/**
 * Uploadfile middleware
 */
exports.uploadfileByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Uploadfile is invalid'
    });
  }

  Uploadfile.findById(id).populate('user', 'displayName').exec(function (err, uploadfile) {
    if (err) {
      return next(err);
    } else if (!uploadfile) {
      return res.status(404).send({
        message: 'No Uploadfile with that identifier has been found'
      });
    }
    req.uploadfile = uploadfile;
    next();
  });
};
