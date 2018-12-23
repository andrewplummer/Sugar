import Number from '../../../src/core/number';
import * as Exports from '../../../src/number/abs/define';

describe('Method Define Module', function() {

  it('should not have any exports', function() {
    assertEqual(Object.keys(Exports).length, 0);
  });

  it('should not have defined the method', function() {
    assertEqual(Number.abs(-5), 5);
    assertEqual(new Number(-5).abs().raw, 5);
  });

});
