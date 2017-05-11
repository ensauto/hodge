'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Datacube = mongoose.model('Datacube'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  datacube;

/**
 * Datacube routes tests
 */
describe('Datacube CRUD tests', function () {

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

    // Save a user to the test db and create new Datacube
    user.save(function () {
      datacube = {
        name: 'Datacube name'
      };

      done();
    });
  });

  it('should be able to save a Datacube if logged in', function (done) {
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

        // Save a new Datacube
        agent.post('/api/datacubes')
          .send(datacube)
          .expect(200)
          .end(function (datacubeSaveErr, datacubeSaveRes) {
            // Handle Datacube save error
            if (datacubeSaveErr) {
              return done(datacubeSaveErr);
            }

            // Get a list of Datacubes
            agent.get('/api/datacubes')
              .end(function (datacubesGetErr, datacubesGetRes) {
                // Handle Datacubes save error
                if (datacubesGetErr) {
                  return done(datacubesGetErr);
                }

                // Get Datacubes list
                var datacubes = datacubesGetRes.body;

                // Set assertions
                (datacubes[0].user._id).should.equal(userId);
                (datacubes[0].name).should.match('Datacube name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Datacube if not logged in', function (done) {
    agent.post('/api/datacubes')
      .send(datacube)
      .expect(403)
      .end(function (datacubeSaveErr, datacubeSaveRes) {
        // Call the assertion callback
        done(datacubeSaveErr);
      });
  });

  it('should not be able to save an Datacube if no name is provided', function (done) {
    // Invalidate name field
    datacube.name = '';

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

        // Save a new Datacube
        agent.post('/api/datacubes')
          .send(datacube)
          .expect(400)
          .end(function (datacubeSaveErr, datacubeSaveRes) {
            // Set message assertion
            (datacubeSaveRes.body.message).should.match('Please fill Datacube name');

            // Handle Datacube save error
            done(datacubeSaveErr);
          });
      });
  });

  it('should be able to update an Datacube if signed in', function (done) {
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

        // Save a new Datacube
        agent.post('/api/datacubes')
          .send(datacube)
          .expect(200)
          .end(function (datacubeSaveErr, datacubeSaveRes) {
            // Handle Datacube save error
            if (datacubeSaveErr) {
              return done(datacubeSaveErr);
            }

            // Update Datacube name
            datacube.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Datacube
            agent.put('/api/datacubes/' + datacubeSaveRes.body._id)
              .send(datacube)
              .expect(200)
              .end(function (datacubeUpdateErr, datacubeUpdateRes) {
                // Handle Datacube update error
                if (datacubeUpdateErr) {
                  return done(datacubeUpdateErr);
                }

                // Set assertions
                (datacubeUpdateRes.body._id).should.equal(datacubeSaveRes.body._id);
                (datacubeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Datacubes if not signed in', function (done) {
    // Create new Datacube model instance
    var datacubeObj = new Datacube(datacube);

    // Save the datacube
    datacubeObj.save(function () {
      // Request Datacubes
      request(app).get('/api/datacubes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Datacube if not signed in', function (done) {
    // Create new Datacube model instance
    var datacubeObj = new Datacube(datacube);

    // Save the Datacube
    datacubeObj.save(function () {
      request(app).get('/api/datacubes/' + datacubeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', datacube.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Datacube with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/datacubes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Datacube is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Datacube which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Datacube
    request(app).get('/api/datacubes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Datacube with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Datacube if signed in', function (done) {
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

        // Save a new Datacube
        agent.post('/api/datacubes')
          .send(datacube)
          .expect(200)
          .end(function (datacubeSaveErr, datacubeSaveRes) {
            // Handle Datacube save error
            if (datacubeSaveErr) {
              return done(datacubeSaveErr);
            }

            // Delete an existing Datacube
            agent.delete('/api/datacubes/' + datacubeSaveRes.body._id)
              .send(datacube)
              .expect(200)
              .end(function (datacubeDeleteErr, datacubeDeleteRes) {
                // Handle datacube error error
                if (datacubeDeleteErr) {
                  return done(datacubeDeleteErr);
                }

                // Set assertions
                (datacubeDeleteRes.body._id).should.equal(datacubeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Datacube if not signed in', function (done) {
    // Set Datacube user
    datacube.user = user;

    // Create new Datacube model instance
    var datacubeObj = new Datacube(datacube);

    // Save the Datacube
    datacubeObj.save(function () {
      // Try deleting Datacube
      request(app).delete('/api/datacubes/' + datacubeObj._id)
        .expect(403)
        .end(function (datacubeDeleteErr, datacubeDeleteRes) {
          // Set message assertion
          (datacubeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Datacube error error
          done(datacubeDeleteErr);
        });

    });
  });

  it('should be able to get a single Datacube that has an orphaned user reference', function (done) {
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

          // Save a new Datacube
          agent.post('/api/datacubes')
            .send(datacube)
            .expect(200)
            .end(function (datacubeSaveErr, datacubeSaveRes) {
              // Handle Datacube save error
              if (datacubeSaveErr) {
                return done(datacubeSaveErr);
              }

              // Set assertions on new Datacube
              (datacubeSaveRes.body.name).should.equal(datacube.name);
              should.exist(datacubeSaveRes.body.user);
              should.equal(datacubeSaveRes.body.user._id, orphanId);

              // force the Datacube to have an orphaned user reference
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

                    // Get the Datacube
                    agent.get('/api/datacubes/' + datacubeSaveRes.body._id)
                      .expect(200)
                      .end(function (datacubeInfoErr, datacubeInfoRes) {
                        // Handle Datacube error
                        if (datacubeInfoErr) {
                          return done(datacubeInfoErr);
                        }

                        // Set assertions
                        (datacubeInfoRes.body._id).should.equal(datacubeSaveRes.body._id);
                        (datacubeInfoRes.body.name).should.equal(datacube.name);
                        should.equal(datacubeInfoRes.body.user, undefined);

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
      Datacube.remove().exec(done);
    });
  });
});
