namespace('Array', function () {
  'use strict';

  method('Array.from', function() {
    var stringObj = new String('foo');

    raisesError(function() { Array.from() }, 'no args raises an error', TypeError);
    raisesError(function() { Array.from(null) }, 'null raises an error', TypeError);
    raisesError(function() { Array.from(undefined) }, 'undefined raises an error', TypeError);
    raisesError(function() { Array.from('one', 2) }, 'number 2nd arg raises error', TypeError);
    raisesError(function() { Array.from('one', '2') }, 'string 2nd arg raises error', TypeError);
    raisesError(function() { Array.from('one', [2]) }, 'array 2nd arg raises error', TypeError);
    raisesError(function() { Array.from('one', {a:1}) }, 'object 2nd arg raises error', TypeError);

    equal(Array.from('one'), ['o','n','e'], 'string');
    equal(Array.from(stringObj), ['f','o','o'], 'string object');
    equal(Array.from({0:'foo',1:'bar',length: 2}), ['foo', 'bar'], 'array-like objects are created');

    equal(Array.from(2), [], 'number not allowed');
    equal(Array.from(true), [], 'boolean not allowed');
    equal(Array.from({a:1}), [], 'object not allowed');

    equal(Array.from([2]), [2], 'in array | number');
    equal(Array.from([true]), [true], 'in array | boolean');
    equal(Array.from([null]), [null], 'in array | null');
    equal(Array.from([undefined]), safeArray(undefined), 'in array | undefined');

    equal(Array.from([1,2,3]), [1,2,3], 'passing an array');
    equal(Array.from([[1,2,3]]), [[1,2,3]], 'in array | is nested');

    equal(Array.from([{a:1}]), [{a:1}], 'in array | object');

    equal((function(){ return Array.from(arguments); })('one','two'), ['one','two'], 'works on an arguments object');
    equal((function(){ return Array.from(arguments); })(), [], 'works on a zero length arguments object');
    equal((function(){ return Array.from(arguments); })('one').slice, Array.prototype.slice, 'converted arguments object is a true array');
    equal((function(){ return Array.from(arguments); })('one','two').slice, Array.prototype.slice, 'two | converted arguments object is a true array');
    equal((function(){ return Array.from.call(null, arguments); })('one','two'), ['one','two'], 'arguments using call');
    equal((function(){ return Array.from.apply(null, [arguments]); })('one','two'), ['one','two'], 'arguments using apply');

    var args = (function() { return arguments; })(true, 1, 'two');
    equal(Array.from([args]), [args], 'nested arguments is a nested array');

    var arr1 = [1,2,3];
    var arr2 = Array.from(arr1);
    arr2.push(4);
    equal(arr1.length, 3, 'Array passed should not be the same object');


    // Useful case
    var result = Array.from(new Array(4), function(el, index) {
      return index * index;
    });
    equal(result, [0, 1, 4, 9], 'New array created from mapping index');

    // Rewritten from https://github.com/mathiasbynens/Array.from/blob/master/tests/tests.js

    equal(Array.from.length, 1, 'Array.from has proper length');

    raisesError(function() { Array.from({ length: Infinity }); }, 'raises error with Infinite length');
    raisesError(function() { Array.from({ length: Math.pow(2, 32) }) }, 'raises error with length too large');

    equal(Array.from({ length: -1 }).length, 0, 'swallows length: -1');
    equal(Array.from({ length: -Infinity }).length, 0, 'swallows length: -Infinity');
    equal(Array.from({ length: -0 }).length, 0, 'swallows length: -0');
    equal(Array.from({ length: -42}).length, 0, 'swallows length: -42');


    equal(Array.from(false), [], 'works with false');
    equal(Array.from(true), [], 'works with true');
    equal(Array.from(-Infinity), [], 'works with -Infinity');
    equal(Array.from(-0), [], 'works with -0');
    equal(Array.from(0), [], 'works with 0');
    equal(Array.from(1), [], 'works with 1');
    equal(Array.from(Infinity), [], 'works with Infinity');

    equal(Array.from(''), [], 'works with empty string');
    equal(Array.from('abc'), 'abc'.split(''), 'works with string');

    equal(Array.from({}), [], 'works with empty object');
    equal(Array.from({ a: 1 }), [], 'works with object');

    equal(Array.from([]), [], 'works with empty array');
    equal(Array.from([1, 2, 3]), [1, 2, 3], 'works with 1,2,3');
    equal(Array.from([4, 5, 6]), [4, 5, 6], 'works with 4,5,6');

    var arr = [1, 2, 3];
    delete arr[1];
    equal(Array.from(arr), safeArray(1, undefined, 3), 'fills in 1,,3');
    equal(Array.from([4,, 6]), safeArray(4, undefined, 6), 'fills in 4,,6');

    Object.prototype[3] = 42;
    equal(Array.from({0:1,1:2,2:3,length:4}), [1, 2, 3, 42], 'it includes Object.prototype values when it is polluted');
    delete Object.prototype[3];

    equal(Array.from({ length: 1 }), safeArray(void 0), 'works with empty array-like');
    equal(Array.from({ 0: 'a', 1: 'b', length: 2 }), ['a', 'b'], 'works with array-like');


    // This test appears to be wrong. Spec may have been in flux.
    // raisesError(function () { Array.from([], undefined); }, 'raises error on undefined mapping', TypeError);

    equal(Array.from([1,2,3], undefined), [1,2,3], 'does not raise an error on undefined mapping');
    equal(Array.from([1,2,3], undefined, {}), [1,2,3], 'does not raise an error on undefined mapping with thisArg');

    raisesError(function () { Array.from([], null); }, 'raises error on null mapping', TypeError);
    raisesError(function () { Array.from([], false); }, 'raises error on false mapping', TypeError);
    raisesError(function () { Array.from([], true); }, 'raises error on true mapping', TypeError);
    raisesError(function () { Array.from([], {}); }, 'raises error on empty object mapping', TypeError);
    raisesError(function () { Array.from([], /a/g); }, 'raises error on regex mapping', TypeError);
    raisesError(function () { Array.from([], 'foo'); }, 'raises error on string mapping', TypeError);
    raisesError(function () { Array.from([], 42); }, 'raises error on number mapping', TypeError);

    var original = [1, 2, 3];
    var actual = Array.from(original, function (value, index) {
      equal(value, original[index], 'value and index are correct');
      equal(arguments.length, 2, 'value and index are only arguments passed to the mapping function');
      return value * 2;
    });
    equal(actual, [2, 4, 6], 'mapping function');

    var context = {};
    Array.from(original, function (value, index) {
      equal(this, context, 'given context is the actual context');
    }, context);

    Array.from(original, function (value, index) {
      equal(this.valueOf(), 42, 'number context valueOf() is correct');
      equal(Object.prototype.toString.call(this), '[object Number]', 'context "[[Class]]" is correct');
    }, 42);

    Array.from(original, function (value, index) {
      equal(this.valueOf(), false, 'boolean context valueOf() is correct');
      equal(Object.prototype.toString.call(this), '[object Boolean]', 'context "[[Class]]" is correct');
    }, false);

    var from = Array.from;
    equal(Array.from.call(null, { length: 1, 0: 'a' }), ['a'], 'can be called with call');
    equal(from({ length: 1, 0: 'a' }), ['a'], 'can be called with global context');


    if (Array.propertyIsEnumerable) {
      equal(Array.propertyIsEnumerable('from'), testDefinePropertySupport ? false : true, 'Array.from is not enumerable');
    }

    if (testDefinePropertySupport) {

      var MyType = function () {};
      Object.defineProperty(MyType.prototype, '0', {
        set: function (x) { throw new Error('setter called: ' + x); }
      });

      // Note: Safari fails this test due to a browser bug where it
      // will not call setters defined on numeric keys. Fortunately
      // this is not testing Array.from functionality anyway, so
      // commenting out.
      // var myInstance = new MyType();
      // raisesError(function () { myInstance[0] = 'foo'; }, 'no setter called');

      var actual = Array.from.call(MyType, { 0: 'abc', length: 1 });
      equal(actual[0], 'abc', 'result should have index 0 set');
      equal(actual.length, 1, 'result should have length 1');
      equal(actual instanceof MyType, true, 'result is instance of class');

    }

    // More tests taken from polyfill
    equal(Array.from({length:NaN}), [], 'accepts NaN lengths');
    equal(Array.from({length:.33333}), [], 'accepts non integer lengths');
    equal(Array.from({length:-Infinity}), [], 'swallows -Infinity');

    Array.from([1], function () {
      equal(this, testNullScope, 'when not passed, context should be default undefined context');
    });

    Array.from.call({}, [1], function () {
      equal(this, testNullScope, 'context should still be undefined even if .call() is used');
    });

    if (typeof document !== 'undefined') {

      // Can convert special host objects if they exist.
      var el = document.createElement('div');
      if(el.classList) {
        el.className = 'woot';
        equal(Array.from(el.classList), ['woot'], 'handles DOMTokenList');
      }
      if (document.querySelectorAll) {
        equal(Array.from(document.querySelectorAll('body')), [document.body], 'handles NodeList');
      }
      if(el.children) {
        var el2 = document.createElement('div');
        el.appendChild(el2);
        equal(Array.from(el.children), [el2], 'handles HTMLCollection');
      }

    }

  });

  method('find', function() {
    var arr, count, result, visited;

    equal(Array.prototype.find.length, 1, 'should have argument length of 1');

    equal([1,2,3].find(function(el){ return el === 3; }), 3, 'Array#find | should find by predicate');
    equal([1,2,3].find(function(el){ return el === 7; }), undefined, 'Array#find | should return undefined when not matched');

    arr = ['a','b','c'];
    count = 0;

    arr.find(function(el) {
      count++;
      return el === 'a';
    });

    equal(count, 1, 'Array#find only visits until the first element is found');

    arr   = ['a','b','c'];
    count = 0;
    var expectedValues  = ['a', 'b', 'c'];
    var expectedIndexes = [0, 1, 2];

    arr.find(function(el, i, a) {
      equal(el, expectedValues[count], 'Array#find | first argument should be element');
      equal(i, expectedIndexes[count], 'Array#find | second argument should be index');
      equal(a, arr, 'Array#find | third argument should be the array');
      equal(this, testNullScope, 'Array#find | context should be undefined');
      count++;
    });
    equal(count, 3, 'Array#find | should have iterated 3 times');

    var scope = {};
    [1].find(function() {
      equal(this, scope, 'Array#find | this object should be passable');
    }, scope);



    arr = { 0:'a',1:'b',2:'c',length: 3 };
    result = Array.prototype.find.call(arr, function(el) {
      return el === 'a';
    });
    equal(result, 'a', 'Array#find | should work on array-like objects');

    arr = { 0:'a',1:'b',2:'c',length: '3' };
    result = Array.prototype.find.call(arr, function(el) {
      return el === 'a';
    });
    equal(result, 'a', 'Array#find | should work on array-like objects with length of type string');


    arr = ['a'];
    arr[2] = 'b';
    visited = [];
    arr.find(function(el) {
      visited.push(el);
    });

    equal(visited, safeArray('a', undefined, 'b'), 'Array#find | should visit undefined indexes');


    arr = ['a'];
    visited = [];
    arr.find(function(el) {
      visited.push(el);
      arr.push('b');
    });

    equal(visited, ['a'], 'Array#find | does not visit elements mutated after being called');

  });

  method('findIndex', function() {
    var arr, count, result, visited;

    equal(Array.prototype.findIndex.length,   1, 'Array#findIndex | should have argument length of 1');

    equal([1,2,3].findIndex(function(el){ return el === 2; }), 1, 'Array#findIndex | should findIndex by predicate');
    equal([1,2,3].findIndex(function(el){ return el === 7; }), -1, 'Array#findIndex | should return -1 when not matched');

    arr = ['a','b','c'];
    count = 0;

    arr.findIndex(function(el) {
      count++;
      return el === 'a';
    });

    equal(count, 1, 'Array#findIndex only visits until the first element is found');

    arr   = ['a','b','c'];
    count = 0;
    var expectedValues  = ['a', 'b', 'c'];
    var expectedIndexes = [0, 1, 2];

    arr.findIndex(function(el, i, a) {
      equal(el, expectedValues[count], 'Array#findIndex | first argument should be element');
      equal(i, expectedIndexes[count], 'Array#findIndex | second argument should be index');
      equal(a, arr, 'Array#findIndex | third argument should be the array');
      equal(this, testNullScope, 'Array#findIndex | context should be undefined');
      count++;
    });
    equal(count, 3, 'Array#findIndex | should have iterated 3 times');

    var scope = {};
    [1].findIndex(function() {
      equal(this, scope, 'Array#findIndex | this object should be passable');
    }, scope);



    arr = { 0:'a',1:'b',2:'c',length: 3 };
    result = Array.prototype.findIndex.call(arr, function(el) {
      return el === 'a';
    });
    equal(result, 0, 'Array#findIndex | should work on array-like objects');

    arr = { 0:'a',1:'b',2:'c',length: '3' };
    result = Array.prototype.findIndex.call(arr, function(el) {
      return el === 'a';
    });
    equal(result, 0, 'Array#findIndex | should work on array-like objects with length of type string');


    arr = ['a'];
    arr[2] = 'b';
    visited = [];
    arr.findIndex(function(el) {
      visited.push(el);
    });

    equal(visited, safeArray('a', undefined, 'b'), 'Array#findIndex | should visit undefined indexes');

    arr = ['a'];
    visited = [];
    arr.findIndex(function(el) {
      visited.push(el);
      arr.push('b');
    });


    equal(visited, ['a'], 'Array#findIndex | does not visit elements mutated after being called');

  });

});
