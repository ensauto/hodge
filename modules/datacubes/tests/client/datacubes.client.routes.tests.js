(function () {
  'use strict';

  describe('Datacubes Route Tests', function () {
    // Initialize global variables
    var $scope,
      DatacubesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DatacubesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DatacubesService = _DatacubesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('datacubes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/datacubes');
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
          DatacubesController,
          mockDatacube;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('datacubes.view');
          $templateCache.put('modules/datacubes/client/views/view-datacube.client.view.html', '');

          // create mock Datacube
          mockDatacube = new DatacubesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Datacube Name'
          });

          // Initialize Controller
          DatacubesController = $controller('DatacubesController as vm', {
            $scope: $scope,
            datacubeResolve: mockDatacube
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:datacubeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.datacubeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            datacubeId: 1
          })).toEqual('/datacubes/1');
        }));

        it('should attach an Datacube to the controller scope', function () {
          expect($scope.vm.datacube._id).toBe(mockDatacube._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/datacubes/client/views/view-datacube.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DatacubesController,
          mockDatacube;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('datacubes.create');
          $templateCache.put('modules/datacubes/client/views/form-datacube.client.view.html', '');

          // create mock Datacube
          mockDatacube = new DatacubesService();

          // Initialize Controller
          DatacubesController = $controller('DatacubesController as vm', {
            $scope: $scope,
            datacubeResolve: mockDatacube
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.datacubeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/datacubes/create');
        }));

        it('should attach an Datacube to the controller scope', function () {
          expect($scope.vm.datacube._id).toBe(mockDatacube._id);
          expect($scope.vm.datacube._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/datacubes/client/views/form-datacube.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DatacubesController,
          mockDatacube;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('datacubes.edit');
          $templateCache.put('modules/datacubes/client/views/form-datacube.client.view.html', '');

          // create mock Datacube
          mockDatacube = new DatacubesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Datacube Name'
          });

          // Initialize Controller
          DatacubesController = $controller('DatacubesController as vm', {
            $scope: $scope,
            datacubeResolve: mockDatacube
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:datacubeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.datacubeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            datacubeId: 1
          })).toEqual('/datacubes/1/edit');
        }));

        it('should attach an Datacube to the controller scope', function () {
          expect($scope.vm.datacube._id).toBe(mockDatacube._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/datacubes/client/views/form-datacube.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
