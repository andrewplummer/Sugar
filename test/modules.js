import * as Sugar from '../src';
import * as Number from '../src/number';
import abs from '../src/number/abs';

describe('Modules', function() {

  it('should have exports for main entry point', function() {
    assertMatchingNamedExports(Sugar);
  });

  it('should have exports for namespace entry points', function() {
    // TODO: all other namespaces!
    assertMatchingNamedExports(Number);
  });

  it('should have standlone exports', function() {
    assertEqual(abs(-5), 5);
  });

});
