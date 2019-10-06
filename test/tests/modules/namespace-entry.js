import { Number } from '../../../src/core/number';
import * as Exports from '../../../src/number';

describe('Namespace Entry Module', function() {

  it('should not export a default', function() {
    assertUndefined(Exports.default);
  });

  it('should export Number as a named export', function() {
    assertEqual(Exports.Number, Number);
  });

  it('should have defined chainable methods', function() {
    assertInstanceOf(Exports.Number.prototype.abs, Function);
  });

  it('should have named exports equal to those of the namespace', function() {
    assertEqual(Exports.defineStatic, Number.defineStatic);
    assertEqual(Exports.defineInstance, Number.defineInstance);
    assertEqual(Exports.defineStaticAlias, Number.defineStaticAlias);
    assertEqual(Exports.defineInstanceAlias, Number.defineInstanceAlias);
  });

  it('should have static functions as named exports', function() {
    assertInstanceOf(Exports.abs, Function);
  });

});
