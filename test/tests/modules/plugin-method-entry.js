import SugarNumber from '../../../src/core/number';
import add from '../../plugins/math-operators/add';

describe('Plugin Method Entry', function() {

  it('should export the method as default', function() {
    assertEqual(add(5, 5), 10);
  });

  it('should not have defined the method', function() {
    assertUndefined(SugarNumber.add);
  });

});
