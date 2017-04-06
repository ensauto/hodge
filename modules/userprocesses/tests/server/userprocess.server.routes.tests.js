'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userprocess = mongoose.model('Userprocess'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userprocess;

/**
 * Userprocess routes tests
 */
describe('Userprocess CRUD tests', function () {

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

    // Save a user to the test db and create new Userprocess
    user.save(function () {
      userprocess = {
        name: 'Userprocess name'
      };

      done();
    });
  });

  it('should be able to save a Userprocess if logged in', function (done) {
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

        // Save a new Userprocess
        agent.post('/api/userprocesses')
          .send(userprocess)
          .expect(200)
          .end(function (userprocessSaveErr, userprocessSaveRes) {
            // Handle Userprocess save error
            if (userprocessSaveErr) {
              return done(userprocessSaveErr);
            }

            // Get a list of Userprocesses
            agent.get('/api/userprocesses')
              .end(function (userprocessesGetErr, userprocessesGetRes) {
                // Handle Userprocesses save error
                if (userprocessesGetErr) {
                  return done(userprocessesGetErr);
                }

                // Get Userprocesses list
                var userprocesses = userprocessesGetRes.body;

                // Set assertions
                (userprocesses[0].user._id).should.equal(userId);
                (userprocesses[0].name).should.match('Userprocess name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userprocess if not logged in', function (done) {
    agent.post('/api/userprocesses')
      .send(userprocess)
      .expect(403)
      .end(function (userprocessSaveErr, userprocessSaveRes) {
        // Call the assertion callback
        done(userprocessSaveErr);
      });
  });

  it('should not be able to save an Userprocess if no name is provided', function (done) {
    // Invalidate name field
    userprocess.name = '';

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

        // Save a new Userprocess
        agent.post('/api/userprocesses')
          .send(userprocess)
          .expect(400)
          .end(function (userprocessSaveErr, userprocessSaveRes) {
            // Set message assertion
            (userprocessSaveRes.body.message).should.match('Please fill Userprocess name');

            // Handle Userprocess save error
            done(userprocessSaveErr);
          });
      });
  });

  it('should be able to update an Userprocess if signed in', function (done) {
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

        // Save a new Userprocess
        agent.post('/api/userprocesses')
          .send(userprocess)
          .expect(200)
          .end(function (userprocessSaveErr, userprocessSaveRes) {
            // Handle Userprocess save error
            if (userprocessSaveErr) {
              return done(userprocessSaveErr);
            }

            // Update Userprocess name
            userprocess.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userprocess
            agent.put('/api/userprocesses/' + userprocessSaveRes.body._id)
              .send(userprocess)
              .expect(200)
              .end(function (userprocessUpdateErr, userprocessUpdateRes) {
                // Handle Userprocess update error
                if (userprocessUpdateErr) {
                  return done(userprocessUpdateErr);
                }

                // Set assertions
                (userprocessUpdateRes.body._id).should.equal(userprocessSaveRes.body._id);
                (userprocessUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userprocesses if not signed in', function (done) {
    // Create new Userprocess model instance
    var userprocessObj = new Userprocess(userprocess);

    // Save the userprocess
    userprocessObj.save(function () {
      // Request Userprocesses
      request(app).get('/api/userprocesses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userprocess if not signed in', function (done) {
    // Create new Userprocess model instance
    var userprocessObj = new Userprocess(userprocess);

    // Save the Userprocess
    userprocessObj.save(function () {
      request(app).get('/api/userprocesses/' + userprocessObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userprocess.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userprocess with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userprocesses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userprocess is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userprocess which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userprocess
    request(app).get('/api/userprocesses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userprocess with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userprocess if signed in', function (done) {
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

        // Save a new Userprocess
        agent.post('/api/userprocesses')
          .send(userprocess)
          .expect(200)
          .end(function (userprocessSaveErr, userprocessSaveRes) {
            // Handle Userprocess save error
            if (userprocessSaveErr) {
              return done(userprocessSaveErr);
            }

            // Delete an existing Userprocess
            agent.delete('/api/userprocesses/' + userprocessSaveRes.body._id)
              .send(userprocess)
              .expect(200)
              .end(function (userprocessDeleteErr, userprocessDeleteRes) {
                // Handle userprocess error error
                if (userprocessDeleteErr) {
                  return done(userprocessDeleteErr);
                }

                // Set assertions
                (userprocessDeleteRes.body._id).should.equal(userprocessSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userprocess if not signed in', function (done) {
    // Set Userprocess user
    userprocess.user = user;

    // Create new Userprocess model instance
    var userprocessObj = new Userprocess(userprocess);

    // Save the Userprocess
    userprocessObj.save(function () {
      // Try deleting Userprocess
      request(app).delete('/api/userprocesses/' + userprocessObj._id)
        .expect(403)
        .end(function (userprocessDeleteErr, userprocessDeleteRes) {
          // Set message assertion
          (userprocessDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userprocess error error
          done(userprocessDeleteErr);
        });

    });
  });

  it('should be able to get a single Userprocess that has an orphaned user reference', function (done) {
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

          // Save a new Userprocess
          agent.post('/api/userprocesses')
            .send(userprocess)
            .expect(200)
            .end(function (userprocessSaveErr, userprocessSaveRes) {
              // Handle Userprocess save error
              if (userprocessSaveErr) {
                return done(userprocessSaveErr);
              }

              // Set assertions on new Userprocess
              (userprocessSaveRes.body.name).should.equal(userprocess.name);
              should.exist(userprocessSaveRes.body.user);
              should.equal(userprocessSaveRes.body.user._id, orphanId);

              // force the Userprocess to have an orphaned user reference
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

                    // Get the Userprocess
                    agent.get('/api/userprocesses/' + userprocessSaveRes.body._id)
                      .expect(200)
                      .end(function (userprocessInfoErr, userprocessInfoRes) {
                        // Handle Userprocess error
                        if (userprocessInfoErr) {
                          return done(userprocessInfoErr);
                        }

                        // Set assertions
                        (userprocessInfoRes.body._id).should.equal(userprocessSaveRes.body._id);
                        (userprocessInfoRes.body.name).should.equal(userprocess.name);
                        should.equal(userprocessInfoRes.body.user, undefined);

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
      Userprocess.remove().exec(done);
    });
  });
});
