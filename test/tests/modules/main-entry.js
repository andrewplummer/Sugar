import { Sugar } from '../../../src/core';
import * as Exports from '../../../src';

describe('Entry Module', () => {

  it('should not export a default', () => {
    assertUndefined(Exports.default);
  });

  it('should export Sugar as a named export', () => {
    assertEqual(Exports.Sugar, Sugar);
  });

  it('should not export static methods', () => {
    assertUndefined(Exports.abs);
  });

  it('should have named exports equal to those of the core', () => {
    assertEqual(Exports.VERSION, Sugar.VERSION);
    assertEqual(Exports.extend, Sugar.extend);
    assertEqual(Exports.restore, Sugar.restore);
    assertEqual(Exports.createNamespace, Sugar.createNamespace);
  });

  it('should have exported namespaces', () => {
    assertInstanceOf(Exports.Number, Function);
  });

  it('should have defined methods', () => {
    assertInstanceOf(Exports.Number.abs, Function);
  });

});
