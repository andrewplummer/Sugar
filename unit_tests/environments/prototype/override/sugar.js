
test('Array', function () {


  // Just the method name will find the proper location

  notEqual([].max, Array.SugarMethods['max'].method, 'Array#max does not belong to Sugar');
  Array.restore('max');
  equal([].max, Array.SugarMethods['max'].method, 'Array#max now belongs to Sugar');

  // No parameters will hijack the entire module

  notEqual((8).abs, Number.SugarMethods['abs'].method, 'Number#abs is Prototype');
  notEqual((8).ceil, Number.SugarMethods['ceil'].method, 'Number#ceil is Prototype');
  notEqual((8).floor, Number.SugarMethods['floor'].method, 'Number#floor is Prototype');
  notEqual((8).round, Number.SugarMethods['round'].method, 'Number#round is Prototype');

  Number.restore();

  equal((8).abs, Number.SugarMethods['abs'].method, 'Number#abs is now Sugar');
  equal((8).ceil, Number.SugarMethods['ceil'].method, 'Number#ceil is now Sugar');
  equal((8).floor, Number.SugarMethods['floor'].method, 'Number#floor is now Sugar');
  equal((8).round, Number.SugarMethods['round'].method, 'Number#round is now Sugar');


  // Ambiguous argument will default to class method only.

  /*
   * Object.restore() has already stolen back the methods in the Object tests
   * that have presumably run before this, so this strategy won't work.
   *
  notEqual(Object.keys, Object.SugarMethods['keys'].method, 'Object.keys is Prototype');
  notEqual(Object.isDate, Object.SugarMethods['isDate'].method, 'Object.isDate is Prototype');
  notEqual(Object.isNumber, Object.SugarMethods['isNumber'].method, 'Object.isNumber is Prototype');
  notEqual(Object.isFunction, Object.SugarMethods['isFunction'].method, 'Object.isFunction is Prototype');

  Object.restore('keys', 'isDate', 'isNumber', 'somebooshit');

  equal(Object.keys, Object.SugarMethods['keys'].method, 'Object.keys is Sugar');
  equal(Object.isDate, Object.SugarMethods['isDate'].method, 'Object.isDate is Sugar');
  equal(Object.isNumber, Object.SugarMethods['isNumber'].method, 'Object.isNumber is Sugar');
  notEqual(Object.isFunction, Object.SugarMethods['isFunction'].method, 'Object.isFunction is still Prototype');
  */

});
