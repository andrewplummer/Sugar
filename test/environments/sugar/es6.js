package('ES6', function () {

  // Only true in strict mode
  var allowsNullScope = (function(){ return this; }).call(null) === null;

  var arr, result, visited, count;
  var undefinedContextObj = (function(){ return this; }).call(undefined);

  // Array#find/findIndex
  // Can't rely on length at the moment until I figure out
  // how to turn off this option in the closure compiler.
  equal(Array.prototype.find.length,        1, 'Array#find | should have argument length of 1');
  equal(Array.prototype.findIndex.length,   1, 'Array#findIndex | should have argument length of 1');


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

  equal(visited, ['a','b'], 'Array#find | should not visit undefined indexes');


  arr = ['a'];
  visited = [];
  arr.find(function(el) {
    visited.push(el);
    arr.push('b');
  });

  equal(visited, ['a'], 'Array#find | does not visit elements mutated after being called');


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

  equal(visited, ['a','b'], 'Array#findIndex | should not visit undefined indexes');

  arr = ['a'];
  visited = [];
  arr.findIndex(function(el) {
    visited.push(el);
    arr.push('b');
  });


  equal(visited, ['a'], 'Array#findIndex | does not visit elements mutated after being called');


  // String#startsWith
  // Unit tests egregiously stolen from
  // https://github.com/mathiasbynens/String.prototype.startsWith/blob/master/tests/tests.js

  equal(String.prototype.startsWith.length, 1);

  equal('undefined'.startsWith(), true);
  equal('undefined'.startsWith(undefined), true);
  equal('undefined'.startsWith(null), false);
  equal('null'.startsWith(), false);
  equal('null'.startsWith(undefined), false);
  equal('null'.startsWith(null), true);

  equal('abc'.startsWith(), false);
  equal('abc'.startsWith(''), true);
  equal('abc'.startsWith('\0'), false);
  equal('abc'.startsWith('a'), true);
  equal('abc'.startsWith('b'), false);
  equal('abc'.startsWith('ab'), true);
  equal('abc'.startsWith('bc'), false);
  equal('abc'.startsWith('abc'), true);
  equal('abc'.startsWith('bcd'), false);
  equal('abc'.startsWith('abcd'), false);
  equal('abc'.startsWith('bcde'), false);

  equal('abc'.startsWith('', NaN), true);
  equal('abc'.startsWith('\0', NaN), false);
  equal('abc'.startsWith('a', NaN), true);
  equal('abc'.startsWith('b', NaN), false);
  equal('abc'.startsWith('ab', NaN), true);
  equal('abc'.startsWith('bc', NaN), false);
  equal('abc'.startsWith('abc', NaN), true);
  equal('abc'.startsWith('bcd', NaN), false);
  equal('abc'.startsWith('abcd', NaN), false);
  equal('abc'.startsWith('bcde', NaN), false);

  equal('abc'.startsWith('', false), true);
  equal('abc'.startsWith('\0', false), false);
  equal('abc'.startsWith('a', false), true);
  equal('abc'.startsWith('b', false), false);
  equal('abc'.startsWith('ab', false), true);
  equal('abc'.startsWith('bc', false), false);
  equal('abc'.startsWith('abc', false), true);
  equal('abc'.startsWith('bcd', false), false);
  equal('abc'.startsWith('abcd', false), false);
  equal('abc'.startsWith('bcde', false), false);

  equal('abc'.startsWith('', undefined), true);
  equal('abc'.startsWith('\0', undefined), false);
  equal('abc'.startsWith('a', undefined), true);
  equal('abc'.startsWith('b', undefined), false);
  equal('abc'.startsWith('ab', undefined), true);
  equal('abc'.startsWith('bc', undefined), false);
  equal('abc'.startsWith('abc', undefined), true);
  equal('abc'.startsWith('bcd', undefined), false);
  equal('abc'.startsWith('abcd', undefined), false);
  equal('abc'.startsWith('bcde', undefined), false);

  equal('abc'.startsWith('', null), true);
  equal('abc'.startsWith('\0', null), false);
  equal('abc'.startsWith('a', null), true);
  equal('abc'.startsWith('b', null), false);
  equal('abc'.startsWith('ab', null), true);
  equal('abc'.startsWith('bc', null), false);
  equal('abc'.startsWith('abc', null), true);
  equal('abc'.startsWith('bcd', null), false);
  equal('abc'.startsWith('abcd', null), false);
  equal('abc'.startsWith('bcde', null), false);

  equal('abc'.startsWith('', -Infinity), true);
  equal('abc'.startsWith('\0', -Infinity), false);
  equal('abc'.startsWith('a', -Infinity), true);
  equal('abc'.startsWith('b', -Infinity), false);
  equal('abc'.startsWith('ab', -Infinity), true);
  equal('abc'.startsWith('bc', -Infinity), false);
  equal('abc'.startsWith('abc', -Infinity), true);
  equal('abc'.startsWith('bcd', -Infinity), false);
  equal('abc'.startsWith('abcd', -Infinity), false);
  equal('abc'.startsWith('bcde', -Infinity), false);

  equal('abc'.startsWith('', -1), true);
  equal('abc'.startsWith('\0', -1), false);
  equal('abc'.startsWith('a', -1), true);
  equal('abc'.startsWith('b', -1), false);
  equal('abc'.startsWith('ab', -1), true);
  equal('abc'.startsWith('bc', -1), false);
  equal('abc'.startsWith('abc', -1), true);
  equal('abc'.startsWith('bcd', -1), false);
  equal('abc'.startsWith('abcd', -1), false);
  equal('abc'.startsWith('bcde', -1), false);

  equal('abc'.startsWith('', -0), true);
  equal('abc'.startsWith('\0', -0), false);
  equal('abc'.startsWith('a', -0), true);
  equal('abc'.startsWith('b', -0), false);
  equal('abc'.startsWith('ab', -0), true);
  equal('abc'.startsWith('bc', -0), false);
  equal('abc'.startsWith('abc', -0), true);
  equal('abc'.startsWith('bcd', -0), false);
  equal('abc'.startsWith('abcd', -0), false);
  equal('abc'.startsWith('bcde', -0), false);

  equal('abc'.startsWith('', +0), true);
  equal('abc'.startsWith('\0', +0), false);
  equal('abc'.startsWith('a', +0), true);
  equal('abc'.startsWith('b', +0), false);
  equal('abc'.startsWith('ab', +0), true);
  equal('abc'.startsWith('bc', +0), false);
  equal('abc'.startsWith('abc', +0), true);
  equal('abc'.startsWith('bcd', +0), false);
  equal('abc'.startsWith('abcd', +0), false);
  equal('abc'.startsWith('bcde', +0), false);

  equal('abc'.startsWith('', 1), true);
  equal('abc'.startsWith('\0', 1), false);
  equal('abc'.startsWith('a', 1), false);
  equal('abc'.startsWith('b', 1), true);
  equal('abc'.startsWith('ab', 1), false);
  equal('abc'.startsWith('bc', 1), true);
  equal('abc'.startsWith('abc', 1), false);
  equal('abc'.startsWith('bcd', 1), false);
  equal('abc'.startsWith('abcd', 1), false);
  equal('abc'.startsWith('bcde', 1), false);

  equal('abc'.startsWith('', +Infinity), true);
  equal('abc'.startsWith('\0', +Infinity), false);
  equal('abc'.startsWith('a', +Infinity), false);
  equal('abc'.startsWith('b', +Infinity), false);
  equal('abc'.startsWith('ab', +Infinity), false);
  equal('abc'.startsWith('bc', +Infinity), false);
  equal('abc'.startsWith('abc', +Infinity), false);
  equal('abc'.startsWith('bcd', +Infinity), false);
  equal('abc'.startsWith('abcd', +Infinity), false);
  equal('abc'.startsWith('bcde', +Infinity), false);

  equal('abc'.startsWith('', true), true);
  equal('abc'.startsWith('\0', true), false);
  equal('abc'.startsWith('a', true), false);
  equal('abc'.startsWith('b', true), true);
  equal('abc'.startsWith('ab', true), false);
  equal('abc'.startsWith('bc', true), true);
  equal('abc'.startsWith('abc', true), false);
  equal('abc'.startsWith('bcd', true), false);
  equal('abc'.startsWith('abcd', true), false);
  equal('abc'.startsWith('bcde', true), false);

  equal('abc'.startsWith('', 'x'), true);
  equal('abc'.startsWith('\0', 'x'), false);
  equal('abc'.startsWith('a', 'x'), true);
  equal('abc'.startsWith('b', 'x'), false);
  equal('abc'.startsWith('ab', 'x'), true);
  equal('abc'.startsWith('bc', 'x'), false);
  equal('abc'.startsWith('abc', 'x'), true);
  equal('abc'.startsWith('bcd', 'x'), false);
  equal('abc'.startsWith('abcd', 'x'), false);
  equal('abc'.startsWith('bcde', 'x'), false);

  equal('[a-z]+(bar)?'.startsWith('[a-z]+'), true);
  equal('[a-z]+(bar)?'.startsWith('(bar)?', 6), true);
  // http://mathiasbynens.be/notes/javascript-unicode#poo-test
  var string = 'I\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9';
  equal(string.startsWith(''), true);
  equal(string.startsWith('\xF1t\xEBr'), false);
  equal(string.startsWith('\xF1t\xEBr', 1), true);
  equal(string.startsWith('\xE0liz\xE6'), false);
  equal(string.startsWith('\xE0liz\xE6', 11), true);
  equal(string.startsWith('\xF8n\u2603\uD83D\uDCA9'), false);
  equal(string.startsWith('\xF8n\u2603\uD83D\uDCA9', 18), true);
  equal(string.startsWith('\u2603'), false);
  equal(string.startsWith('\u2603', 20), true);
  equal(string.startsWith('\uD83D\uDCA9'), false);
  equal(string.startsWith('\uD83D\uDCA9', 21), true);

  raisesError(function() {
    '[a-z]+(bar)?'.startsWith(/[a-z]+/);
  }, 'String#startsWith | starting with regex', TypeError);
  raisesError(function() {
    '[a-z]+(bar)?'.startsWith(/(bar)?/);
  }, 'String#startsWith | starting with regex with optional', TypeError);
  raisesError(function() {
    '[a-z]+/(bar)?/'.startsWith(/(bar)?/);
  }, 'String#startsWith | slashes starting with regex', TypeError);

  if(allowsNullScope) {
    raisesError(function() {
      String.prototype.startsWith.call(undefined);
    }, 'String#startsWith | undefined', TypeError);
    raisesError(function() {
      String.prototype.startsWith.call(undefined, 'b');
    }, 'String#startsWith | undefined, b', TypeError);
    raisesError(function() {
      String.prototype.startsWith.call(undefined, 'b', 4);
    }, 'String#startsWith | undefined, b, 4', TypeError);
    raisesError(function() {
      String.prototype.startsWith.call(null);
    }, 'String#startsWith | null', TypeError);
    raisesError(function() {
      String.prototype.startsWith.call(null, 'b');
    }, 'String#startsWith | null, b', TypeError);
    raisesError(function() {
      String.prototype.startsWith.call(null, 'b', 4);
    }, 'String#startsWith | null, b, 4', TypeError);
    raisesError(function() {
      String.prototype.startsWith.apply(undefined);
    }, 'String#startsWith | apply | undefined', TypeError);
    raisesError(function() {
      String.prototype.startsWith.apply(undefined, ['b']);
    }, 'String#startsWith | apply | undefined, b', TypeError);
    raisesError(function() {
      String.prototype.startsWith.apply(undefined, ['b', 4]);
    }, 'String#startsWith | apply | undefined, b, 4', TypeError);
    raisesError(function() {
      String.prototype.startsWith.apply(null);
    }, 'String#startsWith | apply | null', TypeError);
    raisesError(function() {
      String.prototype.startsWith.apply(null, ['b']);
    }, 'String#startsWith | apply | null, b', TypeError);
    raisesError(function() {
      String.prototype.startsWith.apply(null, ['b', 4]);
    }, 'String#startsWith | apply | null, b, 4', TypeError);

  }

  raisesError(function() {
    String.prototype.startsWith.call({ 'toString': function() { throw RangeError(); } }, /./);
  }, 'String#startsWith | object with RangeError on toString', RangeError);
  raisesError(function() {
    String.prototype.startsWith.call({ 'toString': function() { return 'abc'; } }, /./);
  }, 'String#startsWith | object with abc on toString', TypeError);

  raisesError(function() {
    String.prototype.startsWith.apply({ 'toString': function() { throw RangeError(); } }, [/./]);
  }, 'String#startsWith | apply | object with RangeError on toString', RangeError);
  raisesError(function() {
    String.prototype.startsWith.apply({ 'toString': function() { return 'abc'; } }, [/./]);
  }, 'String#startsWith | apply | object with abc on toString', TypeError);

  equal(String.prototype.startsWith.call(42, '2'), false);
  equal(String.prototype.startsWith.call(42, '4'), true);
  equal(String.prototype.startsWith.call(42, 'b', 4), false);
  equal(String.prototype.startsWith.call(42, '2', 1), true);
  equal(String.prototype.startsWith.call(42, '2', 4), false);
  equal(String.prototype.startsWith.call({ 'toString': function() { return 'abc'; } }, 'b', 0), false);
  equal(String.prototype.startsWith.call({ 'toString': function() { return 'abc'; } }, 'b', 1), true);
  equal(String.prototype.startsWith.call({ 'toString': function() { return 'abc'; } }, 'b', 2), false);

  equal(String.prototype.startsWith.apply(42, ['2']), false);
  equal(String.prototype.startsWith.apply(42, ['4']), true);
  equal(String.prototype.startsWith.apply(42, ['b', 4]), false);
  equal(String.prototype.startsWith.apply(42, ['2', 1]), true);
  equal(String.prototype.startsWith.apply(42, ['2', 4]), false);
  equal(String.prototype.startsWith.apply({ 'toString': function() { return 'abc'; } }, ['b', 0]), false);
  equal(String.prototype.startsWith.apply({ 'toString': function() { return 'abc'; } }, ['b', 1]), true);
  equal(String.prototype.startsWith.apply({ 'toString': function() { return 'abc'; } }, ['b', 2]), false);


  // String#endsWith

  equal(String.prototype.endsWith.length, 1);

  equal('undefined'.endsWith(), true);
  equal('undefined'.endsWith(undefined), true);
  equal('undefined'.endsWith(null), false);
  equal('null'.endsWith(), false);
  equal('null'.endsWith(undefined), false);
  equal('null'.endsWith(null), true);

  equal('abc'.endsWith(), false);
  equal('abc'.endsWith(''), true);
  equal('abc'.endsWith('\0'), false);
  equal('abc'.endsWith('c'), true);
  equal('abc'.endsWith('b'), false);
  equal('abc'.endsWith('ab'), false);
  equal('abc'.endsWith('bc'), true);
  equal('abc'.endsWith('abc'), true);
  equal('abc'.endsWith('bcd'), false);
  equal('abc'.endsWith('abcd'), false);
  equal('abc'.endsWith('bcde'), false);

  equal('abc'.endsWith('', NaN), true);
  equal('abc'.endsWith('\0', NaN), false);
  equal('abc'.endsWith('c', NaN), false);
  equal('abc'.endsWith('b', NaN), false);
  equal('abc'.endsWith('a', NaN), false);
  equal('abc'.endsWith('ab', NaN), false);
  equal('abc'.endsWith('bc', NaN), false);
  equal('abc'.endsWith('abc', NaN), false);
  equal('abc'.endsWith('bcd', NaN), false);
  equal('abc'.endsWith('abcd', NaN), false);
  equal('abc'.endsWith('bcde', NaN), false);

  equal('abc'.endsWith('', false), true);
  equal('abc'.endsWith('\0', false), false);
  equal('abc'.endsWith('c', false), false);
  equal('abc'.endsWith('b', false), false);
  equal('abc'.endsWith('a', false), false);
  equal('abc'.endsWith('ab', false), false);
  equal('abc'.endsWith('bc', false), false);
  equal('abc'.endsWith('abc', false), false);
  equal('abc'.endsWith('bcd', false), false);
  equal('abc'.endsWith('abcd', false), false);
  equal('abc'.endsWith('bcde', false), false);

  equal('abc'.endsWith('', undefined), true);
  equal('abc'.endsWith('\0', undefined), false);
  equal('abc'.endsWith('c', undefined), true);
  equal('abc'.endsWith('b', undefined), false);
  equal('abc'.endsWith('a', undefined), false);
  equal('abc'.endsWith('ab', undefined), false);
  equal('abc'.endsWith('bc', undefined), true);
  equal('abc'.endsWith('abc', undefined), true);
  equal('abc'.endsWith('bcd', undefined), false);
  equal('abc'.endsWith('abcd', undefined), false);
  equal('abc'.endsWith('bcde', undefined), false);

  equal('abc'.endsWith('', null), true);
  equal('abc'.endsWith('\0', null), false);
  equal('abc'.endsWith('c', null), false);
  equal('abc'.endsWith('b', null), false);
  equal('abc'.endsWith('a', null), false);
  equal('abc'.endsWith('ab', null), false);
  equal('abc'.endsWith('bc', null), false);
  equal('abc'.endsWith('abc', null), false);
  equal('abc'.endsWith('bcd', null), false);
  equal('abc'.endsWith('abcd', null), false);
  equal('abc'.endsWith('bcde', null), false);

  equal('abc'.endsWith('', -Infinity), true);
  equal('abc'.endsWith('\0', -Infinity), false);
  equal('abc'.endsWith('c', -Infinity), false);
  equal('abc'.endsWith('b', -Infinity), false);
  equal('abc'.endsWith('a', -Infinity), false);
  equal('abc'.endsWith('ab', -Infinity), false);
  equal('abc'.endsWith('bc', -Infinity), false);
  equal('abc'.endsWith('abc', -Infinity), false);
  equal('abc'.endsWith('bcd', -Infinity), false);
  equal('abc'.endsWith('abcd', -Infinity), false);
  equal('abc'.endsWith('bcde', -Infinity), false);

  equal('abc'.endsWith('', -1), true);
  equal('abc'.endsWith('\0', -1), false);
  equal('abc'.endsWith('c', -1), false);
  equal('abc'.endsWith('b', -1), false);
  equal('abc'.endsWith('a', -1), false);
  equal('abc'.endsWith('ab', -1), false);
  equal('abc'.endsWith('bc', -1), false);
  equal('abc'.endsWith('abc', -1), false);
  equal('abc'.endsWith('bcd', -1), false);
  equal('abc'.endsWith('abcd', -1), false);
  equal('abc'.endsWith('bcde', -1), false);

  equal('abc'.endsWith('', -0), true);
  equal('abc'.endsWith('\0', -0), false);
  equal('abc'.endsWith('c', -0), false);
  equal('abc'.endsWith('b', -0), false);
  equal('abc'.endsWith('a', -0), false);
  equal('abc'.endsWith('ab', -0), false);
  equal('abc'.endsWith('bc', -0), false);
  equal('abc'.endsWith('abc', -0), false);
  equal('abc'.endsWith('bcd', -0), false);
  equal('abc'.endsWith('abcd', -0), false);
  equal('abc'.endsWith('bcde', -0), false);

  equal('abc'.endsWith('', +0), true);
  equal('abc'.endsWith('\0', +0), false);
  equal('abc'.endsWith('c', +0), false);
  equal('abc'.endsWith('b', +0), false);
  equal('abc'.endsWith('a', +0), false);
  equal('abc'.endsWith('ab', +0), false);
  equal('abc'.endsWith('bc', +0), false);
  equal('abc'.endsWith('abc', +0), false);
  equal('abc'.endsWith('bcd', +0), false);
  equal('abc'.endsWith('abcd', +0), false);
  equal('abc'.endsWith('bcde', +0), false);

  equal('abc'.endsWith('', 1), true);
  equal('abc'.endsWith('\0', 1), false);
  equal('abc'.endsWith('c', 1), false);
  equal('abc'.endsWith('b', 1), false);
  equal('abc'.endsWith('a', 1), true);
  equal('abc'.endsWith('ab', 1), false);
  equal('abc'.endsWith('bc', 1), false);
  equal('abc'.endsWith('abc', 1), false);
  equal('abc'.endsWith('bcd', 1), false);
  equal('abc'.endsWith('abcd', 1), false);
  equal('abc'.endsWith('bcde', 1), false);

  equal('abc'.endsWith('', 2), true);
  equal('abc'.endsWith('\0', 2), false);
  equal('abc'.endsWith('c', 2), false);
  equal('abc'.endsWith('b', 2), true);
  equal('abc'.endsWith('a', 2), false);
  equal('abc'.endsWith('ab', 2), true);
  equal('abc'.endsWith('bc', 2), false);
  equal('abc'.endsWith('abc', 2), false);
  equal('abc'.endsWith('bcd', 2), false);
  equal('abc'.endsWith('abcd', 2), false);
  equal('abc'.endsWith('bcde', 2), false);

  equal('abc'.endsWith('', +Infinity), true);
  equal('abc'.endsWith('\0', +Infinity), false);
  equal('abc'.endsWith('c', +Infinity), true);
  equal('abc'.endsWith('b', +Infinity), false);
  equal('abc'.endsWith('a', +Infinity), false);
  equal('abc'.endsWith('ab', +Infinity), false);
  equal('abc'.endsWith('bc', +Infinity), true);
  equal('abc'.endsWith('abc', +Infinity), true);
  equal('abc'.endsWith('bcd', +Infinity), false);
  equal('abc'.endsWith('abcd', +Infinity), false);
  equal('abc'.endsWith('bcde', +Infinity), false);

  equal('abc'.endsWith('', true), true);
  equal('abc'.endsWith('\0', true), false);
  equal('abc'.endsWith('c', true), false);
  equal('abc'.endsWith('b', true), false);
  equal('abc'.endsWith('a', true), true);
  equal('abc'.endsWith('ab', true), false);
  equal('abc'.endsWith('bc', true), false);
  equal('abc'.endsWith('abc', true), false);
  equal('abc'.endsWith('bcd', true), false);
  equal('abc'.endsWith('abcd', true), false);
  equal('abc'.endsWith('bcde', true), false);

  equal('abc'.endsWith('', 'x'), true);
  equal('abc'.endsWith('\0', 'x'), false);
  equal('abc'.endsWith('c', 'x'), false);
  equal('abc'.endsWith('b', 'x'), false);
  equal('abc'.endsWith('a', 'x'), false);
  equal('abc'.endsWith('ab', 'x'), false);
  equal('abc'.endsWith('bc', 'x'), false);
  equal('abc'.endsWith('abc', 'x'), false);
  equal('abc'.endsWith('bcd', 'x'), false);
  equal('abc'.endsWith('abcd', 'x'), false);
  equal('abc'.endsWith('bcde', 'x'), false);

  equal('[a-z]+(bar)?'.endsWith('(bar)?'), true);
  equal('[a-z]+(bar)?'.endsWith('[a-z]+', 6), true);

  raisesError(function() {
    '[a-z]+(bar)?'.endsWith(/(bar)?/);
  }, 'String#endsWith | starting with regex', TypeError);
  raisesError(function() {
    '[a-z]+(bar)?'.endsWith(/(bar)?/);
  }, 'String#endsWith | starting with regex with optional', TypeError);
  raisesError(function() {
    '[a-z]+/(bar)?/'.endsWith(/(bar)?/);
  }, 'String#endsWith | slashes starting with regex', TypeError);

  if(allowsNullScope) {
    raisesError(function() {
      String.prototype.endsWith.call(undefined);
    }, 'String#endsWith | undefined', TypeError);
    raisesError(function() {
      String.prototype.endsWith.call(undefined, 'b');
    }, 'String#endsWith | undefined, b', TypeError);
    raisesError(function() {
      String.prototype.endsWith.call(undefined, 'b', 4);
    }, 'String#endsWith | undefined, b, 4', TypeError);
    raisesError(function() {
      String.prototype.endsWith.call(null);
    }, 'String#endsWith | null', TypeError);
    raisesError(function() {
      String.prototype.endsWith.call(null, 'b');
    }, 'String#endsWith | null, b', TypeError);
    raisesError(function() {
      String.prototype.endsWith.call(null, 'b', 4);
    }, 'String#endsWith | null, b, 4', TypeError);
    raisesError(function() {
      String.prototype.endsWith.apply(undefined);
    }, 'String#endsWith | apply | undefined', TypeError);
    raisesError(function() {
      String.prototype.endsWith.apply(undefined, ['b']);
    }, 'String#endsWith | apply | undefined, b', TypeError);
    raisesError(function() {
      String.prototype.endsWith.apply(undefined, ['b', 4]);
    }, 'String#endsWith | apply | undefined, b, 4', TypeError);
    raisesError(function() {
      String.prototype.endsWith.apply(null);
    }, 'String#endsWith | apply | null', TypeError);
    raisesError(function() {
      String.prototype.endsWith.apply(null, ['b']);
    }, 'String#endsWith | apply | null, b', TypeError);
    raisesError(function() {
      String.prototype.endsWith.apply(null, ['b', 4]);
    }, 'String#endsWith | apply | null, b, 4', TypeError);
  }

  raisesError(function() {
    String.prototype.endsWith.call({ 'toString': function() { throw RangeError(); } }, /./);
  }, 'String#endsWith | object with RangeError on toString', RangeError);
  raisesError(function() {
    String.prototype.endsWith.call({ 'toString': function() { return 'abc'; } }, /./);
  }, 'String#endsWith | object with abc on toString', TypeError);

  raisesError(function() {
    String.prototype.endsWith.apply({ 'toString': function() { throw RangeError(); } }, [/./]);
  }, 'String#endsWith | apply | object with RangeError on toString', RangeError);
  raisesError(function() {
    String.prototype.endsWith.apply({ 'toString': function() { return 'abc'; } }, [/./]);
  }, 'String#endsWith | apply | object with abc on toString', TypeError);

  // http://mathiasbynens.be/notes/javascript-unicode#poo-test
  var string = 'I\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9';
  equal(string.endsWith(''), true);
  equal(string.endsWith('\xF1t\xEBr'), false);
  equal(string.endsWith('\xF1t\xEBr', 5), true);
  equal(string.endsWith('\xE0liz\xE6'), false);
  equal(string.endsWith('\xE0liz\xE6', 16), true);
  equal(string.endsWith('\xF8n\u2603\uD83D\uDCA9'), true);
  equal(string.endsWith('\xF8n\u2603\uD83D\uDCA9', 23), true);
  equal(string.endsWith('\u2603'), false);
  equal(string.endsWith('\u2603', 21), true);
  equal(string.endsWith('\uD83D\uDCA9'), true);
  equal(string.endsWith('\uD83D\uDCA9', 23), true);

  equal(String.prototype.endsWith.call(42, '2'), true);
  equal(String.prototype.endsWith.call(42, '4'), false);
  equal(String.prototype.endsWith.call(42, 'b', 4), false);
  equal(String.prototype.endsWith.call(42, '2', 1), false);
  equal(String.prototype.endsWith.call(42, '2', 4), true);
  equal(String.prototype.endsWith.call({ 'toString': function() { return 'abc'; } }, 'b', 0), false);
  equal(String.prototype.endsWith.call({ 'toString': function() { return 'abc'; } }, 'b', 1), false);
  equal(String.prototype.endsWith.call({ 'toString': function() { return 'abc'; } }, 'b', 2), true);
  equal(String.prototype.endsWith.apply(42, ['2']), true);
  equal(String.prototype.endsWith.apply(42, ['4']), false);
  equal(String.prototype.endsWith.apply(42, ['b', 4]), false);
  equal(String.prototype.endsWith.apply(42, ['2', 1]), false);
  equal(String.prototype.endsWith.apply(42, ['2', 4]), true);
  equal(String.prototype.endsWith.apply({ 'toString': function() { return 'abc'; } }, ['b', 0]), false);
  equal(String.prototype.endsWith.apply({ 'toString': function() { return 'abc'; } }, ['b', 1]), false);
  equal(String.prototype.endsWith.apply({ 'toString': function() { return 'abc'; } }, ['b', 2]), true);


  // String#repeat

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

  // String#contains

  equal(String.prototype.contains.length, 1);

  equal('abc'.contains(), false);
  equal('aundefinedb'.contains(), true);
  equal('abc'.contains(undefined), false);
  equal('aundefinedb'.contains(undefined), true);
  equal('abc'.contains(null), false);
  equal('anullb'.contains(null), true);
  equal('abc'.contains(false), false);
  equal('afalseb'.contains(false), true);
  equal('abc'.contains(NaN), false);
  equal('aNaNb'.contains(NaN), true);
  equal('abc'.contains('abc'), true);
  equal('abc'.contains('def'), false);
  equal('abc'.contains(''), true);
  equal(''.contains(''), true);

  equal('abc'.contains('b', -Infinity), true);
  equal('abc'.contains('b', -1), true);
  equal('abc'.contains('b', -0), true);
  equal('abc'.contains('b', +0), true);
  equal('abc'.contains('b', NaN), true);
  equal('abc'.contains('b', 'x'), true);
  equal('abc'.contains('b', false), true);
  equal('abc'.contains('b', undefined), true);
  equal('abc'.contains('b', null), true);
  equal('abc'.contains('b', 1), true);
  equal('abc'.contains('b', 2), false);
  equal('abc'.contains('b', 3), false);
  equal('abc'.contains('b', 4), false);
  equal('abc'.contains('b', +Infinity), false);
  equal('abc'.contains('bc'), true);
  equal('abc'.contains('bc\0'), false);

  equal('abc123def'.contains(1, -Infinity), true);
  equal('abc123def'.contains(1, -1), true);
  equal('abc123def'.contains(1, -0), true);
  equal('abc123def'.contains(1, +0), true);
  equal('abc123def'.contains(1, NaN), true);
  equal('abc123def'.contains(1, 'x'), true);
  equal('abc123def'.contains(1, false), true);
  equal('abc123def'.contains(1, undefined), true);
  equal('abc123def'.contains(1, null), true);
  equal('abc123def'.contains(1, 1), true);
  equal('abc123def'.contains(1, 2), true);
  equal('abc123def'.contains(1, 3), true);
  equal('abc123def'.contains(1, 4), false);
  equal('abc123def'.contains(1, 5), false);
  equal('abc123def'.contains(1, +Infinity), false);

  equal('abc123def'.contains(9, -Infinity), false);
  equal('abc123def'.contains(9, -1), false);
  equal('abc123def'.contains(9, -0), false);
  equal('abc123def'.contains(9, +0), false);
  equal('abc123def'.contains(9, NaN), false);
  equal('abc123def'.contains(9, 'x'), false);
  equal('abc123def'.contains(9, false), false);
  equal('abc123def'.contains(9, undefined), false);
  equal('abc123def'.contains(9, null), false);
  equal('abc123def'.contains(9, 1), false);
  equal('abc123def'.contains(9, 2), false);
  equal('abc123def'.contains(9, 3), false);
  equal('abc123def'.contains(9, 4), false);
  equal('abc123def'.contains(9, 5), false);
  equal('abc123def'.contains(9, +Infinity), false);

  equal('foo[a-z]+(bar)?'.contains('[a-z]+'), true);
  equal('foo[a-z]+(bar)?'.contains(/[a-z]+/), false);
  equal('foo/[a-z]+/(bar)?'.contains(/[a-z]+/), true);
  equal('foo[a-z]+(bar)?'.contains('(bar)?'), true);
  equal('foo[a-z]+(bar)?'.contains(/(bar)?/), false);
  equal('foo[a-z]+/(bar)?/'.contains(/(bar)?/), true);

  // http://mathiasbynens.be/notes/javascript-unicode#poo-test
  var string = 'I\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9';
  equal(string.contains(''), true);
  equal(string.contains('\xF1t\xEBr'), true);
  equal(string.contains('\xE0liz\xE6'), true);
  equal(string.contains('\xF8n\u2603\uD83D\uDCA9'), true);
  equal(string.contains('\u2603'), true);
  equal(string.contains('\uD83D\uDCA9'), true);

  if(allowsNullScope) {
    raisesError(function() { String.prototype.contains.call(undefined); }, TypeError);
    raisesError(function() { String.prototype.contains.call(undefined, 'b'); }, TypeError);
    raisesError(function() { String.prototype.contains.call(undefined, 'b', 4); }, TypeError);
    raisesError(function() { String.prototype.contains.call(null); }, TypeError);
    raisesError(function() { String.prototype.contains.call(null, 'b'); }, TypeError);
    raisesError(function() { String.prototype.contains.call(null, 'b', 4); }, TypeError);
    raisesError(function() { String.prototype.contains.apply(undefined); }, TypeError);
    raisesError(function() { String.prototype.contains.apply(undefined, ['b']); }, TypeError);
    raisesError(function() { String.prototype.contains.apply(undefined, ['b', 4]); }, TypeError);
    raisesError(function() { String.prototype.contains.apply(null); }, TypeError);
    raisesError(function() { String.prototype.contains.apply(null, ['b']); }, TypeError);
    raisesError(function() { String.prototype.contains.apply(null, ['b', 4]); }, TypeError);
  }
  equal(String.prototype.contains.call(42, '2'), true);
  equal(String.prototype.contains.call(42, 'b', 4), false);
  equal(String.prototype.contains.call(42, '2', 4), false);
  equal(String.prototype.contains.call({ 'toString': function() { return 'abc'; } }, 'b', 0), true);
  equal(String.prototype.contains.call({ 'toString': function() { return 'abc'; } }, 'b', 1), true);
  equal(String.prototype.contains.call({ 'toString': function() { return 'abc'; } }, 'b', 2), false);

  equal(String.prototype.contains.apply(42, ['2']), true);
  equal(String.prototype.contains.apply(42, ['b', 4]), false);
  equal(String.prototype.contains.apply(42, ['2', 4]), false);
  equal(String.prototype.contains.apply({ 'toString': function() { return 'abc'; } }, ['b', 0]), true);
  equal(String.prototype.contains.apply({ 'toString': function() { return 'abc'; } }, ['b', 1]), true);
  equal(String.prototype.contains.apply({ 'toString': function() { return 'abc'; } }, ['b', 2]), false);

  // Number.isNaN
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

  // End stolen unit tests

});
