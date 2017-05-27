'use strict';

describe('Dboard erpreports E2E Tests:', function () {
  describe('Test Dboard erpreports page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/dboard-erpreports');
      expect(element.all(by.repeater('dboard-erpreport in dboard-erpreports')).count()).toEqual(0);
    });
  });
});
