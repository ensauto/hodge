'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pogfapproval = mongoose.model('Pogfapproval'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pogfapproval;

/**
 * Pogfapproval routes tests
 */
describe('Pogfapproval CRUD tests', function () {

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

    // Save a user to the test db and create new Pogfapproval
    user.save(function () {
      pogfapproval = {
        name: 'Pogfapproval name'
      };

      done();
    });
  });

  it('should be able to save a Pogfapproval if logged in', function (done) {
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

        // Save a new Pogfapproval
        agent.post('/api/pogfapprovals')
          .send(pogfapproval)
          .expect(200)
          .end(function (pogfapprovalSaveErr, pogfapprovalSaveRes) {
            // Handle Pogfapproval save error
            if (pogfapprovalSaveErr) {
              return done(pogfapprovalSaveErr);
            }

            // Get a list of Pogfapprovals
            agent.get('/api/pogfapprovals')
              .end(function (pogfapprovalsGetErr, pogfapprovalsGetRes) {
                // Handle Pogfapprovals save error
                if (pogfapprovalsGetErr) {
                  return done(pogfapprovalsGetErr);
                }

                // Get Pogfapprovals list
                var pogfapprovals = pogfapprovalsGetRes.body;

                // Set assertions
                (pogfapprovals[0].user._id).should.equal(userId);
                (pogfapprovals[0].name).should.match('Pogfapproval name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pogfapproval if not logged in', function (done) {
    agent.post('/api/pogfapprovals')
      .send(pogfapproval)
      .expect(403)
      .end(function (pogfapprovalSaveErr, pogfapprovalSaveRes) {
        // Call the assertion callback
        done(pogfapprovalSaveErr);
      });
  });

  it('should not be able to save an Pogfapproval if no name is provided', function (done) {
    // Invalidate name field
    pogfapproval.name = '';

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

        // Save a new Pogfapproval
        agent.post('/api/pogfapprovals')
          .send(pogfapproval)
          .expect(400)
          .end(function (pogfapprovalSaveErr, pogfapprovalSaveRes) {
            // Set message assertion
            (pogfapprovalSaveRes.body.message).should.match('Please fill Pogfapproval name');

            // Handle Pogfapproval save error
            done(pogfapprovalSaveErr);
          });
      });
  });

  it('should be able to update an Pogfapproval if signed in', function (done) {
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

        // Save a new Pogfapproval
        agent.post('/api/pogfapprovals')
          .send(pogfapproval)
          .expect(200)
          .end(function (pogfapprovalSaveErr, pogfapprovalSaveRes) {
            // Handle Pogfapproval save error
            if (pogfapprovalSaveErr) {
              return done(pogfapprovalSaveErr);
            }

            // Update Pogfapproval name
            pogfapproval.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pogfapproval
            agent.put('/api/pogfapprovals/' + pogfapprovalSaveRes.body._id)
              .send(pogfapproval)
              .expect(200)
              .end(function (pogfapprovalUpdateErr, pogfapprovalUpdateRes) {
                // Handle Pogfapproval update error
                if (pogfapprovalUpdateErr) {
                  return done(pogfapprovalUpdateErr);
                }

                // Set assertions
                (pogfapprovalUpdateRes.body._id).should.equal(pogfapprovalSaveRes.body._id);
                (pogfapprovalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pogfapprovals if not signed in', function (done) {
    // Create new Pogfapproval model instance
    var pogfapprovalObj = new Pogfapproval(pogfapproval);

    // Save the pogfapproval
    pogfapprovalObj.save(function () {
      // Request Pogfapprovals
      request(app).get('/api/pogfapprovals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pogfapproval if not signed in', function (done) {
    // Create new Pogfapproval model instance
    var pogfapprovalObj = new Pogfapproval(pogfapproval);

    // Save the Pogfapproval
    pogfapprovalObj.save(function () {
      request(app).get('/api/pogfapprovals/' + pogfapprovalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pogfapproval.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pogfapproval with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pogfapprovals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pogfapproval is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pogfapproval which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pogfapproval
    request(app).get('/api/pogfapprovals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pogfapproval with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pogfapproval if signed in', function (done) {
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

        // Save a new Pogfapproval
        agent.post('/api/pogfapprovals')
          .send(pogfapproval)
          .expect(200)
          .end(function (pogfapprovalSaveErr, pogfapprovalSaveRes) {
            // Handle Pogfapproval save error
            if (pogfapprovalSaveErr) {
              return done(pogfapprovalSaveErr);
            }

            // Delete an existing Pogfapproval
            agent.delete('/api/pogfapprovals/' + pogfapprovalSaveRes.body._id)
              .send(pogfapproval)
              .expect(200)
              .end(function (pogfapprovalDeleteErr, pogfapprovalDeleteRes) {
                // Handle pogfapproval error error
                if (pogfapprovalDeleteErr) {
                  return done(pogfapprovalDeleteErr);
                }

                // Set assertions
                (pogfapprovalDeleteRes.body._id).should.equal(pogfapprovalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pogfapproval if not signed in', function (done) {
    // Set Pogfapproval user
    pogfapproval.user = user;

    // Create new Pogfapproval model instance
    var pogfapprovalObj = new Pogfapproval(pogfapproval);

    // Save the Pogfapproval
    pogfapprovalObj.save(function () {
      // Try deleting Pogfapproval
      request(app).delete('/api/pogfapprovals/' + pogfapprovalObj._id)
        .expect(403)
        .end(function (pogfapprovalDeleteErr, pogfapprovalDeleteRes) {
          // Set message assertion
          (pogfapprovalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pogfapproval error error
          done(pogfapprovalDeleteErr);
        });

    });
  });

  it('should be able to get a single Pogfapproval that has an orphaned user reference', function (done) {
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

          // Save a new Pogfapproval
          agent.post('/api/pogfapprovals')
            .send(pogfapproval)
            .expect(200)
            .end(function (pogfapprovalSaveErr, pogfapprovalSaveRes) {
              // Handle Pogfapproval save error
              if (pogfapprovalSaveErr) {
                return done(pogfapprovalSaveErr);
              }

              // Set assertions on new Pogfapproval
              (pogfapprovalSaveRes.body.name).should.equal(pogfapproval.name);
              should.exist(pogfapprovalSaveRes.body.user);
              should.equal(pogfapprovalSaveRes.body.user._id, orphanId);

              // force the Pogfapproval to have an orphaned user reference
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

                    // Get the Pogfapproval
                    agent.get('/api/pogfapprovals/' + pogfapprovalSaveRes.body._id)
                      .expect(200)
                      .end(function (pogfapprovalInfoErr, pogfapprovalInfoRes) {
                        // Handle Pogfapproval error
                        if (pogfapprovalInfoErr) {
                          return done(pogfapprovalInfoErr);
                        }

                        // Set assertions
                        (pogfapprovalInfoRes.body._id).should.equal(pogfapprovalSaveRes.body._id);
                        (pogfapprovalInfoRes.body.name).should.equal(pogfapproval.name);
                        should.equal(pogfapprovalInfoRes.body.user, undefined);

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
      Pogfapproval.remove().exec(done);
    });
  });
});
