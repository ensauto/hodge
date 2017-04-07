'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pogfapproval = mongoose.model('Pogfapproval'),
  PogfapprovalProcess = mongoose.model('PogfapprovalProcess'),
  User = mongoose.model('User'),
  Uploadfile = mongoose.model('Uploadfile'),
  Userprocess = mongoose.model('Userprocess'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  async = require('async'),
  bpmn = require("bpmn"),
  fs = require('fs'),
  moment = require('moment');

var manager = new bpmn.ProcessManager({
      persistencyOptions: {
          uri: "mongodb://hodge:hodgeAz123@192.168.1.62:27017/hodge"
      }
  });
//manager.addBpmnFilePath(process.cwd() + "\\modules\\pogfapprovals\\server\\bpmn\\pogfapproval.bpmn"); console.log(process.cwd());
manager.addBpmnFilePath(path.resolve('./modules/pogfapprovals/server/bpmn/pogfapproval.bpmn'));

/**
 * Create a Pogfapproval
 */
exports.create = function(req, res) {console.log('create');
  delete req.body.approval;
  delete req.body.comment;
  var pogfapproval = new Pogfapproval(req.body);
  pogfapproval.user = req.user;
  console.log("c1");
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
      PogfapprovalProcess.findOne({processId: pogfapproval._id + '' }).exec(function(err, processOne) {
        var processRoles = processOne.properties.roles;
        var permitAccess = false;
        var userRoles = req.user.roles;
        _.forEach(userRoles, function(userRole) {
          if (processRoles.indexOf(userRole)) {
            permitAccess = true;
          }
        });
        if (!permitAccess) {
          return res.status(401).send({
            message: 'Unauthorized'
          });
        }

        var historyEntries = processOne.history.historyEntries;
        var uncompletedTasksHistoryEntries = _.filter(historyEntries, function(h){ return h.end === null });
        var ongoingTasks = "";
        _.forEach(uncompletedTasksHistoryEntries, function(ogTask) {
          if (ongoingTasks === "") {
            ongoingTasks = ongoingTasks + ogTask.name + ' (' + moment(ogTask.begin).fromNow() + ')';
          } else {
            ongoingTasks = ongoingTasks + ', ' + ogTask.name + ' (' + moment(ogTask.begin).fromNow() + ')';
          }
        })
        var historyTrace = "";
        _.forEach(historyEntries, function(h){
          if (historyTrace === "") {
            historyTrace = historyTrace + h.name;
          } else {
            historyTrace = historyTrace + ' -> ' + h.name; 
          }
        });
        if (historyTrace === "") {
          historyTrace = "-";
        }
        if (ongoingTasks === "") {
          ongoingTasks = "-";
        }
        processOne = processOne.toJSON();
        processOne["historyTrace"] = historyTrace;
        processOne["ongoingTasks"] = ongoingTasks;
        pogfapproval.process = processOne;
        callback(null);
      })
    },
    function(callback) {
      Uploadfile.find({processName: 'ogfapproval', processId: pogfapproval._id + ''}).exec(function(err, files) {
        pogfapproval.files = files;
        callback(null);
      }) 
    }
  ], function(err, files) {
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
      var taskName = myProcess.getProperty('task');
      var tokens = myProcess.state.tokens;
      if (submitType === 'update') {
        _.forEach(tokens, function(token){
          var reqBody = _.extend({}, req.body);
          switch(token.position) {
            case 'draft': 
              delete reqBody.approval;
              delete reqBody.comment;
              pogfapproval = _.extend(pogfapproval, reqBody);
              break;
            case 'approval': 
              delete reqBody.purpose;
              delete reqBody.outgoingFileDesc;
              pogfapproval = _.extend(pogfapproval, reqBody);
              break;
          }
          pogfapproval.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
            }
          });  
          
        });
        res.jsonp(pogfapproval);
        
      } else if (submitType === 'taskDone') {
        _.forEach(tokens, function(token) {
          switch(token.position) {
            case 'draft':
                myProcess.taskDone(token.position, {req: req});
                break;
            case 'approval':
                myProcess.taskDone(token.position, {req: req});
                myProcess.taskDone('approved', {req: req});
                myProcess.taskDone('rejected', {req: req});
                break;
            default:
                ;
          } 
        });
        res.jsonp(pogfapproval);

        // Side-effect of task done, update Userprocess
        console.log("1");
        Userprocess.findOne({user: req.user._id}).exec(function(err, userProcess){
          if (!userProcess) {
            Userprocess.create({user: req.user._id, taskDone: [{"processName": "pogfapproval", "processId": pogfapproval._id + ""}]}, function(err){ if(err) {console.log(err.message)}});
          } else {
            var taskDone = userProcess.taskDone;console.log("2");
            var processIdExist = false;
            _.forEach(taskDone, function(tD) {
              if(tD.processId === (pogfapproval._id + '')) {
                processIdExist = true;
              }
            })
            if (!processIdExist) {
              userProcess.taskDone.push({"processName": "pogfapproval", "processId": pogfapproval._id + "" });console.log('save');
              userProcess.save(function(err) {console.log("210");
              });  
            }
          }
        });
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
  var processIds = req.query.processIds;
  var findCriteria = {};
  if (processIds) {
    findCriteria.processId = { $in : processIds.split(',')};
  }
  PogfapprovalProcess.find(findCriteria).exec(function(err, processes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else { 
      if (!processIds) {
        processes = _.filter(processes, function(o) { 
          var foundRole = false;
          _.forEach(req.user.roles, function(role) {
            if (o.properties.roles.indexOf(role)) {
              foundRole = true;
            }
          })
          var foundUser = false;
          foundUser = o.properties.users.indexOf(req.user._id + '');
          var status = o.properties.status;
          var endStatus = ['approved', 'rejected'];
          console.log(endStatus.indexOf(status)); 
          if ( endStatus.indexOf(status) != -1 ) {
            return false;
          } else {
            return foundUser || foundRole;  
          }
          
        });

      }
      var retProcesses = [];
      _.forEach(processes, function(processOne){

        var historyEntries = processOne.history.historyEntries;
        var uncompletedTasksHistoryEntries = _.filter(historyEntries, function(h){ return h.end === null });
        var ongoingTasks = "";
        _.forEach(uncompletedTasksHistoryEntries, function(ogTask) {
          if (ongoingTasks === "") {
            ongoingTasks = ongoingTasks + ogTask.name + ' (' + moment(ogTask.begin).fromNow() + ')';
          } else {
            ongoingTasks = ongoingTasks + ', ' + ogTask.name + ' (' + moment(ogTask.begin).fromNow() + ')';
          }
        })
        var historyTrace = "";
        _.forEach(historyEntries, function(h){
          if (historyTrace === "") {
            historyTrace = historyTrace + h.name;
          } else {
            historyTrace = historyTrace + ' > ' + h.name; 
          }
        })
        var startFlow = _.find(historyEntries, function(h){ return h.name === 'start'});
        processOne = processOne.toJSON();
        processOne.startTime = moment(startFlow.begin).fromNow();
        processOne.ongoingTasks = ongoingTasks;
        processOne.historyTrace = historyTrace;
        processOne.processedBy = processOne.properties.processedBy;
        retProcesses.push(processOne);
      });
      res.json(retProcesses);
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
