(function () {
  'use strict';

  describe('Processes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProcessesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProcessesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProcessesService = _ProcessesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('processes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/processes');
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
          ProcessesController,
          mockProcess;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('processes.view');
          $templateCache.put('modules/processes/client/views/view-process.client.view.html', '');

          // create mock Process
          mockProcess = new ProcessesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Process Name'
          });

          // Initialize Controller
          ProcessesController = $controller('ProcessesController as vm', {
            $scope: $scope,
            processResolve: mockProcess
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:processId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.processResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            processId: 1
          })).toEqual('/processes/1');
        }));

        it('should attach an Process to the controller scope', function () {
          expect($scope.vm.process._id).toBe(mockProcess._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/processes/client/views/view-process.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProcessesController,
          mockProcess;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('processes.create');
          $templateCache.put('modules/processes/client/views/form-process.client.view.html', '');

          // create mock Process
          mockProcess = new ProcessesService();

          // Initialize Controller
          ProcessesController = $controller('ProcessesController as vm', {
            $scope: $scope,
            processResolve: mockProcess
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.processResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/processes/create');
        }));

        it('should attach an Process to the controller scope', function () {
          expect($scope.vm.process._id).toBe(mockProcess._id);
          expect($scope.vm.process._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/processes/client/views/form-process.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProcessesController,
          mockProcess;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('processes.edit');
          $templateCache.put('modules/processes/client/views/form-process.client.view.html', '');

          // create mock Process
          mockProcess = new ProcessesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Process Name'
          });

          // Initialize Controller
          ProcessesController = $controller('ProcessesController as vm', {
            $scope: $scope,
            processResolve: mockProcess
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:processId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.processResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            processId: 1
          })).toEqual('/processes/1/edit');
        }));

        it('should attach an Process to the controller scope', function () {
          expect($scope.vm.process._id).toBe(mockProcess._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/processes/client/views/form-process.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
