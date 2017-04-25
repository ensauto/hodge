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
  moment = require('moment'),
  config = require(path.resolve('./config/config'));;

var manager = new bpmn.ProcessManager(config.bpmnOptions);
manager.addBpmnFilePath(path.resolve('./modules/pogfapprovals/server/bpmn/pogfapproval.bpmn'));

/**
 * Create a Pogfapproval
 */
exports.create = function(req, res) {
  delete req.body.approval;
  delete req.body.comment;
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
      manager.createProcess({name: 'Pogfapproval', id: pogfapproval._id + ''}, function(err, myProcess){
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
      Uploadfile.find({processName: 'pogfapproval', processId: pogfapproval._id + ''}).exec(function(err, files) {
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
  manager = new bpmn.ProcessManager(config.bpmnOptions);
  manager.addBpmnFilePath(path.resolve('./modules/pogfapprovals/server/bpmn/pogfapproval.bpmn'));
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
      if (submitType === 'update' || submitType === 'update|taskDone') {
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
          
        });
        pogfapproval.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            callback(null);
          }
        });  
        
      } else if (submitType === 'taskDone') {
        _.forEach(tokens, function(token) {
          switch(token.position) {
            case 'draft':
                req.process = myProcess;
                myProcess.taskDone(token.position, {req: req});
                break;
            case 'approval':
                req.process = myProcess;
                myProcess.taskDone(token.position, {req: req});
                break;
            default:
                ;
          } 
        });
        callback(null);
        
        // Side-effect of task done, update Userprocess
        Userprocess.findOne({user: req.user._id}).exec(function(err, userProcess){
          if (!userProcess) {
            Userprocess.create({user: req.user._id, taskDone: [{"processName": "pogfapproval", "processId": pogfapproval._id + ""}]}, function(err){ if(err) {}});
          } else {
            var taskDone = userProcess.taskDone;
            var processIdExist = false;
            _.forEach(taskDone, function(tD) {
              if(tD.processId === (pogfapproval._id + '')) {
                processIdExist = true;
              }
            })
            if (!processIdExist) {
              userProcess.taskDone.push({"processName": "pogfapproval", "processId": pogfapproval._id + "" });
              userProcess.save(function(err) {
              });  
            }
          }
        });
      }    
    }
    ], function(err, result) {
      res.jsonp(pogfapproval);
    });
};

/**
 * Delete an Pogfapproval
 */
exports.delete = function(req, res) {
  var pogfapproval = req.pogfapproval;
  var deleteType = req.query.deleteType;
  if(deleteType === 'dismiss') {
    Userprocess.findOne({user: req.user._id}).exec(function(err, uProcess){
      var taskDoneList = uProcess.taskDone;
      _.remove(taskDoneList, function(tDL){
        return tDL.processId === req.params.pogfapprovalId
      })
      uProcess.taskDone = taskDoneList;
      Userprocess.update({user: req.user._id}, { $set: {taskDone: taskDoneList}}).exec(function(err){
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if(!pogfapproval) {
            res.status(200).end();
          }else {
            res.jsonp(pogfapproval);
          } 
        }
      });
    })
  } else {
    async.waterfall([
      function (callback) {
        Uploadfile.find({processId: pogfapproval._id + ''}).exec(function(err, uploadFiles) {
          var uploadFile, filePath, numDeletedFiles = 0;
          var numOfFiles = uploadFiles.length;
          while (uploadFiles.length) {
            uploadFile = uploadFiles.pop(); 
            filePath = "/storage.hodge/uploads.process/" + uploadFile.processName + '-' + uploadFile.processId + '-' + uploadFile.fileFieldName + '-' + uploadFile.fileOriginalName;
            fs.unlink(filePath, function (err) {

            }); 
          }
          callback(null);
        });
      },
      function(callback) {
        Uploadfile.remove({processId: pogfapproval._id + '' }).exec(function(err, results){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            callback(null);
          }
        });
      }
    ], function(err, results) {
      pogfapproval.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(pogfapproval);
        }
      });
      
    });

  }
  /*
  
  */
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
            if (o.properties.roles.indexOf(role) != -1) {
              foundRole = true;
            }
          })
          var foundUser = false;
          if (o.properties.users.indexOf(req.user._id + '') != -1) {
            foundUser = true;
          }   
          var status = o.properties.status;
          var endStatus = ['email sent', 'rejected'];
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
      var retProcessesRev = [];
      while(retProcesses.length) {
        retProcessesRev.push(retProcesses.pop());
      }
      res.json(retProcessesRev);
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
    } else {
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
      if(!req.query.deleteType && req.query.deleteType!="dismiss")
      return res.status(404).send({
        message: 'No Pogfapproval with that identifier has been found'
      });
    }
    req.pogfapproval = pogfapproval;

    next();
  });
};
