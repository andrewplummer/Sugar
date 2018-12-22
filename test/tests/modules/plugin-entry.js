import SugarNumber from '../../../src/core/number';
import DefaultExport, { add, mult } from '../../plugins/math-operators';
import { expireCache } from '../../helpers/node';

describe('Plugin Entry', function() {

  it('should export the namespace as the default', function() {
    assertEqual(DefaultExport, SugarNumber);
  });

  it('should export standalone methods', function() {
    assertEqual(add(5, 5), 10);
    assertEqual(mult(5, 5), 25);
  });

  it('should have defined methods on the chainable', function() {
    assertEqual(new SugarNumber(5).add(5).mult(5).raw, 50);
  });

});

// Reset state after import.
delete SugarNumber.add;
delete SugarNumber.mult;
expireCache(__dirname, '../../plugins/math-operators/add/define');
expireCache(__dirname, '../../plugins/math-operators/mult/define');
