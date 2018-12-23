import '../../../src/number/abbr/define';
import '../../../src/number/abs/define';
// TODO
//import 'sugar/string/capitalize/define';
import { Number, String } from '../../../src';

describe('Customized Module', function() {

  it('should have defined static', function() {
    assertEqual(Number.abbr(5000), '5k');
    assertEqual(Number.abs(-5), 5);
  });

  it('should have defined instance', function() {
    assertEqual(new Number(-5000).abs().abbr().raw, '5k');
  });

  it('should not have defined other methods', function() {
    assertUndefined(Number.pow);
    assertUndefined(Number.prototype.pow);
  });

});
