'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema;


/**
 * Pogfapproval Schema
 */
var PogfapprovalProcessSchema = new Schema({
  
  processName: {
    type: String
  },
  processId: {
    type: String
  },
  properties: {
    type: Object
  },
  state: {
    type: Object
  },
  history: {
    type: Object
  },
  pendingTimeouts: {
    type: Object
  },
  views: {
    type: Object
  },
  

}, {collection: 'Pogfapproval'});

PogfapprovalProcessSchema.virtual('roles').get(function() {
  return this.properties.roles;
  });

mongoose.model('PogfapprovalProcess', PogfapprovalProcessSchema);

