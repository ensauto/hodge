'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Userprocesses Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/userprocesses',
      permissions: '*'
    }, {
      resources: '/api/userprocesses/:userprocessId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/userprocesses',
      permissions: ['get', 'post']
    }, {
      resources: '/api/userprocesses/:userprocessId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/userprocesses',
      permissions: ['get']
    }, {
      resources: '/api/userprocesses/:userprocessId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Userprocesses Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Userprocess is being processed and the current user created it then allow any manipulation
  if (req.userprocess && req.user && req.userprocess.user && req.userprocess.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
