(function () {
  'use strict';

  describe('Dboard erpreports Route Tests', function () {
    // Initialize global variables
    var $scope,
      DboardErpreportsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DboardErpreportsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DboardErpreportsService = _DboardErpreportsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('dboard-erpreports');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/dboard-erpreports');
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
          DboardErpreportsController,
          mockDboardErpreport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('dboard-erpreports.view');
          $templateCache.put('modules/dboard-erpreports/client/views/view-dboard-erpreport.client.view.html', '');

          // create mock Dboard erpreport
          mockDboardErpreport = new DboardErpreportsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Dboard erpreport Name'
          });

          // Initialize Controller
          DboardErpreportsController = $controller('DboardErpreportsController as vm', {
            $scope: $scope,
            dboardErpreportResolve: mockDboardErpreport
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:dboardErpreportId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.dboardErpreportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            dboardErpreportId: 1
          })).toEqual('/dboard-erpreports/1');
        }));

        it('should attach an Dboard erpreport to the controller scope', function () {
          expect($scope.vm.dboardErpreport._id).toBe(mockDboardErpreport._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/dboard-erpreports/client/views/view-dboard-erpreport.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DboardErpreportsController,
          mockDboardErpreport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('dboard-erpreports.create');
          $templateCache.put('modules/dboard-erpreports/client/views/form-dboard-erpreport.client.view.html', '');

          // create mock Dboard erpreport
          mockDboardErpreport = new DboardErpreportsService();

          // Initialize Controller
          DboardErpreportsController = $controller('DboardErpreportsController as vm', {
            $scope: $scope,
            dboardErpreportResolve: mockDboardErpreport
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.dboardErpreportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/dboard-erpreports/create');
        }));

        it('should attach an Dboard erpreport to the controller scope', function () {
          expect($scope.vm.dboardErpreport._id).toBe(mockDboardErpreport._id);
          expect($scope.vm.dboardErpreport._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/dboard-erpreports/client/views/form-dboard-erpreport.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DboardErpreportsController,
          mockDboardErpreport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('dboard-erpreports.edit');
          $templateCache.put('modules/dboard-erpreports/client/views/form-dboard-erpreport.client.view.html', '');

          // create mock Dboard erpreport
          mockDboardErpreport = new DboardErpreportsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Dboard erpreport Name'
          });

          // Initialize Controller
          DboardErpreportsController = $controller('DboardErpreportsController as vm', {
            $scope: $scope,
            dboardErpreportResolve: mockDboardErpreport
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:dboardErpreportId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.dboardErpreportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            dboardErpreportId: 1
          })).toEqual('/dboard-erpreports/1/edit');
        }));

        it('should attach an Dboard erpreport to the controller scope', function () {
          expect($scope.vm.dboardErpreport._id).toBe(mockDboardErpreport._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/dboard-erpreports/client/views/form-dboardErpreport.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
