'use strict';

describe('Pogfapprovals E2E Tests:', function () {
  describe('Test Pogfapprovals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pogfapprovals');
      expect(element.all(by.repeater('pogfapproval in pogfapprovals')).count()).toEqual(0);
    });
  });
});
