import Number from '../../../src/core/number';
import * as Exports from '../../../src/number/abs';

describe('Method Entry Module', function() {

  it('should export the method as default', function() {
    assertEqual(Exports.default(-5), 5);
  });

  it('should not have any named exports', function() {
    assertEqual(Object.keys(Exports).length, 1);
  });

  it('should not have defined the method', function() {
    assertUndefined(Number.abs);
    assertUndefined(Number.prototype.abs);
  });

});
