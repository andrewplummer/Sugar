import Sugar from '../../../src/core';
import SugarNumber from '../../../src/core/number';
import * as SugarNumberExports from '../../../src/number';
import { expireCache } from '../../helpers/node';

// Hold a reference to the method as we'll lose it when we reset.
const NamespaceAbs = SugarNumber.abs;

describe('Sugar Namespace Entry', function() {

  it('should have exports for namespace entry points', function() {
    assertMatchingNamedExports(SugarNumberExports);
  });

  it('should have exported static methods', function() {
    assertEqual(SugarNumberExports.abs(-5), 5);
  });

  it('should have defined the method on the namespace', function() {
    assertInstanceOf(NamespaceAbs, Function);
  });

});

// Reset state after import.
expireCache(__dirname, '../../../src/number');
