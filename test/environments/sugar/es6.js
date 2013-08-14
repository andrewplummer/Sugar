
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


});
