'use strict';

/**
 * Module dependencies
 */
var uploadfilesPolicy = require('../policies/uploadfiles.server.policy'),
  uploadfiles = require('../controllers/uploadfiles.server.controller'),
  multer = require('multer'),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/storage.hodge/tmp')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'');
    }
  }),
  upload = multer({ 
    storage: storage
  })
module.exports = function(app) {
  // Uploadfiles Routes
  app.route('/api/uploadfiles').all(uploadfilesPolicy.isAllowed)
    .get(uploadfiles.list)
    .post(upload.array('file', 5), uploadfiles.create);

  app.route('/api/uploadfiles/:uploadfileId').all(uploadfilesPolicy.isAllowed)
    .get(uploadfiles.read)
    .put(uploadfiles.update)
    .delete(uploadfiles.delete);

  // Finish by binding the Uploadfile middleware
  app.param('uploadfileId', uploadfiles.uploadfileByID);
};
