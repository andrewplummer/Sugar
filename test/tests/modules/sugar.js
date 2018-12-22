import * as Sugar from '../../../src';
import * as SugarNumber from '../../../src/number';

describe('Modules', function() {

  it('should have exports for main entry point', function() {
    assertMatchingNamedExports(Sugar);
  });

  it('should have exports for namespace entry points', function() {
    assertMatchingNamedExports(SugarNumber);
  });

});
