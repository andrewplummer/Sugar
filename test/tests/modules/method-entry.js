import * as Exports from '../../../src/number/abs';

describe('Method Entry Module', function() {

  it('should export the method as default', function() {
    assertInstanceOf(Exports.default, Function);
  });

  it('should not have any named exports', function() {
    assertEqual(Object.keys(Exports).length, 1);
  });

});
