import { createNamespace } from '../../../src/core';
import { defineInstance } from '../../../src/core/string';

const Boolean = createNamespace('Boolean');

Boolean.defineInstance('maybe', function() {
  return 0.5;
});

import { Sugar } from '../../../src';
import { String } from '../../../src/string';

defineInstance('hi', function(str) {
  return 'hi ' + str;
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
