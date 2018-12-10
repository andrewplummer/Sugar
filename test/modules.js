'use strict';

import * as NumberImport from '../src/number';

import absStandalone from '../src/number/abs';
import roundStandalone from '../src/number/round';

describe('Modules', function () {

  it('should have matching named exports', function() {
    assertNamedExports(NumberImport);
  });

  it('should have standalone exports', function() {
    assertEqual(absStandalone(-5), 5);
    assertEqual(roundStandalone(5.25, 1), 5.3);
  });

});
