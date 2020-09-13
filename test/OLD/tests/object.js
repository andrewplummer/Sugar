namespace('Object', function () {
  'use strict';

  group('Chainable', function() {
    equal(new Sugar.Object({foo:'bar'}).raw, {foo:'bar'}, 'argument should be converted to object');
    equal(typeof new Sugar.Object('foo').raw, 'string', 'primitive should not be coerced into object');
    equal(new Sugar.Object({foo:'bar',boo:'mar'}).keys().raw, ['foo','boo'], 'should have keys as instance');
  });

  group('Static Extended', function() {

    if (!isExtendedMode()) {
      // Testing basic instance methods have been
      // mapped over as static, but only in extended mode.
      return;
    };

    // Just test a few basic methods to ensure they've been mapped.
    equal(Object.get({foo:'bar'}, 'foo'), 'bar', 'Object.get was extended');
    equal(Object.isArray(['a']), true, 'Object.isArray was extended');
  });

  method('isObject', function() {
    var Person = function() {};
    var p = new Person();

    test({}, true, '{}');
    test(new Object({}), true, 'new Object()');
    test([], false, '[]');
    test(new Sugar.Object(), false, 'chainable');
    test(new Array(1,2,3), false, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(p, false, 'instance');

    function Foo() {}
    Foo.prototype = { foo: 3 };
    test(new Foo, false, 'Object with inherited properties');

    if (Object.create) {
      test(Object.create(null), true, 'Object with null prototype');
    }

    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isArray', function() {
    test({}, false, '{}');
    test([], true, '[]');
    test(new Array(1,2,3), true, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isBoolean', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, true, 'false');
    test(true, true, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isDate', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), true, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isFunction', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, true, 'function() {}');
    test(new Function(), true, 'new Function()');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });


  method('isNumber', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, true, '1');
    test(0, true, '0');
    test(-1, true, '-1');
    test(new Number('3'), true, 'new Number("3")');
    test('wasabi', false, '"wasabi"');
    test(NaN, true, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isString', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, false, '1');
    test('wasabi', true, '"wasabi"');
    test(new String('wasabi'), true, 'new String("wasabi")');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isRegExp', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new RegExp(), true, 'new RegExp()');
    test(/afda/, true, '/afda/');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(new Function(), false, 'new Function()');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isArguments', function() {
    test({}, false, '{}');
    test([], false, '[]');
    test(new Array(1,2,3), false, 'new Array(1,2,3)');
    test(new RegExp(), false, 'new RegExp()');
    test(new Date(), false, 'new Date()');
    test(function() {}, false, 'function() {}');
    test(1, false, '1');
    test('wasabi', false, '"wasabi"');
    test(NaN, false, 'NaN');
    test(false, false, 'false');
    test(true, false, 'true');
    test((function(){ return arguments; })(), true, 'arguments object with 0 length');
    test((function(){ return arguments; })(1,2,3), true, 'arguments object with 3 length');
    test(Object, [null], false, 'null');
    test(Object, [undefined], false, 'undefined');
  });

  method('isError', function() {
    test(new Error(),          true, 'Error');
    test(new TypeError(),      true, 'TypeError');
    test(new RangeError(),     true, 'RangeError');
    test(new EvalError(),      true, 'EvalError');
    test(new URIError(),       true, 'URIError');
    test(new SyntaxError(),    true, 'SyntaxError');
    test(new ReferenceError(), true, 'ReferenceError');
    test('Error!', false, 'Error!');
  });

  method('isSet', function() {
    if (typeof Set === 'undefined') return;
    test(new Set(), true, '{}');
    test(new Set(['1','2','3']), true, '{1,2,3}');
    test([], false, 'Array');
    test({}, false, 'Object');
  });

  method('isMap', function() {
    if (typeof Map === 'undefined') return;
    test(new Map(), true, '{}');
    test([], false, 'Array');
    test({}, false, 'Object');
  });

});
