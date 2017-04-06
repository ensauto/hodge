'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Userprocess Schema
 */
var UserprocessSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User', 
    unique: true
  }, 
  taskDone: {
    type: Array,
    default: []
  }

});

mongoose.model('Userprocess', UserprocessSchema);
