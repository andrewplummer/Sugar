
// Passing undefined into .call will always set the scope as the window, so use this when available.
var windowOrUndefined = (typeof window !== 'undefined' ? window : undefined);

test('ECMAScript', function () {

  var arr, count, expected, result;

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
    count++;
  }, 'wasabi');

  /*
  equals(count, 4, 'Array#forEach | will not visit elements that were added since beginning the loop or visit missing elements');

  arr = ['a'];
  arr[-3] = 'b';
  arr[4294967294] = 'c';
  arr[4294967295] = 'd';
  count = 0;
  arr.forEach(function(){
    count++;
  });

  equals(count, 2, 'Array#forEach | will only visit elements with valid indexes');
  equals(arr.length, 4294967295, 'Array#forEach | "numerically greater than the name of every property whose name is an array index"');
  */

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


});
