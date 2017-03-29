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
  name: {
    type: String,
    default: '',
    required: 'Please fill Pogfapproval name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Pogfapproval', PogfapprovalSchema);
