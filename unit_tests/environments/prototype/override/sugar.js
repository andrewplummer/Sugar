
test('Array', function () {


  // Just the method name will find the proper location

  notEqual([].max, Array.SugarMethods['max'].method, 'Array#max does not belong to Sugar');
  Array.sugar('max');
  strictlyEqual([].max, Array.SugarMethods['max'].method, 'Array#max now belongs to Sugar');

  // No parameters will hijack the entire module

  notEqual((8).abs, Number.SugarMethods['abs'].method, 'Number#abs is Prototype');
  notEqual((8).ceil, Number.SugarMethods['ceil'].method, 'Number#ceil is Prototype');
  notEqual((8).floor, Number.SugarMethods['floor'].method, 'Number#floor is Prototype');
  notEqual((8).round, Number.SugarMethods['round'].method, 'Number#round is Prototype');

  Number.sugar();

  strictlyEqual((8).abs, Number.SugarMethods['abs'].method, 'Number#abs is now Sugar');
  strictlyEqual((8).ceil, Number.SugarMethods['ceil'].method, 'Number#ceil is now Sugar');
  strictlyEqual((8).floor, Number.SugarMethods['floor'].method, 'Number#floor is now Sugar');
  strictlyEqual((8).round, Number.SugarMethods['round'].method, 'Number#round is now Sugar');


  // Ambiguous argument will default to class method only.

  notEqual(Object.keys, Object.SugarMethods['keys'].method, 'Object.keys is Prototype');
  notEqual(Object.isDate, Object.SugarMethods['isDate'].method, 'Object.isDate is Prototype');
  notEqual(Object.isNumber, Object.SugarMethods['isNumber'].method, 'Object.isNumber is Prototype');
  notEqual(Object.isFunction, Object.SugarMethods['isFunction'].method, 'Object.isFunction is Prototype');

  Object.sugar('keys', 'isDate', 'isNumber', 'somebooshit');

  strictlyEqual(Object.keys, Object.SugarMethods['keys'].method, 'Object.keys is Sugar');
  strictlyEqual(Object.isDate, Object.SugarMethods['isDate'].method, 'Object.isDate is Sugar');
  strictlyEqual(Object.isNumber, Object.SugarMethods['isNumber'].method, 'Object.isNumber is Sugar');
  notEqual(Object.isFunction, Object.SugarMethods['isFunction'].method, 'Object.isFunction is still Prototype');

});
