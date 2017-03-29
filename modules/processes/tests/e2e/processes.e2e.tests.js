'use strict';

describe('Processes E2E Tests:', function () {
  describe('Test Processes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/processes');
      expect(element.all(by.repeater('process in processes')).count()).toEqual(0);
    });
  });
});
