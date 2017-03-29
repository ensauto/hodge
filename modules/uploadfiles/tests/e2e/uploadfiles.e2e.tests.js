'use strict';

describe('Uploadfiles E2E Tests:', function () {
  describe('Test Uploadfiles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/uploadfiles');
      expect(element.all(by.repeater('uploadfile in uploadfiles')).count()).toEqual(0);
    });
  });
});
