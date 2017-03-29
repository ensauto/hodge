(function () {
  'use strict';

  describe('Pogfapprovals List Controller Tests', function () {
    // Initialize global variables
    var PogfapprovalsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      PogfapprovalsService,
      mockPogfapproval;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _PogfapprovalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      PogfapprovalsService = _PogfapprovalsService_;

      // create mock article
      mockPogfapproval = new PogfapprovalsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Pogfapproval Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Pogfapprovals List controller.
      PogfapprovalsListController = $controller('PogfapprovalsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockPogfapprovalList;

      beforeEach(function () {
        mockPogfapprovalList = [mockPogfapproval, mockPogfapproval];
      });

      it('should send a GET request and return all Pogfapprovals', inject(function (PogfapprovalsService) {
        // Set POST response
        $httpBackend.expectGET('api/pogfapprovals').respond(mockPogfapprovalList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.pogfapprovals.length).toEqual(2);
        expect($scope.vm.pogfapprovals[0]).toEqual(mockPogfapproval);
        expect($scope.vm.pogfapprovals[1]).toEqual(mockPogfapproval);

      }));
    });
  });
}());
