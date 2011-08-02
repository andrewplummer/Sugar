
// Passing undefined into .call will always set the scope as the window, so use this when available.
var windowOrUndefined = (typeof window !== 'undefined' ? window : undefined);

test('ECMAScript', function () {

  var arr, count, expected, result, previous, current, fn, reg, obj, Person;




  arr = [];
  arr[4294967295] = 'd';
  // This will reset the array in < IE8. Modern browsers will ignore the element.
  equals(arr.length, 0, 'Array internals will not allow more than a 32bit integer as a key. Anything higher will be ignored');



  // Array.isArray


  // all following calls return true
  equals(Array.isArray([]), true, 'Array.isArray | empty array');
  equals(Array.isArray([1]), true, 'Array.nArray | simple array');
  equals(Array.isArray(new Array()), true, 'Array.nArray | new array with constructor');
  equals(Array.isArray(Array.prototype), true, 'Array.nArray | Array.prototype'); // Little known fact: Array.prototype is itself an array.

  // all following calls return false
  equals(Array.isArray(), false, 'Array.nArray | no param');
  equals(Array.isArray({}), false, 'Array.nArray | object');
  equals(Array.isArray(null), false, 'Array.nArray | null');
  equals(Array.isArray(undefined), false, 'Array.nArray | undefined');
  equals(Array.isArray(17), false, 'Array.nArray | number');
  equals(Array.isArray("Array"), false, 'Array.nArray | string');
  equals(Array.isArray(true), false, 'Array.nArray | true');
  equals(Array.isArray(false), false, 'Array.nArray | false');


  // Array#forEach

  arr = ['a','b','c'];

  raisesError(function(){ [].forEach(); }, 'Array#forEach | should raise an error when no fn given');
  result = arr.forEach(function(){
     equals(this, windowOrUndefined, 'Array#forEach | scope should be undefined when not passed');
  });
  result = arr.forEach(function(){
    equals(this, 'wasabi', 'Array#forEach | scope can be passed');
  }, 'wasabi');
  equals(result, undefined, 'Array#forEach | returns undefined');

  arr[234] = 'd';
  count = 0;
  expected = ['a','b','c','d'];
  arr.forEach(function(el, i, arr){
    arr.push(3)
    equals(el, expected[count], 'Array#forEach | elements should be as expected');
    equals(typeof i, 'number', 'Array#forEach | i must be a number');
    count++;
  }, 'wasabi');

  equals(count, 4, 'Array#forEach | will not visit elements that were added since beginning the loop or visit missing elements');

  arr = ['a'];
  arr[-3] = 'b';


  // This will lock browsers, including native implementations. Sparse array
  // optimizations are NOT in the ECMA spec, it would seem.
  // arr[4294967294] = 'c';


  arr[256] = 'd';
  count = 0;
  arr.forEach(function(el, i){
    count++;
  });

  equals(count, 2, 'Array#forEach | will only visit elements with valid indexes');
  equals(arr.length, 257, 'Array#forEach | "numerically greater than the name of every property whose name is an array index"');

  arr.length = 50;
  arr.forEach(function(){
    count++;
  });
  equals(arr[4294967294], undefined, 'Array#forEach | setting the length property will delete all elements above that index');

  arr = ['a','b','c'];
  expected = ['a','x'];
  count = 0;
  arr.forEach(function(el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(el, expected[count], 'Array#forEach | elements should be as expected');
    count++;
  });
  equals(count, 2, 'Array#forEach | elements deleted after the loop begins should not be visited');

  arr = [];
  expected = ['moo'];
  count = 0;
  arr[2] = 'two';
  arr['2'] = 'moo';
  arr.forEach(function(el, i){
    equals(el, expected[count], 'Array#forEach | strings and numbers are both the same for accessing array elements');
    count++;
  });

  equals(count, 1, 'Array#forEach | setting array elements with a string is the same as with a number');


  arr = [];
  arr[2] = 'c';
  arr[1] = 'b';
  arr[0] = 'a';

  result = [];
  arr.forEach(function(el) {
    result.push(el);
  });
  same(result, ['a','b','c'], 'Array#forEach | walks array in order');


  // Array#indexOf

  arr = [1,2,3];
  arr[-2] = 4; // Throw a wrench in the gears by assigning a non-valid array index as object property.

  equals(arr.indexOf(1), 0, 'Array#indexOf | finds 1');
  equals(arr.indexOf(1) === 0, true, 'Array#indexOf | finds 1 and is result strictly equal');
  equals(arr.indexOf(4), -1, 'Array#indexOf | does not find 4');
  equals(arr.indexOf('1'), -1, 'Array#indexOf | Uses strict equality');
  equals(arr.indexOf(2, 1), 1, 'Array#indexOf | from index 1');
  equals(arr.indexOf(2, 2), -1, 'Array#indexOf | from index 2');
  equals(arr.indexOf(2, 3), -1, 'Array#indexOf | from index 3');
  equals(arr.indexOf(2, 4), -1, 'Array#indexOf | from index 4');
  equals(arr.indexOf(3, -1), 2, 'Array#indexOf | from index -1');
  equals(arr.indexOf(3, -2), 2, 'Array#indexOf | from index -2');
  equals(arr.indexOf(3, -3), 2, 'Array#indexOf | from index -3');
  equals(arr.indexOf(3, -4), 2, 'Array#indexOf | from index -4');

  // These tests will by proxy be stress testing the toInteger internal private function.
  equals(arr.indexOf(1, NaN), 0, 'Array#indexOf | index NaN becomes 0');
  equals(arr.indexOf(1, true), -1, 'Array#indexOf | index true becomes 1');
  equals(arr.indexOf(1, false), 0, 'Array#indexOf | index false becomes 0');
  equals(arr.indexOf(1, 0.1), 0, 'Array#indexOf | index 0.1 becomes 0');
  equals(arr.indexOf(1, 1.1), -1, 'Array#indexOf | index 1.1 becomes 1');
  equals(arr.indexOf(3, -0.1), 2, 'Array#indexOf | index -0.1 becomes 0');
  equals(arr.indexOf(3, -1.1), 2, 'Array#indexOf | index -1.1 becomes -1');
  equals(arr.indexOf(1, 1.7), -1, 'Array#indexOf | index 1.7 becomes 1');
  equals(arr.indexOf(3, -1.7), 2, 'Array#indexOf | index -1.7 becomes -1');


  fn  = function(){};
  reg = /arf/;
  obj = { moo: 'cow' };

  equals([fn].indexOf(fn), 0, 'Array#indexOf | finds function references');
  equals([reg].indexOf(reg), 0, 'Array#indexOf | finds regex references');
  equals([obj].indexOf(obj), 0, 'Array#indexOf | finds object references');

  arr = [];
  arr[2] = 'c';
  arr[1] = 'c';
  arr[0] = 'c';

  equals(arr.indexOf('c'), 0, 'Array#indexOf | walks array in order');
  equals(Array.prototype.indexOf.call('moo', 'o'), 1, 'Array#indexOf | should work on strings as well');



  // Although Infinity appears to be allowable in the ECMA spec, both of these cases
  // would appear to kill all modern browsers.
  // equals(arr.indexOf(1, Infinity), -1, 'Array#indexOf | infinity is valid');  This locks the browser... should it??
  // equals(arr.indexOf(1, -Infinity), 0, 'Array#indexOf | -infinity is valid');


  // Array#lastIndexOf

  arr = ['a', 1, 'a'];
  arr[-2] = 'a'; // Throw a wrench in the gears by assigning a non-valid array index as object property.

  equals(arr.lastIndexOf('a'), 2, 'Array#lastIndexOf | finds a');
  equals(arr.lastIndexOf('a') === 2, true, 'Array#lastIndexOf | finds a and is result strictly equal');
  equals(arr.lastIndexOf('c'), -1, 'Array#lastIndexOf | does not find c');
  equals(arr.lastIndexOf('1'), -1, 'Array#lastIndexOf | Uses strict equality');
  equals(arr.lastIndexOf('a', 1), 0, 'Array#lastIndexOf | from index 1');
  equals(arr.lastIndexOf('a', 2), 2, 'Array#lastIndexOf | from index 2');
  equals(arr.lastIndexOf('a', 3), 2, 'Array#lastIndexOf | from index 3');
  equals(arr.lastIndexOf('a', 4), 2, 'Array#lastIndexOf | from index 4');
  equals(arr.lastIndexOf('a', 0), 0, 'Array#lastIndexOf | from index 0');
  equals(arr.lastIndexOf('a', -1), 2, 'Array#lastIndexOf | from index -1');
  equals(arr.lastIndexOf('a', -2), 0, 'Array#lastIndexOf | from index -2');
  equals(arr.lastIndexOf('a', -3), 0, 'Array#lastIndexOf | from index -3');
  equals(arr.lastIndexOf('a', -4), -1, 'Array#lastIndexOf | from index -4');

  fn  = function(){};
  reg = /arf/;
  obj = { moo: 'cow' };

  equals([fn].lastIndexOf(fn), 0, 'Array#lastIndexOf | finds function references');
  equals([reg].lastIndexOf(reg), 0, 'Array#lastIndexOf | finds regex references');
  equals([obj].lastIndexOf(obj), 0, 'Array#lastIndexOf | finds object references');

  arr = [];
  arr[2] = 'c';
  arr[1] = 'c';
  arr[0] = 'c';

  equals(arr.lastIndexOf('c'), 2, 'Array#lastIndexOf | walks array in order');
  equals(Array.prototype.lastIndexOf.call('moo', 'o'), 2, 'Array#lastIndexOf | should work on strings as well');



  // Array#every

  raisesError(function(){ [].every(); }, 'Array#every | should raise an error when no first param');
  result = arr.every(function(){
     equals(this, windowOrUndefined, 'Array#every | scope should be undefined when not passed');
  });
  [1].every(function(){
    equals(this, 'wasabi', 'Array#every | scope can be passed');
  }, 'wasabi');
  [1].every(function(){
    equals(this, '', 'Array#every | scope can be falsy');
  }, '');
  equals([].every(function(){ return true; }), true, 'Array#every | empty arrays will always be true');
  equals([].every(function(){ return false; }), true, 'Array#every | empty arrays will always be true even when false returned');
  equals([1].every(function(){ return 1; }), true, 'Array#every | 1 coerced to true');
  equals([1].every(function(){ return 0; }), false, 'Array#every | 0 coerced to false');
  equals([1].every(function(){ return 'blah'; }), true, 'Array#every | non-null string coerced to true');
  equals([1].every(function(){ return ''; }), false, 'Array#every | blank string coerced to false');

  arr = ['c','c','c'];
  count = 0;
  result = arr.every(function(el, i, a){
    equals(el, 'c', 'Array#every | first argument is element');
    equals(i, count, 'Array#every | second argument is index');
    same(a, arr, 'Array#every | third argument is the array');
    count++;
    return el == 'c';
  });
  equals(result, true, 'Array#every | all are c');
  equals(count, 3, 'Array#every | should have been called 3 times');


  arr = ['a','b','c'];
  count = 0;
  result = arr.every(function(el){
    count++;
    return el == 'c';
  });
  equals(result, false, 'Array#every | not all are c');
  equals(count, 1, 'Array#every | should stop once it can return false');


  arr = [];
  arr[247] = 'a';
  count = 0;
  result = arr.every(function(el){
    count++;
    return el == 'a';
  });
  equals(result, true, 'Array#every | sparse arrays should not count missing elements');
  equals(count, 1, 'Array#every | sparse arrays should have called once only');


  arr = ['a','b','c'];
  expected = ['a','x'];
  count = 0;
  arr.every(function(el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(el, expected[count], 'Array#every | elements should be as expected');
    count++;
    return true;
  });
  equals(count, 2, 'Array#every | elements deleted after the loop begins should not be visited');





  // Array#some

  raisesError(function(){ [].some(); }, 'Array#some | should raise an error when no first param');
  result = arr.some(function(){
     equals(this, windowOrUndefined, 'Array#some | scope should be undefined when not passed');
  });
  [1].some(function(){
    equals(this, 'wasabi', 'Array#some | scope can be passed');
  }, 'wasabi');
  [1].some(function(){
    equals(this, '', 'Array#some | scope can be falsy');
  }, '');
  equals([].some(function(){ return true; }), false, 'Array#some | empty arrays will always be false');
  equals([].some(function(){ return false; }), false, 'Array#some | empty arrays will always be false even when false returned');
  equals([1].some(function(){ return 1; }), true, 'Array#some | 1 coerced to true');
  equals([1].some(function(){ return 0; }), false, 'Array#some | 0 coerced to false');
  equals([1].some(function(){ return 'blah'; }), true, 'Array#some | non-null string coerced to true');
  equals([1].some(function(){ return ''; }), false, 'Array#some | blank string coerced to false');

  arr = ['c','c','c'];
  count = 0;
  result = arr.some(function(el, i, a){
    equals(el, 'c', 'Array#some | first argument is element');
    equals(i, count, 'Array#some | second argument is index');
    same(a, arr, 'Array#some | third argument is the array');
    count++;
    return el == 'c';
  });
  equals(result, true, 'Array#some | some are c');
  equals(count, 1, 'Array#some | should stop as soon as it finds an element');


  arr = ['a','b','c'];
  count = 0;
  result = arr.some(function(el){
    count++;
    return el == 'd';
  });
  equals(result, false, 'Array#some | none are d');
  equals(count, 3, 'Array#some | should have been called 3 times');


  arr = [];
  arr[247] = 'a';
  count = 0;
  result = arr.some(function(el){
    count++;
    return el == 'a';
  });
  equals(result, true, 'Array#some | sparse arrays should not count missing elements');
  equals(count, 1, 'Array#some | sparse arrays should have called once only');


  arr = ['a','b','c'];
  expected = ['a','x'];
  count = 0;
  arr.some(function(el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(el, expected[count], 'Array#some | elements should be as expected');
    count++;
    return false;
  });
  equals(count, 2, 'Array#some | elements deleted after the loop begins should not be visited');




  // Array#map

  raisesError(function(){ [].map(); }, 'Array#map | should raise an error when no first param');
  result = arr.map(function(){
     equals(this, windowOrUndefined, 'Array#map | scope should be undefined when not passed');
  });
  [1].map(function(){
    equals(this, 'wasabi', 'Array#map | scope can be passed');
  }, 'wasabi');
  [1].map(function(){
    equals(this, '', 'Array#map | scope can be falsy');
  }, '');

  arr = ['c','c','c'];
  count = 0;
  result = arr.map(function(el, i, a){
    equals(el, 'c', 'Array#map | first argument is element');
    equals(i, count, 'Array#map | second argument is index');
    same(a, arr, 'Array#map | third argument is the array');
    count++;
    return 'a';
  });
  same(result, ['a','a','a'], 'Array#map | mapped to a');
  equals(count, 3, 'Array#map | should have run 3 times');


  arr = [1,2,3];
  count = 0;
  result = arr.map(function(el){
    return Math.pow(el, 2);
  });
  same(result, [1,4,9], 'Array#map | n^2');


  arr = [];
  arr[247] = 'a';
  count = 0;
  result = arr.map(function(el){
    count++;
    return 'c';
  });
  same(result.length, 248, 'Array#map | resulting array should also be sparse if source was');
  equals(count, 1, 'Array#map | callback should only have been called once');


  arr = ['a','b','c'];
  expected = ['a','x'];
  count = 0;
  arr.map(function(el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(el, expected[count], 'Array#map | elements should be as expected');
    count++;
  });
  equals(count, 2, 'Array#map | elements deleted after the loop begins should not be visited');





  // Array#filter

  raisesError(function(){ [].filter(); }, 'Array#filter | should raise an error when no first param');
  result = arr.filter(function(){
     equals(this, windowOrUndefined, 'Array#filter | scope should be undefined when not passed');
  });
  [1].filter(function(){
    equals(this, 'wasabi', 'Array#filter | scope can be passed');
  }, 'wasabi');
  [1].filter(function(){
    equals(this, '', 'Array#filter | scope can be falsy');
  }, '');
  same([].filter(function(){ return true; }), [], 'Array#filter | empty arrays will always be []');
  same([].filter(function(){ return false; }), [], 'Array#filter | empty arrays will always be [] even when false returned');
  same([1].filter(function(){ return 1; }), [1], 'Array#filter | 1 coerced to true');
  same([1].filter(function(){ return 0; }), [], 'Array#filter | 0 coerced to false');
  same([1].filter(function(){ return 'blah'; }), [1], 'Array#filter | non-null string coerced to true');
  same([1].filter(function(){ return ''; }), [], 'Array#filter | blank string coerced to false');

  arr = ['c','c','c'];
  count = 0;
  result = arr.filter(function(el, i, a){
    equals(el, 'c', 'Array#filter | first argument is element');
    equals(i, count, 'Array#filter | second argument is index');
    same(a, arr, 'Array#filter | third argument is the array');
    count++;
    return el == 'c';
  });
  same(result, ['c','c','c'], 'Array#filter | filter are c');
  equals(count, 3, 'Array#filter | should have executed 3 times');


  arr = ['a','b','c'];
  count = 0;
  result = arr.filter(function(el){
    count++;
    return el == 'b';
  });
  same(result, ['b'], 'Array#filter | returns [b]');
  equals(count, 3, 'Array#filter | should have been called 3 times');


  arr = [];
  arr[247] = 'a';
  count = 0;
  result = arr.filter(function(el){
    count++;
    return true;
  });
  same(result, ['a'], 'Array#filter | sparse arrays should not count missing elements');
  equals(count, 1, 'Array#filter | sparse arrays should have called once only');


  arr = ['a','b','c'];
  expected = ['a','x'];
  count = 0;
  result = arr.filter(function(el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(el, expected[count], 'Array#filter | elements should be as expected');
    count++;
    return true;
  });
  same(result, ['a','x'], 'Array#filter | modified array should appear as the result');
  equals(count, 2, 'Array#filter | elements deleted after the loop begins should not be visited');


  // Array#reduce

  raisesError(function(){ [1].reduce(); }, 'Array#reduce | should raise an error when no callback provided');
  raisesError(function(){ [].reduce(function(){}); }, 'Array#reduce | should raise an error on an empty array with no initial value');
  [1].reduce(function(){
     equals(this, windowOrUndefined, 'Array#reduce | scope should be undefined');
  }, 1);


  arr = [1,2,3];
  previous = [1,3];
  current = [2,3];
  count = 0;

  result = arr.reduce(function(prev, el, i, o){
    equals(prev, previous[count], 'Array#filter | first argument is the prev value');
    equals(el, current[count], 'Array#filter | second argument is element');
    equals(i, count + 1, 'Array#filter | third argument is index');
    same(o, arr, 'Array#filter | fourth argument is the array');
    count++;
    return prev + el;
  });

  equals(result, 6, 'Array#reduce | result is correct');
  equals(count, 2, 'Array#reduce | should have been called 3 times');


  equals([1].reduce(function(){ return 324242; }), 1, 'Array#reduce | function is not called and returns 1');

  count = 0;
  [1].reduce(function(prev, current, i) {
    equals(prev, 5, 'Array#reduce | prev is equal to the inital value if it is provided');
    equals(current, 1, 'Array#reduce | current is equal to the first value in the array if no intial value provided');
    equals(i, 0, 'Array#reduce | i is 0 when an initial value is passed');
    count++;
  }, 5);
  equals(count, 1, 'Array#reduce | should have been called once');

  arr = ['a','b','c'];
  previous = ['a','ab'];
  current  = ['b','c'];
  count = 0;
  result = arr.reduce(function(prev, el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(prev, previous[count], 'Array#reduce | previous should be as expected');
    equals(el, current[count], 'Array#reduce | current should be as expected');
    count++;
    return prev + el;
  });
  equals(count, 2, 'Array#reduce | elements deleted after the loop begins should not be visited');






  // Array#reduceRight

  raisesError(function(){ [1].reduceRight(); }, 'Array#reduceRight | should raise an error when no callback provided');
  raisesError(function(){ [].reduceRight(function(){}); }, 'Array#reduceRight | should raise an error on an empty array with no initial value');
  [1].reduceRight(function(){
     equals(this, windowOrUndefined, 'Array#reduceRight | scope should be undefined');
  }, 1);


  arr = [1,2,3];
  previous = [3,5];
  current = [2,1];
  count = 0;

  result = arr.reduceRight(function(prev, el, i, o){
    equals(prev, previous[count], 'Array#filter | first argument is the prev value');
    equals(el, current[count], 'Array#filter | second argument is element');
    equals(i, 1 - count, 'Array#filter | third argument is index');
    same(o, arr, 'Array#filter | fourth argument is the array');
    count++;
    return prev + el;
  });

  equals(result, 6, 'Array#reduceRight | result is correct');
  equals(count, 2, 'Array#reduceRight | should have been called 3 times');


  equals([1].reduceRight(function(){ return 324242; }), 1, 'Array#reduceRight | function is not called and returns 1');

  count = 0;
  [1].reduceRight(function(prev, current, i) {
    equals(prev, 5, 'Array#reduceRight | prev is equal to the inital value if it is provided');
    equals(current, 1, 'Array#reduceRight | current is equal to the first value in the array if no intial value provided');
    equals(i, 0, 'Array#reduceRight | i is 0 when an initial value is passed');
    count++;
  }, 5);
  equals(count, 1, 'Array#reduceRight | should have been called once');

  arr = ['a','b','c'];
  previous = ['c','cb'];
  current  = ['b','a'];
  count = 0;
  result = arr.reduceRight(function(prev, el, i){
    if(i == 0) {
      arr[1] = 'x';
      delete arr[2];
    }
    equals(prev, previous[count], 'Array#reduceRight | previous should be as expected');
    equals(el, current[count], 'Array#reduceRight | current should be as expected');
    count++;
    return prev + el;
  });
  equals(count, 2, 'Array#reduceRight | elements deleted after the loop begins should not be visited');





  // String#trim

  var whiteSpace = '\u0009\u000B\u000C\u0020\u00A0\uFEFF\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
  var lineTerminators = '\u000A\u000D\u2028\u2029';

  equals(whiteSpace.trim(), '', 'String#trim | should trim all WhiteSpace characters defined in 7.2 and Unicode "space, separator and Unicode "space, separator""');
  equals(lineTerminators.trim(), '', 'String#trim | should trim all LineTerminator characters defined in 7.3');



  // String#trimLeft (non standard)

  equals(whiteSpace.trimLeft(), '', 'String#trimLeft | should trim all WhiteSpace characters defined in 7.2 and Unicode "space, separator"');
  equals(lineTerminators.trimLeft(), '', 'String#trimLeft | should trim all LineTerminator characters defined in 7.3');



  // String#trimRight (non standard)

  equals(whiteSpace.trimRight(), '', 'String#trimRight | should trim all WhiteSpace characters defined in 7.2 and Unicode "space, separator"');
  equals(lineTerminators.trimRight(), '', 'String#trimRight | should trim all LineTerminator characters defined in 7.3');


  equals(String.prototype.trim.call([1]), '1', 'String#trim | should handle objects as well');





  // Object#keys

  raisesError(function(){ Object.keys(undefined); }, 'Object#keys | raises a TypeError for undefined');
  raisesError(function(){ Object.keys(null); }, 'Object#keys | raises a TypeError for null');
  raisesError(function(){ Object.keys(true); }, 'Object#keys | raises a TypeError for booleans');
  raisesError(function(){ Object.keys(NaN); }, 'Object#keys | raises a TypeError for NaN');
  raisesError(function(){ Object.keys(3); }, 'Object#keys | raises a TypeError for numbers');
  raisesError(function(){ Object.keys('moofa'); }, 'Object#keys | raises a TypeError for strings');

  same(Object.keys({ moo:'bar', broken:'wear' }), ['moo','broken'], 'Object#keys | returns keys of an object');
  same(Object.keys(['a','b','c']), ['0','1','2'], 'Object#keys | returns indexes of an array');
  same(Object.keys(/foobar/), [], 'Object#keys | regexes return a blank array');
  same(Object.keys(new Date), [], 'Object#keys | regexes return a blank array');

  Person = function() {
    this.broken = 'wear';
  };
  Person.prototype = { cat: 'dog' };

  same(Object.keys(new Person), ['broken'], 'Object#keys | will get instance properties but not inherited properties');



  // Date.now

  equalsWithMargin(Date.now(), new Date().getTime(), 5, 'Date#now | basic functionality');


  // Date.parse

  // Returns 807937200000 in time zone GMT-0300, and other values in other
  // timezones, since the argument does not specify a time zone.
  equals(Date.parse("Aug 9, 1995"), new Date(1995, 7, 9).getTime(), 'Date#parse | No timezone');
  // Returns 807926400000 no matter the local time zone.
  equals(Date.parse("Wed, 09 Aug 1995 00:00:00 GMT"), new Date(807926400000).getTime(), 'Date#parse | GMT');
  // Returns 807937200000 in timezone GMT-0300, and other values in other
  // timezones, since there is no time zone specifier in the argument.
  equals(Date.parse("Wed, 09 Aug 1995 00:00:00"), new Date(1995, 7, 9).getTime(), 'Date#parse | No timezone with time');
  equals(Date.parse("Thu, 09 Aug 1995 00:00:00 GMT-0400"), new Date(807926400000).addHours(4).getTime(), 'Date#parse | 1995/7/9 GMT-04:00');
  // Returns 0 no matter the local time zone.
  equals(Date.parse("Thu, 01 Jan 1970 00:00:00 GMT"), 0, 'Date#parse | 1970/1/1 GMT');

  // Note: Avoiding non GMT dates around the epoch as they tend to be unreliable.
  // Returns 14400000 in timezone GMT-0400, and other values in other
  // timezones, since there is no time zone specifier in the argument.
  //equals(Date.parse("Thu, 01 Jan 1970 00:00:00"), (new Date).getTimezoneOffset().minutes(), 'Date#parse | 1970/1/1 Local');
  // Returns 14400000 no matter the local time zone.
  //equals(Date.parse("Thu, 01 Jan 1970 00:00:00 GMT-0400"), new Date(1995, 7, 9).getTime(), 'Date#parse | 1970/1/1 GMT-04:00');

  // Date#toJSON

  // Essentially just an ISO string. Add more tests as needed.
  equals(new Date(2002, 7, 25).toJSON(), new Date(2002, 7, 25).toISOString(), 'Date#toJSON | output');


  // Date#toISOString

  equals(new Date(Date.UTC(2000, 0, 1)).toISOString(), '2000-01-01T00:00:00.000Z', 'Date#toISOString | new millenium!');
  equals(new Date(Date.UTC(1978, 7, 25)).toISOString(), '1978-08-25T00:00:00.000Z', 'Date#toISOString | happy birthday!');
  equals(new Date(Date.UTC(1978, 7, 25, 11, 45, 33, 456)).toISOString(), '1978-08-25T11:45:33.456Z', 'Date#toISOString | with time');

  // Function#bind

  var instance, BoundPerson;

  raisesError(function(){ Function.prototype.bind.call('mooo'); }, 'Function#bind | Raises an error when used on anything un-callable');

  equals((function(){ return this; }).bind('yellow')(), 'yellow', 'Function#bind | basic binding of this arg');
  equals((function(){ return arguments[0]; }).bind('yellow', 'mellow')(), 'mellow', 'Function#bind | currying argument 1');
  equals((function(){ return arguments[1]; }).bind('yellow', 'mellow', 'fellow')(), 'fellow', 'Function#bind | currying argument 2');
  equals((function(){ return this; }).bind(undefined)(), windowOrUndefined, 'Function#bind | passing undefined as the scope');

  (function(a, b){
    equals(this, 'yellow', 'Function#bind | ensure only one call | this object');
    equals(a, 'mellow', 'Function#bind | ensure only one call | argument 1');
    equals(b, 'fellow', 'Function#bind | ensure only one call | argument 2');
  }).bind('yellow', 'mellow', 'fellow')();

  // It seems this functionality can't be achieved in a JS polyfill...
  // equals((function(){}).bind().prototype, undefined, 'Function#bind | currying argument 2'); 

  Person = function(a, b) {
    this.first = a;
    this.second = b;
  };

  BoundPerson = Person.bind({ mellow: 'yellow' }, 'jump');
  instance = new BoundPerson('jumpy');

  equals(instance.mellow, undefined, 'Function#bind | passed scope is ignored when used with the new keyword');
  equals(instance.first, 'jump', 'Function#bind | curried argument makes it to the constructor');
  equals(instance.second, 'jumpy', 'Function#bind | argument passed to the constructor makes it in as the second arg');
  equals(instance instanceof Person, true, 'Function#bind | instance of the class');
  equals(instance instanceof BoundPerson, true, 'Function#bind | instance of the bound class');
  equals(new Person() instanceof BoundPerson, false, 'Function#bind | instance of unbound class is not an instance of the bound class');


});
