(function () {
  'use strict';

  describe('Userprocesses Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserprocessesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserprocessesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserprocessesService = _UserprocessesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userprocesses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userprocesses');
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
          UserprocessesController,
          mockUserprocess;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userprocesses.view');
          $templateCache.put('modules/userprocesses/client/views/view-userprocess.client.view.html', '');

          // create mock Userprocess
          mockUserprocess = new UserprocessesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userprocess Name'
          });

          // Initialize Controller
          UserprocessesController = $controller('UserprocessesController as vm', {
            $scope: $scope,
            userprocessResolve: mockUserprocess
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userprocessId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userprocessResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userprocessId: 1
          })).toEqual('/userprocesses/1');
        }));

        it('should attach an Userprocess to the controller scope', function () {
          expect($scope.vm.userprocess._id).toBe(mockUserprocess._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userprocesses/client/views/view-userprocess.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserprocessesController,
          mockUserprocess;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userprocesses.create');
          $templateCache.put('modules/userprocesses/client/views/form-userprocess.client.view.html', '');

          // create mock Userprocess
          mockUserprocess = new UserprocessesService();

          // Initialize Controller
          UserprocessesController = $controller('UserprocessesController as vm', {
            $scope: $scope,
            userprocessResolve: mockUserprocess
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userprocessResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userprocesses/create');
        }));

        it('should attach an Userprocess to the controller scope', function () {
          expect($scope.vm.userprocess._id).toBe(mockUserprocess._id);
          expect($scope.vm.userprocess._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userprocesses/client/views/form-userprocess.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserprocessesController,
          mockUserprocess;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userprocesses.edit');
          $templateCache.put('modules/userprocesses/client/views/form-userprocess.client.view.html', '');

          // create mock Userprocess
          mockUserprocess = new UserprocessesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userprocess Name'
          });

          // Initialize Controller
          UserprocessesController = $controller('UserprocessesController as vm', {
            $scope: $scope,
            userprocessResolve: mockUserprocess
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userprocessId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userprocessResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userprocessId: 1
          })).toEqual('/userprocesses/1/edit');
        }));

        it('should attach an Userprocess to the controller scope', function () {
          expect($scope.vm.userprocess._id).toBe(mockUserprocess._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userprocesses/client/views/form-userprocess.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
