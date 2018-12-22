import SugarNumber from '../../../src/core/number';
import * as Exports from '../../plugins/math-operators/add/define';
import { expireCache } from '../../helpers/node';

// Hold a reference to the method as we'll lose it when we reset.
const NamespaceAdd = SugarNumber.add;

describe('Plugin Method Define', function() {

  it('should not have any exports', function() {
    assertEqual(Object.keys(Exports).length, 0);
  });

  it('should have defined the method', function() {
    assertInstanceOf(NamespaceAdd, Function);
  });

});

// Reset state after import.
delete SugarNumber.add;
expireCache(__dirname, '../../plugins/math-operators/add/define');
