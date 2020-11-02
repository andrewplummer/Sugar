import { Number } from '../../../src/number/namespace';
import * as Exports from '../../../src/number';

describe('Namespace Entry Module', () => {

  it('should not export a default', () => {
    assertUndefined(Exports.default);
  });

  it('should export Number as a named export', () => {
    assertEqual(Exports.Number, Number);
  });

  it('should have defined chainable methods', () => {
    assertInstanceOf(Exports.Number.prototype.abs, Function);
  });

  it('should have named exports equal to those of the namespace', () => {
    assertEqual(Exports.defineStatic, Number.defineStatic);
    assertEqual(Exports.defineInstance, Number.defineInstance);
    assertEqual(Exports.defineStaticAlias, Number.defineStaticAlias);
    assertEqual(Exports.defineInstanceAlias, Number.defineInstanceAlias);
  });

  it('should have static functions as named exports', () => {
    assertInstanceOf(Exports.abs, Function);
  });

});
