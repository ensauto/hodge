'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  DboardErpreport = mongoose.model('DboardErpreport'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  dboardErpreport;

/**
 * Dboard erpreport routes tests
 */
describe('Dboard erpreport CRUD tests', function () {

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

    // Save a user to the test db and create new Dboard erpreport
    user.save(function () {
      dboardErpreport = {
        name: 'Dboard erpreport name'
      };

      done();
    });
  });

  it('should be able to save a Dboard erpreport if logged in', function (done) {
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

        // Save a new Dboard erpreport
        agent.post('/api/dboardErpreports')
          .send(dboardErpreport)
          .expect(200)
          .end(function (dboardErpreportSaveErr, dboardErpreportSaveRes) {
            // Handle Dboard erpreport save error
            if (dboardErpreportSaveErr) {
              return done(dboardErpreportSaveErr);
            }

            // Get a list of Dboard erpreports
            agent.get('/api/dboardErpreports')
              .end(function (dboardErpreportsGetErr, dboardErpreportsGetRes) {
                // Handle Dboard erpreports save error
                if (dboardErpreportsGetErr) {
                  return done(dboardErpreportsGetErr);
                }

                // Get Dboard erpreports list
                var dboardErpreports = dboardErpreportsGetRes.body;

                // Set assertions
                (dboardErpreports[0].user._id).should.equal(userId);
                (dboardErpreports[0].name).should.match('Dboard erpreport name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Dboard erpreport if not logged in', function (done) {
    agent.post('/api/dboardErpreports')
      .send(dboardErpreport)
      .expect(403)
      .end(function (dboardErpreportSaveErr, dboardErpreportSaveRes) {
        // Call the assertion callback
        done(dboardErpreportSaveErr);
      });
  });

  it('should not be able to save an Dboard erpreport if no name is provided', function (done) {
    // Invalidate name field
    dboardErpreport.name = '';

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

        // Save a new Dboard erpreport
        agent.post('/api/dboardErpreports')
          .send(dboardErpreport)
          .expect(400)
          .end(function (dboardErpreportSaveErr, dboardErpreportSaveRes) {
            // Set message assertion
            (dboardErpreportSaveRes.body.message).should.match('Please fill Dboard erpreport name');

            // Handle Dboard erpreport save error
            done(dboardErpreportSaveErr);
          });
      });
  });

  it('should be able to update an Dboard erpreport if signed in', function (done) {
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

        // Save a new Dboard erpreport
        agent.post('/api/dboardErpreports')
          .send(dboardErpreport)
          .expect(200)
          .end(function (dboardErpreportSaveErr, dboardErpreportSaveRes) {
            // Handle Dboard erpreport save error
            if (dboardErpreportSaveErr) {
              return done(dboardErpreportSaveErr);
            }

            // Update Dboard erpreport name
            dboardErpreport.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Dboard erpreport
            agent.put('/api/dboardErpreports/' + dboardErpreportSaveRes.body._id)
              .send(dboardErpreport)
              .expect(200)
              .end(function (dboardErpreportUpdateErr, dboardErpreportUpdateRes) {
                // Handle Dboard erpreport update error
                if (dboardErpreportUpdateErr) {
                  return done(dboardErpreportUpdateErr);
                }

                // Set assertions
                (dboardErpreportUpdateRes.body._id).should.equal(dboardErpreportSaveRes.body._id);
                (dboardErpreportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Dboard erpreports if not signed in', function (done) {
    // Create new Dboard erpreport model instance
    var dboardErpreportObj = new DboardErpreport(dboardErpreport);

    // Save the dboardErpreport
    dboardErpreportObj.save(function () {
      // Request Dboard erpreports
      request(app).get('/api/dboardErpreports')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Dboard erpreport if not signed in', function (done) {
    // Create new Dboard erpreport model instance
    var dboardErpreportObj = new DboardErpreport(dboardErpreport);

    // Save the Dboard erpreport
    dboardErpreportObj.save(function () {
      request(app).get('/api/dboardErpreports/' + dboardErpreportObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', dboardErpreport.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Dboard erpreport with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/dboardErpreports/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Dboard erpreport is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Dboard erpreport which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Dboard erpreport
    request(app).get('/api/dboardErpreports/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Dboard erpreport with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Dboard erpreport if signed in', function (done) {
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

        // Save a new Dboard erpreport
        agent.post('/api/dboardErpreports')
          .send(dboardErpreport)
          .expect(200)
          .end(function (dboardErpreportSaveErr, dboardErpreportSaveRes) {
            // Handle Dboard erpreport save error
            if (dboardErpreportSaveErr) {
              return done(dboardErpreportSaveErr);
            }

            // Delete an existing Dboard erpreport
            agent.delete('/api/dboardErpreports/' + dboardErpreportSaveRes.body._id)
              .send(dboardErpreport)
              .expect(200)
              .end(function (dboardErpreportDeleteErr, dboardErpreportDeleteRes) {
                // Handle dboardErpreport error error
                if (dboardErpreportDeleteErr) {
                  return done(dboardErpreportDeleteErr);
                }

                // Set assertions
                (dboardErpreportDeleteRes.body._id).should.equal(dboardErpreportSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Dboard erpreport if not signed in', function (done) {
    // Set Dboard erpreport user
    dboardErpreport.user = user;

    // Create new Dboard erpreport model instance
    var dboardErpreportObj = new DboardErpreport(dboardErpreport);

    // Save the Dboard erpreport
    dboardErpreportObj.save(function () {
      // Try deleting Dboard erpreport
      request(app).delete('/api/dboardErpreports/' + dboardErpreportObj._id)
        .expect(403)
        .end(function (dboardErpreportDeleteErr, dboardErpreportDeleteRes) {
          // Set message assertion
          (dboardErpreportDeleteRes.body.message).should.match('User is not authorized');

          // Handle Dboard erpreport error error
          done(dboardErpreportDeleteErr);
        });

    });
  });

  it('should be able to get a single Dboard erpreport that has an orphaned user reference', function (done) {
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

          // Save a new Dboard erpreport
          agent.post('/api/dboardErpreports')
            .send(dboardErpreport)
            .expect(200)
            .end(function (dboardErpreportSaveErr, dboardErpreportSaveRes) {
              // Handle Dboard erpreport save error
              if (dboardErpreportSaveErr) {
                return done(dboardErpreportSaveErr);
              }

              // Set assertions on new Dboard erpreport
              (dboardErpreportSaveRes.body.name).should.equal(dboardErpreport.name);
              should.exist(dboardErpreportSaveRes.body.user);
              should.equal(dboardErpreportSaveRes.body.user._id, orphanId);

              // force the Dboard erpreport to have an orphaned user reference
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

                    // Get the Dboard erpreport
                    agent.get('/api/dboardErpreports/' + dboardErpreportSaveRes.body._id)
                      .expect(200)
                      .end(function (dboardErpreportInfoErr, dboardErpreportInfoRes) {
                        // Handle Dboard erpreport error
                        if (dboardErpreportInfoErr) {
                          return done(dboardErpreportInfoErr);
                        }

                        // Set assertions
                        (dboardErpreportInfoRes.body._id).should.equal(dboardErpreportSaveRes.body._id);
                        (dboardErpreportInfoRes.body.name).should.equal(dboardErpreport.name);
                        should.equal(dboardErpreportInfoRes.body.user, undefined);

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
      DboardErpreport.remove().exec(done);
    });
  });
});
