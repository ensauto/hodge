'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Uploadfile Schema
 */
var UploadfileSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  processName: {
    type: String
  },
  processId: {
    type: String
  },
  fileFieldName: {
    type: String
  },
  filename: {
    type: String
  },
  fileOriginalName: {
    type: String
  },
  mimeType: {
    type: String
  },
  openAccess: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Uploadfile', UploadfileSchema);
