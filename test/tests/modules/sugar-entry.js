import Sugar from '../../../src/core';
import * as SugarExports from '../../../src';
import { expireCache } from '../../helpers/node';

describe('Sugar Entry', function() {

  it('should have exports for main entry point', function() {
    assertMatchingNamedExports(SugarExports);
  });

  it('should have core object as default', function() {
    assertEqual(SugarExports.default, Sugar);
  });

  it('should have exported core methods', function() {
    assertInstanceOf(SugarExports.createNamespace, Function);
  });

});

// Reset state after import.
expireCache(__dirname, '../../../src');
