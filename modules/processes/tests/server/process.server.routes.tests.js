'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Process = mongoose.model('Process'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  process;

/**
 * Process routes tests
 */
describe('Process CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Process
    user.save(function () {
      process = {
        name: 'Process name'
      };

      done();
    });
  });

  it('should be able to save a Process if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Process
        agent.post('/api/processes')
          .send(process)
          .expect(200)
          .end(function (processSaveErr, processSaveRes) {
            // Handle Process save error
            if (processSaveErr) {
              return done(processSaveErr);
            }

            // Get a list of Processes
            agent.get('/api/processes')
              .end(function (processesGetErr, processesGetRes) {
                // Handle Processes save error
                if (processesGetErr) {
                  return done(processesGetErr);
                }

                // Get Processes list
                var processes = processesGetRes.body;

                // Set assertions
                (processes[0].user._id).should.equal(userId);
                (processes[0].name).should.match('Process name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Process if not logged in', function (done) {
    agent.post('/api/processes')
      .send(process)
      .expect(403)
      .end(function (processSaveErr, processSaveRes) {
        // Call the assertion callback
        done(processSaveErr);
      });
  });

  it('should not be able to save an Process if no name is provided', function (done) {
    // Invalidate name field
    process.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Process
        agent.post('/api/processes')
          .send(process)
          .expect(400)
          .end(function (processSaveErr, processSaveRes) {
            // Set message assertion
            (processSaveRes.body.message).should.match('Please fill Process name');

            // Handle Process save error
            done(processSaveErr);
          });
      });
  });

  it('should be able to update an Process if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Process
        agent.post('/api/processes')
          .send(process)
          .expect(200)
          .end(function (processSaveErr, processSaveRes) {
            // Handle Process save error
            if (processSaveErr) {
              return done(processSaveErr);
            }

            // Update Process name
            process.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Process
            agent.put('/api/processes/' + processSaveRes.body._id)
              .send(process)
              .expect(200)
              .end(function (processUpdateErr, processUpdateRes) {
                // Handle Process update error
                if (processUpdateErr) {
                  return done(processUpdateErr);
                }

                // Set assertions
                (processUpdateRes.body._id).should.equal(processSaveRes.body._id);
                (processUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Processes if not signed in', function (done) {
    // Create new Process model instance
    var processObj = new Process(process);

    // Save the process
    processObj.save(function () {
      // Request Processes
      request(app).get('/api/processes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Process if not signed in', function (done) {
    // Create new Process model instance
    var processObj = new Process(process);

    // Save the Process
    processObj.save(function () {
      request(app).get('/api/processes/' + processObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', process.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Process with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/processes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Process is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Process which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Process
    request(app).get('/api/processes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Process with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Process if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Process
        agent.post('/api/processes')
          .send(process)
          .expect(200)
          .end(function (processSaveErr, processSaveRes) {
            // Handle Process save error
            if (processSaveErr) {
              return done(processSaveErr);
            }

            // Delete an existing Process
            agent.delete('/api/processes/' + processSaveRes.body._id)
              .send(process)
              .expect(200)
              .end(function (processDeleteErr, processDeleteRes) {
                // Handle process error error
                if (processDeleteErr) {
                  return done(processDeleteErr);
                }

                // Set assertions
                (processDeleteRes.body._id).should.equal(processSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Process if not signed in', function (done) {
    // Set Process user
    process.user = user;

    // Create new Process model instance
    var processObj = new Process(process);

    // Save the Process
    processObj.save(function () {
      // Try deleting Process
      request(app).delete('/api/processes/' + processObj._id)
        .expect(403)
        .end(function (processDeleteErr, processDeleteRes) {
          // Set message assertion
          (processDeleteRes.body.message).should.match('User is not authorized');

          // Handle Process error error
          done(processDeleteErr);
        });

    });
  });

  it('should be able to get a single Process that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Process
          agent.post('/api/processes')
            .send(process)
            .expect(200)
            .end(function (processSaveErr, processSaveRes) {
              // Handle Process save error
              if (processSaveErr) {
                return done(processSaveErr);
              }

              // Set assertions on new Process
              (processSaveRes.body.name).should.equal(process.name);
              should.exist(processSaveRes.body.user);
              should.equal(processSaveRes.body.user._id, orphanId);

              // force the Process to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Process
                    agent.get('/api/processes/' + processSaveRes.body._id)
                      .expect(200)
                      .end(function (processInfoErr, processInfoRes) {
                        // Handle Process error
                        if (processInfoErr) {
                          return done(processInfoErr);
                        }

                        // Set assertions
                        (processInfoRes.body._id).should.equal(processSaveRes.body._id);
                        (processInfoRes.body.name).should.equal(process.name);
                        should.equal(processInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Process.remove().exec(done);
    });
  });
});
