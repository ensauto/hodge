'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Uploadfile = mongoose.model('Uploadfile'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  uploadfile;

/**
 * Uploadfile routes tests
 */
describe('Uploadfile CRUD tests', function () {

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

    // Save a user to the test db and create new Uploadfile
    user.save(function () {
      uploadfile = {
        name: 'Uploadfile name'
      };

      done();
    });
  });

  it('should be able to save a Uploadfile if logged in', function (done) {
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

        // Save a new Uploadfile
        agent.post('/api/uploadfiles')
          .send(uploadfile)
          .expect(200)
          .end(function (uploadfileSaveErr, uploadfileSaveRes) {
            // Handle Uploadfile save error
            if (uploadfileSaveErr) {
              return done(uploadfileSaveErr);
            }

            // Get a list of Uploadfiles
            agent.get('/api/uploadfiles')
              .end(function (uploadfilesGetErr, uploadfilesGetRes) {
                // Handle Uploadfiles save error
                if (uploadfilesGetErr) {
                  return done(uploadfilesGetErr);
                }

                // Get Uploadfiles list
                var uploadfiles = uploadfilesGetRes.body;

                // Set assertions
                (uploadfiles[0].user._id).should.equal(userId);
                (uploadfiles[0].name).should.match('Uploadfile name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Uploadfile if not logged in', function (done) {
    agent.post('/api/uploadfiles')
      .send(uploadfile)
      .expect(403)
      .end(function (uploadfileSaveErr, uploadfileSaveRes) {
        // Call the assertion callback
        done(uploadfileSaveErr);
      });
  });

  it('should not be able to save an Uploadfile if no name is provided', function (done) {
    // Invalidate name field
    uploadfile.name = '';

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

        // Save a new Uploadfile
        agent.post('/api/uploadfiles')
          .send(uploadfile)
          .expect(400)
          .end(function (uploadfileSaveErr, uploadfileSaveRes) {
            // Set message assertion
            (uploadfileSaveRes.body.message).should.match('Please fill Uploadfile name');

            // Handle Uploadfile save error
            done(uploadfileSaveErr);
          });
      });
  });

  it('should be able to update an Uploadfile if signed in', function (done) {
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

        // Save a new Uploadfile
        agent.post('/api/uploadfiles')
          .send(uploadfile)
          .expect(200)
          .end(function (uploadfileSaveErr, uploadfileSaveRes) {
            // Handle Uploadfile save error
            if (uploadfileSaveErr) {
              return done(uploadfileSaveErr);
            }

            // Update Uploadfile name
            uploadfile.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Uploadfile
            agent.put('/api/uploadfiles/' + uploadfileSaveRes.body._id)
              .send(uploadfile)
              .expect(200)
              .end(function (uploadfileUpdateErr, uploadfileUpdateRes) {
                // Handle Uploadfile update error
                if (uploadfileUpdateErr) {
                  return done(uploadfileUpdateErr);
                }

                // Set assertions
                (uploadfileUpdateRes.body._id).should.equal(uploadfileSaveRes.body._id);
                (uploadfileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Uploadfiles if not signed in', function (done) {
    // Create new Uploadfile model instance
    var uploadfileObj = new Uploadfile(uploadfile);

    // Save the uploadfile
    uploadfileObj.save(function () {
      // Request Uploadfiles
      request(app).get('/api/uploadfiles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Uploadfile if not signed in', function (done) {
    // Create new Uploadfile model instance
    var uploadfileObj = new Uploadfile(uploadfile);

    // Save the Uploadfile
    uploadfileObj.save(function () {
      request(app).get('/api/uploadfiles/' + uploadfileObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', uploadfile.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Uploadfile with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/uploadfiles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Uploadfile is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Uploadfile which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Uploadfile
    request(app).get('/api/uploadfiles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Uploadfile with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Uploadfile if signed in', function (done) {
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

        // Save a new Uploadfile
        agent.post('/api/uploadfiles')
          .send(uploadfile)
          .expect(200)
          .end(function (uploadfileSaveErr, uploadfileSaveRes) {
            // Handle Uploadfile save error
            if (uploadfileSaveErr) {
              return done(uploadfileSaveErr);
            }

            // Delete an existing Uploadfile
            agent.delete('/api/uploadfiles/' + uploadfileSaveRes.body._id)
              .send(uploadfile)
              .expect(200)
              .end(function (uploadfileDeleteErr, uploadfileDeleteRes) {
                // Handle uploadfile error error
                if (uploadfileDeleteErr) {
                  return done(uploadfileDeleteErr);
                }

                // Set assertions
                (uploadfileDeleteRes.body._id).should.equal(uploadfileSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Uploadfile if not signed in', function (done) {
    // Set Uploadfile user
    uploadfile.user = user;

    // Create new Uploadfile model instance
    var uploadfileObj = new Uploadfile(uploadfile);

    // Save the Uploadfile
    uploadfileObj.save(function () {
      // Try deleting Uploadfile
      request(app).delete('/api/uploadfiles/' + uploadfileObj._id)
        .expect(403)
        .end(function (uploadfileDeleteErr, uploadfileDeleteRes) {
          // Set message assertion
          (uploadfileDeleteRes.body.message).should.match('User is not authorized');

          // Handle Uploadfile error error
          done(uploadfileDeleteErr);
        });

    });
  });

  it('should be able to get a single Uploadfile that has an orphaned user reference', function (done) {
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

          // Save a new Uploadfile
          agent.post('/api/uploadfiles')
            .send(uploadfile)
            .expect(200)
            .end(function (uploadfileSaveErr, uploadfileSaveRes) {
              // Handle Uploadfile save error
              if (uploadfileSaveErr) {
                return done(uploadfileSaveErr);
              }

              // Set assertions on new Uploadfile
              (uploadfileSaveRes.body.name).should.equal(uploadfile.name);
              should.exist(uploadfileSaveRes.body.user);
              should.equal(uploadfileSaveRes.body.user._id, orphanId);

              // force the Uploadfile to have an orphaned user reference
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

                    // Get the Uploadfile
                    agent.get('/api/uploadfiles/' + uploadfileSaveRes.body._id)
                      .expect(200)
                      .end(function (uploadfileInfoErr, uploadfileInfoRes) {
                        // Handle Uploadfile error
                        if (uploadfileInfoErr) {
                          return done(uploadfileInfoErr);
                        }

                        // Set assertions
                        (uploadfileInfoRes.body._id).should.equal(uploadfileSaveRes.body._id);
                        (uploadfileInfoRes.body.name).should.equal(uploadfile.name);
                        should.equal(uploadfileInfoRes.body.user, undefined);

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
      Uploadfile.remove().exec(done);
    });
  });
});
