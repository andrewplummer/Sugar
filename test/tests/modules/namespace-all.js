import Number from '../../../src/core/number';
import * as Exports from '../../../src/number/all';

describe('Namespace All Module', function() {

  it('should export the namespace as default', function() {
    assertEqual(Exports.default, Number);
  });

  it('should have named exports equal to those of the namespace', function() {
    assertEqual(Exports.defineStatic, Number.defineStatic);
    assertEqual(Exports.defineInstance, Number.defineInstance);
    assertEqual(Exports.defineStaticAlias, Number.defineStaticAlias);
    assertEqual(Exports.defineInstanceAlias, Number.defineInstanceAlias);
  });

  it('should not have static functions as named exports', function() {
    assertUndefined(Exports.abs);
  });

  it('should have defined methods', function() {
    assertEqual(Exports.default.abs(-5), 5);
    /* eslint-disable-next-line new-cap */
    assertEqual(new Exports.default(-5).abs().raw, 5);
  });

});
