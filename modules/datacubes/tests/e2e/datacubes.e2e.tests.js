'use strict';

describe('Datacubes E2E Tests:', function () {
  describe('Test Datacubes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/datacubes');
      expect(element.all(by.repeater('datacube in datacubes')).count()).toEqual(0);
    });
  });
});
