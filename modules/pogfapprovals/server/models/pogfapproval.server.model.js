'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pogfapproval Schema
 */
var PogfapprovalSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  purpose: {
    type: String,
    required: 'Please fill purpose'
  },
  recipient: {
    type: String,
    required: 'Please fill recipient'
  },
  emailText: {
    type: String,
    required: 'Please fill email text'
  },
  outgoingFileDesc: {
    type: String
  },
  approval: {
    type: String
  },
  comment: {
    type: String
  }
});

mongoose.model('Pogfapproval', PogfapprovalSchema);
