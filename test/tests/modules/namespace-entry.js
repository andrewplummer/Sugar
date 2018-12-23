import Number from '../../../src/core/number';
import * as Exports from '../../../src/number';

describe('Namespace Entry Module', function() {

  it('should export the namespace as default', function() {
    assertEqual(Exports.default, Number);
  });

  it('should have named exports equal to those of the namespace', function() {
    assertEqual(Exports.defineStatic, Number.defineStatic);
    assertEqual(Exports.defineInstance, Number.defineInstance);
    assertEqual(Exports.defineStaticAlias, Number.defineStaticAlias);
    assertEqual(Exports.defineInstanceAlias, Number.defineInstanceAlias);
  });

  it('should have static functions as named exports', function() {
    assertEqual(Exports.abs(-5), 5);
  });

  it('should have not have defined chainable methods', function() {
    assertUndefined(Exports.default.abs);
    assertUndefined(Exports.default.prototype.abs);
  });

});
