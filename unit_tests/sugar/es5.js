
// Passing undefined into .call will always set the scope as the window, so use this when available.
var windowOrUndefined = (typeof window !== 'undefined' ? window : undefined);

test('ECMAScript', function () {

  var arr, count, expected, result;





  // #forEach

  arr = ['a','b','c'];

  raisesError(function(){ arr.forEach(); }, 'Array#forEach | should raise an error when no fn given');

  result = arr.forEach(function(){
     equals(this, windowOrUndefined, 'Array#forEach | scope should be undefined when not passed');
  });
  equals(result, undefined, 'Array#forEach | returns undefined');

  arr[234] = 'd';
  count = 0;
  expected = ['a','b','c','d'];
  arr.forEach(function(el, i, arr){
    arr.push(3)
    equals(el, expected[count], 'Array#forEach | elements should be as expected');
    equals(this, 'wasabi', 'Array#forEach | scope can be passed');
    equals(typeof i, 'number', 'Array#forEach | i must be a number');
    count++;
  }, 'wasabi');

  equals(count, 4, 'Array#forEach | will not visit elements that were added since beginning the loop or visit missing elements');

  arr = ['a'];
  arr[-3] = 'b';


  // This will lock browsers, including native implementations. Sparse array
  // optimizations are NOT in the ECMA spec, it would seem.
  // arr[4294967294] = 'c';


  // This will reset the array in < IE8. Modern browsers will ignore the element.
  // arr[4294967295] = 'd';


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

  // #indexOf

  arr = [1,2,3];
  arr[-2] = 4; // Throw a wrench in the gears by assigning a non-valid array index as object property.

  equals(arr.indexOf(1), 0, 'Array#indexOf | finds 1');
  equals(arr.indexOf(1) === 0, true, 'Array#indexOf | finds 1 and is strictly equal');
  equals(arr.indexOf(4), -1, 'Array#indexOf | does not find 4');
  equals(arr.indexOf('1'), -1, 'Array#indexOf | Uses strict equality');
  equals(arr.indexOf(2, 1), 1, 'Array#indexOf | from index 1');
  equals(arr.indexOf(2, 2), -1, 'Array#indexOf | from index 2');
  equals(arr.indexOf(2, 3), -1, 'Array#indexOf | from index 3');
  equals(arr.indexOf(2, 4), -1, 'Array#indexOf | from index 4');
  equals(arr.indexOf(3, -1), 2, 'Array#indexOf | from index -1');
  equals(arr.indexOf(3, -2), 2, 'Array#indexOf | from index -2');
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

  // Although Infinity appears to be allowable in the ECMA spec, both of these cases
  // would appear to kill all modern browsers.
  // equals(arr.indexOf(1, Infinity), -1, 'Array#indexOf | infinity is valid');  This locks the browser... should it??
  // equals(arr.indexOf(1, -Infinity), 0, 'Array#indexOf | -infinity is valid');


});
