'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pogfapproval = mongoose.model('Pogfapproval'),
  PogfapprovalProcess = mongoose.model('PogfapprovalProcess'),
  Uploadfile = mongoose.model('Uploadfile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  async = require('async'),
  bpmn = require("bpmn"),
  fs = require('fs');
var manager = new bpmn.ProcessManager({
      persistencyOptions: {
          uri: "mongodb://admin:admin@ds137220.mlab.com:37220/hodge"
      }
  });
//manager.addBpmnFilePath(process.cwd() + "\\modules\\pogfapprovals\\server\\bpmn\\pogfapproval.bpmn"); console.log(process.cwd());
manager.addBpmnFilePath(path.resolve('./modules/pogfapprovals/server/bpmn/pogfapproval.bpmn'));

/**
 * Create a Pogfapproval
 */
exports.create = function(req, res) {
  var pogfapproval = new Pogfapproval(req.body);
  pogfapproval.user = req.user;

  async.waterfall([
    function(callback) {
      pogfapproval.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          callback(null, pogfapproval);
        }
      });
    },
    function(pogfapproval, callback) {
      manager.createProcess(pogfapproval._id + '', function(err, myProcess){
        if (err) 
          callback(err);
        myProcess.triggerEvent("start", {req: req});
        callback(null, pogfapproval);
      });
    }
    ], function (err, pogfapproval) {
      res.jsonp(pogfapproval);
  });
};

/**
 * Show the current Pogfapproval
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pogfapproval = req.pogfapproval ? req.pogfapproval.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pogfapproval.isCurrentUserOwner = req.user && pogfapproval.user && pogfapproval.user._id.toString() === req.user._id.toString();
  async.waterfall([
    function(callback) {
      Uploadfile.find({processName: 'ogfapproval', processId: pogfapproval._id + ''}).exec(function(err, files) {
        callback(null, files);
      })    
    }
  ], function(err, files) {
    pogfapproval.files = files;
    res.jsonp(pogfapproval);  
  });
  
  

  
};

/**
 * Update a Pogfapproval
 */
exports.update = function(req, res) {
  var pogfapproval = req.pogfapproval;
  var submitType = req.body.submitType;

  async.waterfall([
    function(callback) {
      manager.get(req.pogfapproval._id + '', function(err, myProcess) {
        if (err) {
          callback(err);
        }
        callback(null, myProcess);
      })
    }, 
    function(myProcess, callback) {
      if (submitType === 'update') {
        pogfapproval = _.extend(pogfapproval, req.body);

        pogfapproval.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(pogfapproval);
          }
        });  
      } else if (submitType === 'taskDone') {
        var taskName = myProcess.getProperty('task');console.log(1 + taskName);
        switch(taskName) {
          case 'draft':
              myProcess.taskDone(taskName, {req: req});
              break;
          case 'approval':
              myProcess.taskDone(taskName, {req: req});
              myProcess.taskDone('approved', {req: req});
              myProcess.taskDone('rejected', {req: req});
              break;
          default:
              ;
        } 
        res.jsonp(pogfapproval);
      }    
    }
    ], function(err, result) {

    });

  

  
};

/**
 * Delete an Pogfapproval
 */
exports.delete = function(req, res) {
  var pogfapproval = req.pogfapproval;

  pogfapproval.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pogfapproval);
    }
  });
};

/**
 * List of Pogfapprovals
 */
exports.list = function(req, res) {//
  PogfapprovalProcess.find().exec(function(err, processes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else { 

      processes = _.filter(processes, function(o) { 
        var foundRole = false;
        _.forEach(req.user.roles, function(role) {
          if (o.properties.roles.indexOf(role)) {
            foundRole = true;
          }
        })
        var foundUser = false;
        console.log(o.properties.users[0] + ' ' + req.user._id + '');
        foundUser = o.properties.users.indexOf(req.user._id + '');
        return foundUser || foundRole;
      });
      var bpmnXML = fs.readFileSync(path.resolve('./modules/pogfapprovals/server/bpmn/pogfapproval.bpmn'), {encoding: 'utf-8'})
      console.log(bpmnXML);
      var returnObj = {};
      returnObj.pogfapprovals = processes;
      returnObj.bpmnXML = bpmnXML;

      console.log(returnObj.pogfapprovals.length);
      res.jsonp(processes);
    }
  });
};


/**
 *List of Pogfapproval Processes
 */
exports.listProcesses = function(req, res) {
  PogfapprovalProcess.find().exec(function(err, processes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else { console.log('processes length: ' + processes.l)
      res.jsonp(processes);
    }
  });
}
/**
 * Pogfapproval middleware
 */
exports.pogfapprovalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pogfapproval is invalid'
    });
  }

  Pogfapproval.findById(id).populate('user', 'displayName').exec(function (err, pogfapproval) {
    if (err) {
      return next(err);
    } else if (!pogfapproval) {
      return res.status(404).send({
        message: 'No Pogfapproval with that identifier has been found'
      });
    }
    req.pogfapproval = pogfapproval;
    next();
  });
};
