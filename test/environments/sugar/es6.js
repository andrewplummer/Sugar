
test('ES6', function () {

  var arr, result, visited, count;
  var undefinedContextObj = (function(){ return this; }).call(undefined);


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

  equal(Array.prototype.find.length,        1, 'Array#find | should have argument length of 1');
  equal(Array.prototype.findIndex.length,   1, 'Array#findIndex | should have argument length of 1');
  equal(String.prototype.startsWith.length, 1, 'String#startsWith | arg length should be 1');
  equal(String.prototype.endsWith.length,   1, 'String#startsWith | arg length should be 1');

});
