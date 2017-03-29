(function () {
  'use strict';

  describe('Pogfapprovals Route Tests', function () {
    // Initialize global variables
    var $scope,
      PogfapprovalsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PogfapprovalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PogfapprovalsService = _PogfapprovalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('pogfapprovals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/pogfapprovals');
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
          PogfapprovalsController,
          mockPogfapproval;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('pogfapprovals.view');
          $templateCache.put('modules/pogfapprovals/client/views/view-pogfapproval.client.view.html', '');

          // create mock Pogfapproval
          mockPogfapproval = new PogfapprovalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pogfapproval Name'
          });

          // Initialize Controller
          PogfapprovalsController = $controller('PogfapprovalsController as vm', {
            $scope: $scope,
            pogfapprovalResolve: mockPogfapproval
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:pogfapprovalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.pogfapprovalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            pogfapprovalId: 1
          })).toEqual('/pogfapprovals/1');
        }));

        it('should attach an Pogfapproval to the controller scope', function () {
          expect($scope.vm.pogfapproval._id).toBe(mockPogfapproval._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/pogfapprovals/client/views/view-pogfapproval.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PogfapprovalsController,
          mockPogfapproval;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('pogfapprovals.create');
          $templateCache.put('modules/pogfapprovals/client/views/form-pogfapproval.client.view.html', '');

          // create mock Pogfapproval
          mockPogfapproval = new PogfapprovalsService();

          // Initialize Controller
          PogfapprovalsController = $controller('PogfapprovalsController as vm', {
            $scope: $scope,
            pogfapprovalResolve: mockPogfapproval
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.pogfapprovalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/pogfapprovals/create');
        }));

        it('should attach an Pogfapproval to the controller scope', function () {
          expect($scope.vm.pogfapproval._id).toBe(mockPogfapproval._id);
          expect($scope.vm.pogfapproval._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/pogfapprovals/client/views/form-pogfapproval.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PogfapprovalsController,
          mockPogfapproval;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('pogfapprovals.edit');
          $templateCache.put('modules/pogfapprovals/client/views/form-pogfapproval.client.view.html', '');

          // create mock Pogfapproval
          mockPogfapproval = new PogfapprovalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pogfapproval Name'
          });

          // Initialize Controller
          PogfapprovalsController = $controller('PogfapprovalsController as vm', {
            $scope: $scope,
            pogfapprovalResolve: mockPogfapproval
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:pogfapprovalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.pogfapprovalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            pogfapprovalId: 1
          })).toEqual('/pogfapprovals/1/edit');
        }));

        it('should attach an Pogfapproval to the controller scope', function () {
          expect($scope.vm.pogfapproval._id).toBe(mockPogfapproval._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/pogfapprovals/client/views/form-pogfapproval.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
