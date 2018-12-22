import SugarNumber from '../../../src/core/number';
import abs from '../../../src/number/abs';

describe('Sugar Method Entry', function() {

  // Note that we can't assert that the method has
  // not been defined here as the rest of the suite
  // has been imported by the time these tests are
  // run. Relying on the plugin to ensure this.

  it('should export the method as default', function() {
    assertEqual(abs(-5), 5);
  });

});
