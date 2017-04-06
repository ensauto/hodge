'use strict';

describe('Userprocesses E2E Tests:', function () {
  describe('Test Userprocesses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userprocesses');
      expect(element.all(by.repeater('userprocess in userprocesses')).count()).toEqual(0);
    });
  });
});
