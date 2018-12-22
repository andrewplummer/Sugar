namespace('Object | Equality', function() {
  'use strict';

  // These tests also shamelessly stolen from the Underscore.js test suite.
  // Careful checks for cyclical references, equality between primitives and
  // wrappers, and more. Sugar's callObjectEqual should now be considered "egal".

  function callObjectEqual(a, b) {
    if (!isDefaultMode() && !canTestPrimitiveScope) {
      // If the environment doesn't allow null scope, then there's no way
      // to predict how the scope will be mangled by running "a" through it,
      // so run isEqual as a static method instead. This is simulating a real
      // world situation as well as there is no way to map isEqual to Object
      // prototype and have it work for string primitives when strict mode is
      // not available, so the user will in that case have to go through the
      // static method as well. Similarly, chainables would have to go through
      // a significant tapdance to get working right with null scope issues,
      // and the performance penalties and indescrepancy with extended mode
      // is not worth the benefits.
      return run(Object, 'isEqual', [a, b]);
    }
    return run(a, 'isEqual', [b]);
  }

  function createSet(str) {
    var s = new Set();
    if (str) {
      s.add(str);
    }
    return s;
  }

  function createMap(arr) {
    var m = new Map();
    if (arr) {
      m.set(arr[0], arr[1]);
    }
    return m;
  }

  function createTypedArray(ArrayClass, src) {
    var arr = new ArrayClass(src.length);
    for (var i = 0; i < src.length; i++) {
      arr[i] = src[i];
    }
    return arr;
  }

  function assertTypedArrayEquality(ArrayClass) {

    function callTypedArrayEqual(ArrayClass, s1, s2, expected) {
      var arr1 = createTypedArray(ArrayClass, s1);
      var arr2 = createTypedArray(ArrayClass, s2);
      equal(callObjectEqual(arr1, arr2), expected, ArrayClass.name + ' | ' + expected);
    }

    callTypedArrayEqual(ArrayClass, [], [], true);
    callTypedArrayEqual(ArrayClass, [256], [], false);
    callTypedArrayEqual(ArrayClass, [], [256], false);
    callTypedArrayEqual(ArrayClass, [256], [256], true);

  }

  function First() {
    this.value = 1;
  }
  First.prototype.value = 1;

  function Second() {
    this.value = 1;
  }
  Second.prototype.value = 2;


  group('Basic equality and identity comparisons', function() {
    equal(callObjectEqual(0, 0), true, "0 is equal to 0");
    equal(callObjectEqual(-0, -0), true, "-0 is equal to -0");
    equal(callObjectEqual(0, -0), false, "0 is not equal to -0");
    equal(callObjectEqual(-0, 0), false, "Commutative equality is implemented for 0 and -0");

    equal(callObjectEqual(), true, "undefined is equal to undefined");
    equal(callObjectEqual(null, null), true, "null is equal to null");
    equal(callObjectEqual(null, undefined), false, "null is not equal to undefined");
    equal(callObjectEqual(undefined, null), false, "Commutative equality is implemented for null and undefined");
  });

  group('String object and primitive comparisons', function() {
    equal(callObjectEqual("Curly", "Curly"), true, "Identical string primitives are equal");
    equal(callObjectEqual(new String("Curly"), new String("Curly")), true, "String objects with identical primitive values are equal");

    equal(callObjectEqual("Curly", "Larry"), false, "String primitives with different values are not equal");
    equal(callObjectEqual(new String("Curly"), "Curly"), false, "String primitives and their corresponding object wrappers are not equal");
    equal(callObjectEqual("Curly", new String("Curly")), false, "Commutative equality is implemented for string objects and primitives");
    equal(callObjectEqual(new String("Curly"), new String("Larry")), false, "String objects with different primitive values are not equal");
    equal(callObjectEqual(new String("Curly"), {toString: function(){ return "Curly"; }}), false, "String objects and objects with a custom toString method are not equal");
  });

  group('Number object and primitive comparisons', function() {
    equal(callObjectEqual(75, 75), true, "Identical number primitives are equal");
    equal(callObjectEqual(new Number(75), new Number(75)), true, "Number objects with identical primitive values are equal");

    equal(callObjectEqual(75, new Number(75)), false, "Number primitives and their corresponding object wrappers are not equal");
    equal(callObjectEqual(new Number(75), 75), false, "Commutative equality is implemented for number objects and primitives");
    equal(callObjectEqual(new Number(75), new Number(63)), false, "Number objects with different primitive values are not equal");
    equal(callObjectEqual(new Number(63), {valueOf: function(){ return 63; }}), false, "Number objects and objects with a valueOf method are not equal");
  });

  group('Comparisons involving NaN', function() {
    equal(callObjectEqual(NaN, NaN), true, "NaN is equal to NaN");
    equal(callObjectEqual(61, NaN), false, "A number primitive is not equal to NaN");
    equal(callObjectEqual(new Number(79), NaN), false, "A number object is not equal to NaN");
    equal(callObjectEqual(Infinity, NaN), false, "Infinity is not equal to NaN");
  });

  group('Boolean object and primitive comparisons', function() {
    equal(callObjectEqual(true, true), true, "Identical boolean primitives are equal");
    equal(callObjectEqual(new Boolean, new Boolean), true, "Boolean objects with identical primitive values are equal");
    equal(callObjectEqual(true, new Boolean(true)), false, "Boolean primitives and their corresponding object wrappers are not equal");
    equal(callObjectEqual(new Boolean(true), true), false, "Commutative equality is implemented for booleans");
    equal(callObjectEqual(new Boolean(true), new Boolean), false, "Boolean objects with different primitive values are not equal");
  });


  group('Common type coercions', function() {
    equal(callObjectEqual(true, new Boolean(false)), false, "Boolean objects are not equal to the boolean primitive true");
    equal(callObjectEqual("75", 75), false, "String and number primitives with like values are not equal");
    equal(callObjectEqual(new Number(63), new String(63)), false, "String and number objects with like values are not equal");
    equal(callObjectEqual(75, "75"), false, "Commutative equality is implemented for like string and number values");
    equal(callObjectEqual(0, ""), false, "Number and string primitives with like values are not equal");
    equal(callObjectEqual(1, true), false, "Number and boolean primitives with like values are not equal");
    equal(callObjectEqual(new Boolean(false), new Number(0)), false, "Boolean and number objects with like values are not equal");
    equal(callObjectEqual(false, new String("")), false, "Boolean primitives and string objects with like values are not equal");
    equal(callObjectEqual(1256428800000, new Date(Date.UTC(2009, 9, 25))), false, "Dates and their corresponding numeric primitive values are not equal");
  });

  group('Dates', function() {
    equal(callObjectEqual(new Date(2009, 9, 25), new Date(2009, 9, 25)), true, "Date objects referencing identical times are equal");
    equal(callObjectEqual(new Date(2009, 9, 25), new Date(2009, 9, 25, 0, 0, 0, 1)), false, "Date objects 1ms apart");
    equal(callObjectEqual(new Date(2009, 9, 25), new Date(2009, 11, 13)), false, "Date objects referencing different times are not equal");
    equal(callObjectEqual(new Date(2009, 11, 13), {
      getTime: function(){
        return 12606876e5;
      }
    }), false, "Date objects and objects with a getTime method are not equal");
    equal(callObjectEqual(new Date("Curly"), new Date("Curly")), true, "Invalid dates are equal");
  });

  group('Functions', function() {
    equal(callObjectEqual(First, Second), false, "Different functions with identical bodies and source code representations are not equal");
  });

  group('Regexes', function() {
    equal(callObjectEqual(/(?:)/gim, /(?:)/gim), true, "RegExps with equivalent patterns and flags are equal");
    equal(callObjectEqual(/(?:)/g, /(?:)/gi), false, "RegExps with equivalent patterns and different flags are not equal");
    equal(callObjectEqual(/Moe/gim, /Curly/gim), false, "RegExps with different patterns and equivalent flags are not equal");
    equal(callObjectEqual(/(?:)/gi, /(?:)/g), false, "Commutative equality is implemented for RegExps");
    equal(callObjectEqual(/Curly/g, {source: "Larry", global: true, ignoreCase: false, multiline: false}), false, "RegExps and RegExp-like objects are not equal");
  });

  group('Empty arrays, array-like objects, and object literals', function() {
    equal(callObjectEqual({}, {}), true, "Empty object literals are equal");
    equal(callObjectEqual([], []), true, "Empty array literals are equal");
    equal(callObjectEqual([{}], [{}]), true, "Empty nested arrays and objects are equal");
    equal(callObjectEqual({length: 0}, []), false, "Array-like objects and arrays are not equal.");
    equal(callObjectEqual([], {length: 0}), false, "Commutative equality is implemented for array-like objects");

    equal(callObjectEqual({}, []), false, "Object literals and array literals are not equal");
    equal(callObjectEqual([], {}), false, "Commutative equality is implemented for objects and arrays");
    equal(callObjectEqual((function(){ return arguments; })(), (function(){ return arguments; })()), true, "Empty arguments objects are equal");
  });

  group('Arrays with primitive and object values', function() {
    equal(callObjectEqual([1, true, "Larry", true], [1, true, "Larry", true]), true, "Arrays containing identical primitives are equal");
    equal(callObjectEqual([/Moe/g, new Date(2009, 9, 25)], [/Moe/g, new Date(2009, 9, 25)]), true, "Arrays containing equivalent elements are equal");
  });

  group('Multi-dimensional arrays', function() {
    var a = [new Number(47), false, true, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
    var b = [new Number(47), false, true, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
    equal(callObjectEqual(a, b), true, "Arrays containing nested arrays and objects are recursively compared");

    // Overwrite the methods defined in ES 5.1 section 15.4.4.
    a.forEach = a.map = a.filter = a.every = a.indexOf = a.lastIndexOf = a.some = a.reduce = a.reduceRight = null;
    b.pop = b.reverse = b.shift = b.slice = b.splice = b.concat = b.sort = b.unshift = null;

    // Array elements and properties.
    equal(callObjectEqual(a, b), false, "Arrays with different overwritten inherited properties are not equal");
    a.push("White Rocks");
    equal(callObjectEqual(a, b), false, "Arrays of different lengths are not equal");
    a.push("East Boulder");
    b.push("Gunbarrel Ranch", true, "Teller Farm");
    equal(callObjectEqual(a, b), false, "Arrays of identical lengths containing different elements are not equal");
  });

  group('Sparse arrays', function() {
    equal(callObjectEqual(Array(3), Array(3)), true, "Sparse arrays of identical lengths are equal");
    equal(callObjectEqual(Array(3), Array(6)), false, "Sparse arrays of different lengths are not equal when both are empty");
    equal(callObjectEqual(Array(3), safeArray(undefined, undefined, undefined)), false, "Sparse arrays are not treated as dense");
  });

  group('Simple objects', function() {
    equal(callObjectEqual({a: "Curly", b: 1, c: true}, {a: "Curly", b: 1, c: true}), true, "Objects containing identical primitives are equal");
    equal(callObjectEqual({a: /Curly/g, b: new Date(2009, 11, 13)}, {a: /Curly/g, b: new Date(2009, 11, 13)}), true, "Objects containing equivalent members are equal");
    equal(callObjectEqual({a: 63, b: 75}, {a: 61, b: 55}), false, "Objects of identical sizes with different values are not equal");
    equal(callObjectEqual({a: 63, b: 75}, {a: 61, c: 55}), false, "Objects of identical sizes with different property names are not equal");
    equal(callObjectEqual({a: 1, b: 2}, {a: 1}), false, "Objects of different sizes are not equal");
    equal(callObjectEqual({a: 1}, {a: 1, b: 2}), false, "Commutative equality is implemented for objects");
    equal(callObjectEqual({x: 1, y: undefined}, {x: 1, z: 2}), false, "Objects with identical keys and different values are not equivalent");

    // A contains nested objects and arrays.
    var a = {
      name: new String("Moe Howard"),
      age: new Number(77),
      stooge: true,
      hobbies: ["acting"],
      film: {
        name: "Sing a Song of Six Pants",
        release: new Date(1947, 9, 30),
        stars: [new String("Larry Fine"), true, "Shemp Howard"],
        minutes: new Number(16),
        seconds: 54
      }
    };

    // B contains equivalent nested objects and arrays.
    var b = {
      name: new String("Moe Howard"),
      age: new Number(77),
      stooge: true,
      hobbies: ["acting"],
      film: {
        name: "Sing a Song of Six Pants",
        release: new Date(1947, 9, 30),
        stars: [new String("Larry Fine"), true, "Shemp Howard"],
        minutes: new Number(16),
        seconds: 54
      }
    };
    equal(callObjectEqual(a, b), true, "Objects with nested equivalent members are recursively compared");
  });

  group('Instances', function() {
    equal(callObjectEqual(new First, new First), false, "Object instances are not equal");
    equal(callObjectEqual(new First, new Second), false, "Objects with different constructors and identical own properties are not equal");
    equal(callObjectEqual({value: 1}, new First), false, "Object instances and objects sharing equivalent properties are not identical");
    equal(callObjectEqual({value: 2}, new Second), false, "The prototype chain of objects should not be examined");
  });

  group('Circular Arrays', function() {
    var a, b;
    (a = []).push(a);
    (b = []).push(b);
    equal(callObjectEqual(a, b), true, "Arrays containing circular references are equal");
    a.push(new String("Larry"));
    b.push(new String("Larry"));
    equal(callObjectEqual(a, b), true, "Arrays containing circular references and equivalent properties are equal");
    a.push("Shemp");
    b.push("Curly");
    equal(callObjectEqual(a, b), false, "Arrays containing circular references and different properties are not equal");
  });

  group('Circular Objects', function() {
    var a, b;
    a = {abc: null};
    b = {abc: null};
    a.abc = a;
    b.abc = b;
    equal(callObjectEqual(a, b), true, "Objects containing circular references are equal");
    a.def = 75;
    b.def = 75;
    equal(callObjectEqual(a, b), true, "Objects containing circular references and equivalent properties are equal");
    a.def = new Number(75);
    b.def = new Number(63);
    equal(callObjectEqual(a, b), false, "Objects containing circular references and different properties are not equal");
  });

  group('Cyclic Structures', function() {
    var a, b;
    a = [{abc: null}];
    b = [{abc: null}];
    (a[0].abc = a).push(a);
    (b[0].abc = b).push(b);
    equal(callObjectEqual(a, b), true, "Cyclic structures are equal");
    a[0].def = "Larry";
    b[0].def = "Larry";
    equal(callObjectEqual(a, b), true, "Cyclic structures containing equivalent properties are equal");
    a[0].def = new String("Larry");
    b[0].def = new String("Curly");
    equal(callObjectEqual(a, b), false, "Cyclic structures containing different properties are not equal");
  });

  group('Complex Circular References', function() {
    var a, b;
    a = {foo: {b: {foo: {c: {foo: null}}}}};
    b = {foo: {b: {foo: {c: {foo: null}}}}};
    a.foo.b.foo.c.foo = a;
    b.foo.b.foo.c.foo = b;
    equal(callObjectEqual(a, b), true, "Cyclic structures with nested and identically-named properties are equal");
  })

  group('Custom isEqual methods', function() {
    var isEqualObj = {isEqual: function (o) { return o.isEqual == this.isEqual; }, unique: {}};
    var isEqualObjClone = {isEqual: isEqualObj.isEqual, unique: {}};

    equal(callObjectEqual(isEqualObj, isEqualObjClone), true, 'Both objects implement identical isEqual methods');
    equal(callObjectEqual(isEqualObjClone, isEqualObj), true, 'Commutative equality is implemented for objects with custom isEqual methods');
    equal(callObjectEqual(isEqualObj, {}), false, 'Objects that do not implement equivalent isEqual methods are not equal');
    equal(callObjectEqual({}, isEqualObj), false, 'Commutative equality is implemented for objects with different isEqual methods');
  });

  group('Errors', function() {
    if (new TypeError('foo').toString() === '[object Error]') {
      // Unfortunately these tests won't pass in < IE8 as Error objects seem to have
      // no way to distinguish their type, as calling toString on both the objects
      // themselves and their constructor only returns [object Error].
      return;
    }

    function assertErrorPasses(ErrorClass) {
      var name = ErrorClass.name;
      equal(callObjectEqual(new ErrorClass('foo'), new ErrorClass('foo')), true, name + ' | foo == foo');
      equal(callObjectEqual(new ErrorClass('foo'), new ErrorClass('bar')), false, name + ' | foo != bar');
    }

    assertErrorPasses(Error);
    assertErrorPasses(TypeError);
    assertErrorPasses(RangeError);
    assertErrorPasses(EvalError);
    assertErrorPasses(ReferenceError);
    assertErrorPasses(SyntaxError);
    assertErrorPasses(URIError);

    equal(callObjectEqual(new TypeError('foo'), new RangeError('foo')), false, 'different types are never equal');

  });

  group('Sets', function() {
    if (typeof Set === 'undefined') return;
    equal(callObjectEqual(createSet(), createSet()),        true,  '{} == {}');
    equal(callObjectEqual(createSet('a'), createSet()),     false, '{a} != {}');
    equal(callObjectEqual(createSet('a'), createSet()),     false, '{} != {a}');
    equal(callObjectEqual(createSet('a'), createSet('a')),  true,  '{a} == {a}');
    equal(callObjectEqual(createSet('a'), createSet('b')),  false, '{a} != {b}');
    equal(callObjectEqual(createSet([5]), createSet([5])),  true,  '{5} == {5}');
    equal(callObjectEqual(createSet([5]), createSet([10])), false, '{5} != {10}');

    equal(callObjectEqual(createSet([[1,2,3]]), createSet([[1,2,3]])), true,  '{1,2,3} == {1,2,3}');
    equal(callObjectEqual(createSet([[1,2,3]]), createSet([[1,2]])),   false, '{1,2,3} != {1,2}');
    equal(callObjectEqual(createSet([{a:'a'}]), createSet([{a:'a'}])), true,  '{a:a} == {a:a}');
    equal(callObjectEqual(createSet([{a:'a'}]), createSet([{a:'b'}])), false, '{a:a} != {a:b}');
  });

  group('Maps', function() {
    if (typeof Map === 'undefined') return;
    equal(callObjectEqual(createMap(), createMap()), true,  'empty == empty');
    equal(callObjectEqual(createMap(['a','a']), createMap(['a','a'])), true, 'a => a == a => a');
    equal(callObjectEqual(createMap(['a','a']), createMap(['a','b'])), false, 'a => a != a => b');
    equal(callObjectEqual(createMap(['a','a']), createMap(['b','a'])), false, 'a => a != a => b');
  });

  group('Typed Arrays', function() {
    if (typeof ArrayBuffer === 'undefined') return;

    assertTypedArrayEquality(Int8Array);
    assertTypedArrayEquality(Uint8Array);
    assertTypedArrayEquality(Int16Array);
    assertTypedArrayEquality(Uint16Array);
    assertTypedArrayEquality(Int32Array);
    assertTypedArrayEquality(Uint32Array);
    assertTypedArrayEquality(Float32Array);
    assertTypedArrayEquality(Float64Array);

    equal(callObjectEqual(createTypedArray(Int8Array, [256]), createTypedArray(Int32Array, [256])), false, 'different types are never equal');
  });

  group('Uint8ClampedArray', function() {
    if (typeof Uint8ClampedArray === 'undefined') return;
    assertTypedArrayEquality(Uint8ClampedArray);
  });

  group('Symbols', function() {
    if (typeof Symbol === 'undefined') return;
    var sym = Symbol('a');
    equal(callObjectEqual(Symbol('a'), Symbol('a')), false, 'Symbols are never equivalent');
    equal(callObjectEqual(sym, sym), true, 'Symbols are still equal by reference');
    equal(callObjectEqual(Object(sym), sym), false, 'First symbol wrapped by Object');
    equal(callObjectEqual(Object(sym), Object(sym)), false, 'Both symbols wrapped by object');
  });

});

