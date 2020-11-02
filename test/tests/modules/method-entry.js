import * as Exports from '../../../src/number/abs';

describe('Method Entry Module', () => {

  it('should export the method as default', () => {
    assertInstanceOf(Exports.default, Function);
  });

  it('should not have any named exports', () => {
    assertEqual(Object.keys(Exports).length, 1);
  });

});
