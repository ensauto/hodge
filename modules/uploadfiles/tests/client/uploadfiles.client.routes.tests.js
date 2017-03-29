(function () {
  'use strict';

  describe('Uploadfiles Route Tests', function () {
    // Initialize global variables
    var $scope,
      UploadfilesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UploadfilesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UploadfilesService = _UploadfilesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('uploadfiles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/uploadfiles');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UploadfilesController,
          mockUploadfile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('uploadfiles.view');
          $templateCache.put('modules/uploadfiles/client/views/view-uploadfile.client.view.html', '');

          // create mock Uploadfile
          mockUploadfile = new UploadfilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Uploadfile Name'
          });

          // Initialize Controller
          UploadfilesController = $controller('UploadfilesController as vm', {
            $scope: $scope,
            uploadfileResolve: mockUploadfile
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:uploadfileId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.uploadfileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            uploadfileId: 1
          })).toEqual('/uploadfiles/1');
        }));

        it('should attach an Uploadfile to the controller scope', function () {
          expect($scope.vm.uploadfile._id).toBe(mockUploadfile._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/uploadfiles/client/views/view-uploadfile.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UploadfilesController,
          mockUploadfile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('uploadfiles.create');
          $templateCache.put('modules/uploadfiles/client/views/form-uploadfile.client.view.html', '');

          // create mock Uploadfile
          mockUploadfile = new UploadfilesService();

          // Initialize Controller
          UploadfilesController = $controller('UploadfilesController as vm', {
            $scope: $scope,
            uploadfileResolve: mockUploadfile
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.uploadfileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/uploadfiles/create');
        }));

        it('should attach an Uploadfile to the controller scope', function () {
          expect($scope.vm.uploadfile._id).toBe(mockUploadfile._id);
          expect($scope.vm.uploadfile._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/uploadfiles/client/views/form-uploadfile.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UploadfilesController,
          mockUploadfile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('uploadfiles.edit');
          $templateCache.put('modules/uploadfiles/client/views/form-uploadfile.client.view.html', '');

          // create mock Uploadfile
          mockUploadfile = new UploadfilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Uploadfile Name'
          });

          // Initialize Controller
          UploadfilesController = $controller('UploadfilesController as vm', {
            $scope: $scope,
            uploadfileResolve: mockUploadfile
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:uploadfileId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.uploadfileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            uploadfileId: 1
          })).toEqual('/uploadfiles/1/edit');
        }));

        it('should attach an Uploadfile to the controller scope', function () {
          expect($scope.vm.uploadfile._id).toBe(mockUploadfile._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/uploadfiles/client/views/form-uploadfile.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
