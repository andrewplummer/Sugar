import { createNamespace } from '../../../src/core';
import { defineInstance } from '../../../src/string/namespace';

const Boolean = createNamespace('Boolean');

Boolean.defineInstance('maybe', () => {
  return 0.5;
});

import { Sugar } from '../../../src';
import { String } from '../../../src/string';

defineInstance('hi', (str) => {
  return 'hi ' + str;
});

describe('Plugin Module', () => {

  it('should have defined a new method on String', () => {
    assertEqual(String.hi('there'), 'hi there');
    assertEqual(new String('there').hi().raw, 'hi there');
  });

  it('should have defined a new method on Boolean', () => {
    assertEqual(Sugar.Boolean.maybe(), 0.5);
    assertEqual(new Sugar.Boolean().maybe().raw, 0.5);
  });

});
