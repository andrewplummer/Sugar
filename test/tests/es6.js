package('ES6', function () {
  "use strict";

  // Only true in strict mode
  var allowsNullScope = (function(){ return this; }).call(null) === null;
  var undefinedContextObj = (function(){ return this; }).call(undefined);

  method('find', function() {
    var arr, count, result, visited;

    // Can't rely on length at the moment until I figure out
    // how to turn off this option in the closure compiler.
    equal(Array.prototype.find.length,        1, 'Array#find | should have argument length of 1');

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
      equal(this, undefinedContextObj, 'Array#find | context should be undefined');
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

    equal(visited, testGetArrayWithUndefined('a', undefined, 'b'), 'Array#find | should visit undefined indexes');


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
      equal(this, undefinedContextObj, 'Array#findIndex | context should be undefined');
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

    equal(visited, testGetArrayWithUndefined('a', undefined, 'b'), 'Array#findIndex | should visit undefined indexes');

    arr = ['a'];
    visited = [];
    arr.findIndex(function(el) {
      visited.push(el);
      arr.push('b');
    });


    equal(visited, ['a'], 'Array#findIndex | does not visit elements mutated after being called');
  });

  method('startsWith', function() {

    // startsWith/endsWith is defined in Harmony, so only passing a regex or
    // 3 arguments will actually test this code.

    test('HELLO', false, 'undefined produces false');
    test('hello', ['hell', 0, true], true, 'hello starts with hell');
    test('HELLO', ['HELL', 0, true], true, 'HELLO starts with HELL');
    test('HELLO', ['hell', 0, true], false, 'HELLO starts with hell');
    test('HELLO', ['hell', 0, true], false, 'case sensitive | HELLO starts with hell');
    test('hello', [/hell/, 0, true], true, 'accepts regex');
    test('hello', [/[a-h]/, 0, true], true, 'accepts regex alternates');
    test('HELLO', ['hell', 0, false], true, 'case insensitive | HELLO starts with hell');
    test('hello', ['hell', -20, true], true, 'from pos -20');
    test('hello', ['hell', 1, true], false, 'from pos 1');
    test('hello', ['hell', 2, true], false, 'from pos 2');
    test('hello', ['hell', 3, true], false, 'from pos 3');
    test('hello', ['hell', 4, true], false, 'from pos 4');
    test('hello', ['hell', 5, true], false, 'from pos 5');
    test('hello', ['hell', 20, true], false, 'from pos 20');
    test('10', [10], true, 'Numbers will be converted');
    test('valley girls\nrock', ['valley girls', 0, true], true, 'valley girls rock starts with valley girls');
    test('valley girls\nrock', ['valley girls r', 0, true], false, 'valley girls rock starts with valley girls r');

  });


  method('endsWith', function() {

    test('HELLO', false, 'undefined produces false');
    test('vader', ['der', 5, true], true, 'vader ends with der');
    test('VADER', ['DER', 5, true], true, 'VADER ends with DER');
    test('VADER', ['der', 5, true], false, 'VADER ends with der');
    test('VADER', ['DER', 5, false], true, 'case insensitive | VADER ends with DER');
    test('vader', [/der/, 5, true], true, 'accepts regex');
    test('vader', [/[q-z]/, 5, true], true, 'accepts regex alternates');
    test('VADER', ['der', 5, false], true, 'case insensitive |  VADER ends with der');
    test('VADER', ['DER', 5, true], true, 'case sensitive | VADER ends with DER');
    test('VADER', ['der', 5, true], false, 'case sensitive |  VADER ends with der');
    test('vader', ['der', -20, true], false, '| from pos -20');
    test('vader', ['der', 0, true], false, '| from pos 0');
    test('vader', ['der', 1, true], false, '| from pos 1');
    test('vader', ['der', 2, true], false, '| from pos 2');
    test('vader', ['der', 3, true], false, '| from pos 3');
    test('vader', ['der', 4, true], false, '| from pos 4');
    test('vader', ['der', 20, true], true, '| from pos 20');
    test('10', [10], true, 'Numbers will be converted');
    test('i aint your\nfather', ['father', 18, true], true, 'vader ends with der');
    test('i aint your\nfather', ['r father', 18, false], false, 'vader ends with der');
  });


  method('repeat', function() {

    equal(String.prototype.repeat.length, 1);

    equal('abc'.repeat(), '');
    equal('abc'.repeat(undefined), '');
    equal('abc'.repeat(null), '');
    equal('abc'.repeat(false), '');
    equal('abc'.repeat(NaN), '');
    equal('abc'.repeat('abc'), '');
    equal('abc'.repeat(-0), '');
    equal('abc'.repeat(+0), '');
    equal('abc'.repeat(1), 'abc');
    equal('abc'.repeat(2), 'abcabc');
    equal('abc'.repeat(3), 'abcabcabc');
    equal('abc'.repeat(4), 'abcabcabcabc');

    raisesError(function() {
      'abc'.repeat(-Infinity);
    }, 'String#repeat | -Infinity throws RangeError', RangeError);
    raisesError(function() {
      'abc'.repeat(-1);
    }, 'String#repeat | -1 throws RangeError', RangeError);
    raisesError(function() {
      'abc'.repeat(+Infinity);
    }, 'String#repeat | +Infinity throws RangeError', RangeError);

    if(allowsNullScope) {
      raisesError(function() {
        String.prototype.repeat.call(undefined);
      }, 'String#repeat | undefined throws error', TypeError);
      raisesError(function() {
        String.prototype.repeat.call(undefined, 4);
      }, 'String#repeat | undefined throws error with 4', TypeError);
      raisesError(function() {
        String.prototype.repeat.call(null);
      }, 'String#repeat | null throws error', TypeError);
      raisesError(function() {
        String.prototype.repeat.call(null, 4);
      }, 'String#repeat | null throws error with 4', TypeError);
      raisesError(function() {
        String.prototype.repeat.apply(undefined);
      }, 'String#repeat | apply | undefined throws error', TypeError);
      raisesError(function() {
        String.prototype.repeat.apply(undefined, [4]);
      }, 'String#repeat | apply | undefined throws error 4', TypeError);
      raisesError(function() {
        String.prototype.repeat.apply(null);
      }, 'String#repeat | apply | null throws error with 4', TypeError);
      raisesError(function() {
        String.prototype.repeat.apply(null, [4]);
      }, 'String#repeat | apply | null throws error with 4', TypeError);
    }

    equal(String.prototype.repeat.call(42, 4), '42424242');
    equal(String.prototype.repeat.call({ 'toString': function() { return 'abc'; } }, 2), 'abcabc');

    equal(String.prototype.repeat.apply(42, [4]), '42424242');
    equal(String.prototype.repeat.apply({ 'toString': function() { return 'abc'; } }, [2]), 'abcabc');
  });

  method('Number.isNaN', function() {

    // Tests from https://github.com/ljharb/is-nan/blob/master/test.js
    equal(Number.isNaN(), false, 'undefined is not NaN');
    equal(Number.isNaN(null), false, 'null is not NaN');
    equal(Number.isNaN(false), false, 'false is not NaN');
    equal(Number.isNaN(true), false, 'true is not NaN');
    equal(Number.isNaN(0), false, 'positive zero is not NaN');
    equal(Number.isNaN(Infinity), false, 'Infinity is not NaN');
    equal(Number.isNaN(-Infinity), false, '-Infinity is not NaN');
    equal(Number.isNaN('foo'), false, 'string is not NaN');
    equal(Number.isNaN([]), false, 'array is not NaN');
    equal(Number.isNaN({}), false, 'object is not NaN');
    equal(Number.isNaN(function () {}), false, 'function is not NaN');
    equal(Number.isNaN('NaN'), false, 'string NaN is not NaN');

    var obj = { valueOf: function () { return NaN; } };
    equal(Number.isNaN(Number(obj)), true, 'object with valueOf of NaN, converted to Number, is NaN');
    equal(Number.isNaN(obj), false, 'object with valueOf of NaN is not NaN');

    equal(Number.isNaN(NaN), true, 'NaN is NaN');

  });
  // End stolen unit tests

});
