import Sugar from '../../../src/core';
import * as Exports from '../../../src/all';

describe('All Module', function() {

  it('should export the core as default', function() {
    assertEqual(Exports.default, Sugar);
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
    assertEqual(Exports.Number.abs(-5), 5);
    assertEqual(new Exports.Number(-5).abs().raw, 5);
  });

});
