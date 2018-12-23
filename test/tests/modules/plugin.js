import Sugar, { createNamespace } from '../../../src/core';
import String, { defineInstance } from '../../../src/core/string';

defineInstance('hi', function(str) {
  return 'hi ' + str;
});

createNamespace('Boolean');

Sugar.Boolean.defineInstance('maybe', function() {
  return 0.5;
});

describe('Plugin Module', function() {

  it('should have defined a new method on String', function() {
    assertEqual(String.hi('there'), 'hi there');
    assertEqual(new String('there').hi().raw, 'hi there');
  });

  it('should have defined a new method on Boolean', function() {
    assertEqual(Sugar.Boolean.maybe(), 0.5);
    assertEqual(new Sugar.Boolean().maybe().raw, 0.5);
  });

});
