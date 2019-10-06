import { Sugar } from '../../../src/core';
import * as Exports from '../../../src';

describe('Entry Module', function() {

  it('should not export a default', function() {
    assertUndefined(Exports.default);
  });

  it('should export Sugar as a named export', function() {
    assertEqual(Exports.Sugar, Sugar);
  });

  it('should not export static methods', function() {
    assertUndefined(Exports.abs);
  });

  it('should have named exports equal to those of the core', function() {
    assertEqual(Exports.VERSION, Sugar.VERSION);
    assertEqual(Exports.extend, Sugar.extend);
    assertEqual(Exports.restore, Sugar.restore);
    assertEqual(Exports.createNamespace, Sugar.createNamespace);
  });

  it('should have exported namespaces', function() {
    assertInstanceOf(Exports.Number, Function);
  });

  it('should have defined methods', function() {
    assertInstanceOf(Exports.Number.abs, Function);
  });

});
