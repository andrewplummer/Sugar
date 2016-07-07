
namespace('Array', function () {
  'use strict';

  method('isArray', function() {

    equal(Array.isArray.length, 1, 'should have argument length of 1');

    // all following calls return true
    equal(Array.isArray([]), true, 'empty array');
    equal(Array.isArray([1]), true, 'simple array');
    equal(Array.isArray(new Array()), true, 'new array with constructor');

    // Little known fact: Array.prototype is itself an array.
    equal(Array.isArray(Array.prototype), true, 'Array.prototype');

    // all following calls return false
    equal(Array.isArray(), false, 'no param');
    equal(Array.isArray({}), false, 'object');
    equal(Array.isArray(null), false, 'null');
    equal(Array.isArray(undefined), false, 'undefined');
    equal(Array.isArray(17), false, 'number');
    equal(Array.isArray("Array"), false, 'string');
    equal(Array.isArray(true), false, 'true');
    equal(Array.isArray(false), false, 'false');
  });


  method('forEach', function() {
    var arr, count, expected, result;

    equal(Array.prototype.forEach.length, 1, 'should have argument length of 1');

    arr = ['a','b','c'];

    raisesError(function() { [].forEach(); }, 'should raise an error when no fn given');
    result = arr.forEach(function() {
      equal(this, testNullScope, 'scope should be undefined when not passed');
    });
    result = arr.forEach(function() {
      equal(this.toString(), 'wasabi', 'scope can be passed');
    }, 'wasabi');
    equal(result, undefined, 'returns undefined');

    arr[234] = 'd';
    count = 0;
    expected = ['a','b','c','d'];
    arr.forEach(function(el, i, arr) {
      arr.push(3)
      equal(el, expected[count], 'elements should be as expected');
      equal(typeof i, 'number', 'i must be a number');
      count++;
    }, 'wasabi');

    equal(count, 4, 'will not visit elements that were added since beginning the loop or visit missing elements');

    arr = ['a'];
    arr[-3] = 'b';


    // This will lock browsers, including native implementations. Sparse array
    // optimizations are NOT in the ECMA spec, it would seem.
    // arr[4294967294] = 'c';


    arr[256] = 'd';
    count = 0;
    arr.forEach(function(el, i) {
      count++;
    });

    equal(count, 2, 'will only visit elements with valid indexes');
    equal(arr.length, 257, '"numerically greater than the name of every property whose name is an array index"');

    arr.length = 50;
    arr.forEach(function() {
      count++;
    });
    equal(arr[4294967294], undefined, 'setting the length property will delete all elements above that index');

    arr = ['a','b','c'];
    expected = ['a','x'];
    count = 0;
    arr.forEach(function(el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(el, expected[count], 'elements should be as expected');
      count++;
    });
    equal(count, 2, 'elements deleted after the loop begins should not be visited');

    arr = [];
    expected = ['moo'];
    count = 0;
    arr[2] = 'two';
    arr['2'] = 'moo';
    arr.forEach(function(el, i) {
      equal(el, expected[count], 'strings and numbers are both the same for accessing array elements');
      count++;
    });

    equal(count, 1, 'setting array elements with a string is the same as with a number');


    arr = [];
    arr[2] = 'c';
    arr[1] = 'b';
    arr[0] = 'a';

    result = [];
    arr.forEach(function(el) {
      result.push(el);
    });
    equal(result, ['a','b','c'], 'walks array in order');



    count = 0;
    [1,2,3].forEach(function(el) {
      count++;
      return false;
    });
    equal(count, 3, 'returning false will not break the loop');


    count = 0;
    arr = [1,2];
    arr.push(undefined);
    arr.push(3);
    arr.forEach(function(el) {
      count++;
      return false;
    });
    equal(count, 4, 'undefined members are counted');


    arr = [2, 5, 9];
    arr.forEach(function(el, i, a) {
      equal(el, a[i], 'looping successfully');
    });

    var arr = ['a', [1], { foo: 'bar' }, 352];
    count = 0;
    arr.forEach(function(el, i, a) {
        count++;
    });
    equal(count, 4, 'complex array | should have looped 4 times');

    ['a'].forEach(function(el, i, a) {
      equal(el, 'a', 'first parameter is the element');
      equal(i, 0, 'second parameter is the index');
      equal(this.toString(), 'this', 'scope is passed properly');
    }, 'this');

  });


  method('indexOf', function() {
    var arr, fn, reg, obj;

    equal(Array.prototype.indexOf.length, 1, 'should have argument length of 1');

    arr = [1,2,3];
    arr[-2] = 4; // Throw a wrench in the gears by assigning a non-valid array index as object property.

    equal(arr.indexOf(1), 0, 'finds 1');
    equal(arr.indexOf(1) === 0, true, 'finds 1 and is result strictly equal');
    equal(arr.indexOf(4), -1, 'does not find 4');
    equal(arr.indexOf('1'), -1, 'Uses strict equality');
    equal(arr.indexOf(2, 1), 1, 'from index 1');
    equal(arr.indexOf(2, 2), -1, 'from index 2');
    equal(arr.indexOf(2, 3), -1, 'from index 3');
    equal(arr.indexOf(2, 4), -1, 'from index 4');
    equal(arr.indexOf(3, -1), 2, 'from index -1');
    equal(arr.indexOf(3, -2), 2, 'from index -2');
    equal(arr.indexOf(3, -3), 2, 'from index -3');
    equal(arr.indexOf(3, -4), 2, 'from index -4');

    // These tests will by proxy be stress testing the toInteger internal private function.
    equal(arr.indexOf(1, NaN), 0, 'index NaN becomes 0');
    equal(arr.indexOf(1, true), -1, 'index true becomes 1');
    equal(arr.indexOf(1, false), 0, 'index false becomes 0');
    equal(arr.indexOf(1, 0.1), 0, 'index 0.1 becomes 0');
    equal(arr.indexOf(1, 1.1), -1, 'index 1.1 becomes 1');
    equal(arr.indexOf(3, -0.1), 2, 'index -0.1 becomes 0');
    equal(arr.indexOf(3, -1.1), 2, 'index -1.1 becomes -1');
    equal(arr.indexOf(1, 1.7), -1, 'index 1.7 becomes 1');
    equal(arr.indexOf(3, -1.7), 2, 'index -1.7 becomes -1');


    fn  = function() {};
    reg = /arf/;
    obj = { moo: 'cow' };

    equal([fn].indexOf(fn), 0, 'finds function references');
    equal([reg].indexOf(reg), 0, 'finds regex references');
    equal([obj].indexOf(obj), 0, 'finds object references');

    arr = [];
    arr[2] = 'c';
    arr[1] = 'c';
    arr[0] = 'c';

    equal(arr.indexOf('c'), 0, 'walks array in order');
    equal(Array.prototype.indexOf.call('moo', 'o'), 1, 'should work on strings as well');

    arr = ['c'];
    arr[3] = 'a';

    equal(arr.indexOf('c'),  0, 'finds c with no arguments');
    equal(arr.indexOf('a'),  3, 'finds a with no arguments');

    equal(arr.indexOf('c',  1), -1, 'does not find c from offset  1');
    equal(arr.indexOf('c', -1), -1, 'does not find c from offset -1');
    equal(arr.indexOf('c', -3), -1, 'does not find c from offset -3');
    equal(arr.indexOf('c', -4),  0, 'finds c from offset -4');

    equal(arr.indexOf('a',  3),  3, 'finds a from offset 3');
    equal(arr.indexOf('a',  4), -1, 'does not find a from offset 4');
    equal(arr.indexOf('a', -1),  3, 'finds a from offset -1');
    equal(arr.indexOf('a', -4),  3, 'finds a from offset -4');

    equal(['a'].indexOf('a', Infinity), -1, 'Infinity is valid');
    equal(['a'].indexOf('a', -Infinity), 0, '-Infinity is valid');

    equal(['a','b','c'].indexOf('b'), 1, 'b in a,b,c');
    equal(['a','b','c'].indexOf('b', 0), 1, 'b in a,b,c from 0');
    equal(['a','b','c'].indexOf('a'), 0, 'a in a,b,c');
    equal(['a','b','c'].indexOf('f'), -1, 'f in a,b,c');

    equal(['a','b','c','b'].indexOf('b'), 1, 'finds first instance');
    equal(['a','b','c','b'].indexOf('b', 2), 3, 'finds first instance from index');

    equal([5,2,4].indexOf(5), 0, '5 in 5,2,4');
    equal([5,2,4].indexOf(2), 1, '2 in 5,2,4');
    equal([5,2,4].indexOf(4), 2, '4 in 5,2,4');
    equal([5,2,4,4].indexOf(4, 3), 3, '4 in 5,2,4,4 from index 3');

    equal([5,2,4,4].indexOf(4, 10), -1, '4 in 5,2,4,4 from index 10');
    equal([5,2,4,4].indexOf(4, -10), 2, '4 in 5,2,4,4 from index -10');
    equal([5,2,4,4].indexOf(4, -1), 3, '4 in 5,2,4,4 from index -1');

    equal([{ foo: 'bar' }].indexOf({ foo: 'bar' }), -1, 'will not find deep objects (use findIndex)');
    equal([{ foo: 'bar' }].indexOf(function(a) { return a.foo === 'bar'; }), -1, 'will not run against a function (use findIndex)');

    // The two below tests have the potential to lock the browser,
    // so need to make sure that they are never running against native implementations.

    var arr = [];
    arr[Math.pow(2, 32) - 2] = 'a';
    equal(arr.indexOf('a'), Math.pow(2, 32) - 2, 'maximum allowed array index');

    var obj = {};
    obj.length = Math.pow(2, 32);
    obj[obj.length - 1] = 'a';
    equal(Array.prototype.indexOf.call(obj, 'a'), -1, 'past maximum allowed array index');

    equal(['a'].indexOf('a', -5000), 0, 'overshooting with negative index should find');
    equal(['a'].indexOf('a', 5000), -1, 'overshooting with positive index should not find');
    equal(['a'].indexOf('a', 0.5), 0, 'decimal less than index should match');
    equal(['a'].indexOf('a', 1.5), -1, 'decimal greater than index should not match');

    var obj = [];
    obj[7] = 'b';
    obj[6] = 'a';
    obj[4] = 'a';
    obj[3] = 'b';
    obj.length = 9;
    equal(Array.prototype.indexOf.call(obj, 'a'), 4, 'first index should match on sparse-array');

  });


  method('lastIndexOf', function() {
    var arr, fn, reg, obj;

    equal(Array.prototype.lastIndexOf.length, 1, 'should have argument length of 1');

    arr = ['a', 1, 'a'];
    arr[-2] = 'a'; // Throw a wrench in the gears by assigning a non-valid array index as object property.

    equal(arr.lastIndexOf('a'), 2, 'finds a');
    equal(arr.lastIndexOf('a') === 2, true, 'finds a and is result strictly equal');
    equal(arr.lastIndexOf('c'), -1, 'does not find c');
    equal(arr.lastIndexOf('1'), -1, 'Uses strict equality');
    equal(arr.lastIndexOf('a', 1), 0, 'from index 1');
    equal(arr.lastIndexOf('a', 2), 2, 'from index 2');
    equal(arr.lastIndexOf('a', 3), 2, 'from index 3');
    equal(arr.lastIndexOf('a', 4), 2, 'from index 4');
    equal(arr.lastIndexOf('a', 0), 0, 'from index 0');
    equal(arr.lastIndexOf('a', -1), 2, 'from index -1');
    equal(arr.lastIndexOf('a', -2), 0, 'from index -2');
    equal(arr.lastIndexOf('a', -3), 0, 'from index -3');
    equal(arr.lastIndexOf('a', -4), -1, 'from index -4');

    fn  = function() {};
    reg = /arf/;
    obj = { moo: 'cow' };

    equal([fn].lastIndexOf(fn), 0, 'finds function references');
    equal([reg].lastIndexOf(reg), 0, 'finds regex references');
    equal([obj].lastIndexOf(obj), 0, 'finds object references');

    arr = [];
    arr[2] = 'c';
    arr[1] = 'c';
    arr[0] = 'c';

    equal(arr.lastIndexOf('c'), 2, 'walks array in order');
    equal(Array.prototype.lastIndexOf.call('moo', 'o'), 2, 'should work on strings as well');

    arr = ['c'];
    arr[3] = 'a';

    equal(arr.lastIndexOf('c'),      0, 'sparse array with no arguments');

    equal(arr.lastIndexOf('c',  1),  0, 'sparse array with  1 offset finds');
    equal(arr.lastIndexOf('c', -1),  0, 'sparse array with -1 offset finds');
    equal(arr.lastIndexOf('c', -2),  0, 'sparse array with -2 offset finds');
    equal(arr.lastIndexOf('c', -5), -1, 'sparse array with -3 offset does not find');
    equal(arr.lastIndexOf('a',  1), -1, 'sparse array will not find index from offset 1');
    equal(arr.lastIndexOf('a',  3),  3, 'sparse array will find index from offset 3');
    equal(arr.lastIndexOf('a', -1),  3, 'sparse array will find index from offset -1');
    equal(arr.lastIndexOf('a', -2), -1, 'sparse array will not find index from offset -2');



    equal(['a'].lastIndexOf('a', Infinity), 0, 'Infinity is valid');
    equal(['a'].lastIndexOf('a', -Infinity), -1, '-Infinity is valid');

    equal(['a','b','c','d','a','b'].lastIndexOf('b'), 5, 'b');
    equal(['a','b','c','d','a','b'].lastIndexOf('b', 4), 1, 'b from index 4');
    equal(['a','b','c','d','a','b'].lastIndexOf('z'), -1, 'z');

    equal([1,5,6,8,8,2,5,3].lastIndexOf(3), 7, '1,5,6,8,8,2,5,3 | 3');
    equal([1,5,6,8,8,2,5,3].lastIndexOf(3, 0), -1, '1,5,6,8,8,2,5,3 | 3 from index 0');
    equal([1,5,6,8,8,2,5,3].lastIndexOf(8), 4, '1,5,6,8,8,2,5,3 | 8');
    equal([1,5,6,8,8,2,5,3].lastIndexOf(8, 3), 3, '1,5,6,8,8,2,5,3 | 8 from index 3');
    equal([1,5,6,8,8,2,5,3].lastIndexOf(1), 0, '1,5,6,8,8,2,5,3 | 1');
    equal([1,5,6,8,8,2,5,3].lastIndexOf(42), -1, '1,5,6,8,8,2,5,3 | 42');

    equal([2,5,9,2].lastIndexOf(2), 3, '2,5,9,2 | 2');
    equal([2,5,9,2].lastIndexOf(7), -1, '2,5,9,2 | 7');
    equal([2,5,9,2].lastIndexOf(2, 3), 3, '2,5,9,2 | 2 from index 3');
    equal([2,5,9,2].lastIndexOf(2, 2), 0, '2,5,9,2 | 2 from index 2');
    equal([2,5,9,2].lastIndexOf(2, -2), 0, '2,5,9,2 | 2 from index -2');
    equal([2,5,9,2].lastIndexOf(2, -1), 3, '2,5,9,2 | 2 from index -1');
    equal([2,5,9,2].lastIndexOf(2, -10), -1, '2,5,9,2 | 2 from index -10');

    equal([2,5,9,2].lastIndexOf(2, 10), 3, '2,5,9,2 | 2 from index 10');
    equal([{ foo: 'bar' }].lastIndexOf({ foo: 'bar' }), -1, 'will not find deep objects (use findIndex)');
    equal([{ foo: 'bar' }].lastIndexOf(function(a) { return a.foo === 'bar'; }), -1, 'will not run against a function (use findIndex)');

    var arr = [];
    arr[Math.pow(2, 32) - 2] = 'a';
    equal(arr.lastIndexOf('a'), Math.pow(2, 32) - 2, 'maximum allowed array index');

    var obj = {};
    obj.length = Math.pow(2, 32);
    obj[obj.length - 1] = 'a';
    equal(Array.prototype.lastIndexOf.call(obj, 'a'), -1, 'past maximum allowed array index');

    equal(['a'].lastIndexOf('a', -5000),-1, 'overshooting with negative index should not find');
    equal(['a'].lastIndexOf('a',  5000), 0, 'overshooting with positive index should find');
    equal(['a'].lastIndexOf('a', 0.5), 0, 'decimal less than index should not match');
    equal(['a'].lastIndexOf('a', 1.5), 0, 'decimal greater than index should match');

    var obj = {};
    obj[7] = 'b';
    obj[6] = 'a';
    obj[4] = 'a';
    obj[3] = 'b';
    obj.length = 9;
    equal(Array.prototype.lastIndexOf.call(obj, 'a'), 6, 'last index should match on sparse-array');

  });


  method('every', function() {
    var arr, count, expected, result;

    equal(Array.prototype.every.length, 1, 'should have argument length of 1');

    arr = [];
    raisesError(function() { [].every(); }, 'should raise an error when no first param');
    result = arr.every(function() {
      equal(this, testNullScope, 'scope should be undefined when not passed');
    });
    [1].every(function() {
      equal(this.toString(), 'wasabi', 'scope can be passed');
    }, 'wasabi');
    [1].every(function() {
      equal(this.toString(), '', 'scope can be falsy');
    }, '');
    equal([].every(function() { return true; }), true, 'empty arrays will always be true');
    equal([].every(function() { return false; }), true, 'empty arrays will always be true even when false returned');
    equal([1].every(function() { return 1; }), true, '1 coerced to true');
    equal([1].every(function() { return 0; }), false, '0 coerced to false');
    equal([1].every(function() { return 'blah'; }), true, 'non-null string coerced to true');
    equal([1].every(function() { return ''; }), false, 'blank string coerced to false');

    arr = ['c','c','c'];
    count = 0;
    result = arr.every(function(el, i, a) {
      equal(el, 'c', 'first argument is element');
      equal(i, count, 'second argument is index');
      equal(a, arr, 'third argument is the array');
      count++;
      return el == 'c';
    });
    equal(result, true, 'all are c');
    equal(count, 3, 'should have been called 3 times');


    arr = ['a','b','c'];
    count = 0;
    result = arr.every(function(el) {
      count++;
      return el == 'c';
    });
    equal(result, false, 'not all are c');
    equal(count, 1, 'should stop once it can return false');


    arr = [];
    arr[247] = 'a';
    count = 0;
    result = arr.every(function(el) {
      count++;
      return el == 'a';
    });
    equal(result, true, 'sparse arrays should not count missing elements');
    equal(count, 1, 'sparse arrays should have called once only');


    arr = ['a','b','c'];
    expected = ['a','x'];
    count = 0;
    arr.every(function(el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(el, expected[count], 'elements should be as expected');
      count++;
      return true;
    });
    equal(count, 2, 'elements deleted after the loop begins should not be visited');

  });

  method('some', function() {
    var arr, count, expected, result;

    equal(Array.prototype.some.length, 1, 'should have argument length of 1');

    arr = [];
    raisesError(function() { [].some(); }, 'should raise an error when no first param');
    result = arr.some(function() {
      equal(this, testNullScope, 'scope should be undefined when not passed');
    });
    [1].some(function() {
      equal(this.toString(), 'wasabi', 'scope can be passed');
    }, 'wasabi');
    [1].some(function() {
      equal(this.toString(), '', 'scope can be falsy');
    }, '');
    equal([].some(function() { return true; }), false, 'empty arrays will always be false');
    equal([].some(function() { return false; }), false, 'empty arrays will always be false even when false returned');
    equal([1].some(function() { return 1; }), true, '1 coerced to true');
    equal([1].some(function() { return 0; }), false, '0 coerced to false');
    equal([1].some(function() { return 'blah'; }), true, 'non-null string coerced to true');
    equal([1].some(function() { return ''; }), false, 'blank string coerced to false');

    arr = ['c','c','c'];
    count = 0;
    result = arr.some(function(el, i, a) {
      equal(el, 'c', 'first argument is element');
      equal(i, count, 'second argument is index');
      equal(a, arr, 'third argument is the array');
      count++;
      return el == 'c';
    });
    equal(result, true, 'some are c');
    equal(count, 1, 'should stop as soon as it finds an element');


    arr = ['a','b','c'];
    count = 0;
    result = arr.some(function(el) {
      count++;
      return el == 'd';
    });
    equal(result, false, 'none are d');
    equal(count, 3, 'should have been called 3 times');


    arr = [];
    arr[247] = 'a';
    count = 0;
    result = arr.some(function(el) {
      count++;
      return el == 'a';
    });

    equal(result, true, 'sparse arrays should not count missing elements');
    equal(count, 1, 'sparse arrays should have called once only');


    arr = ['a','b','c'];
    expected = ['a','x'];
    count = 0;
    arr.some(function(el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(el, expected[count], 'elements should be as expected');
      count++;
      return false;
    });
    equal(count, 2, 'elements deleted after the loop begins should not be visited');

  });


  method('map', function() {
    var arr, count, expected, result;

    equal(Array.prototype.map.length, 1, 'should have argument length of 1');

    arr = [];
    raisesError(function() { [].map(); }, 'should raise an error when no first param');
    result = arr.map(function() {
      equal(this, testNullScope, 'scope should be undefined when not passed');
    });
    [1].map(function() {
      equal(this.toString(), 'wasabi', 'scope can be passed');
    }, 'wasabi');
    [1].map(function() {
      equal(this.toString(), '', 'scope can be falsy');
    }, '');
    [1].map(function() {
      equal(Number(this), 0, 'scope can be a number');
    }, 0);

    arr = ['c','c','c'];
    count = 0;
    result = arr.map(function(el, i, a) {
      equal(el, 'c', 'first argument is element');
      equal(i, count, 'second argument is index');
      equal(a, arr, 'third argument is the array');
      count++;
      return 'a';
    });
    equal(result, ['a','a','a'], 'mapped to a');
    equal(count, 3, 'should have run 3 times');


    arr = [1,2,3];
    count = 0;
    result = arr.map(function(el) {
      return Math.pow(el, 2);
    });
    equal(result, [1,4,9], 'n^2');


    arr = [];
    arr[247] = 'a';
    count = 0;
    result = arr.map(function(el) {
      count++;
      return 'c';
    });
    equal(result.length, 248, 'resulting array should also be sparse if source was');
    equal(count, 1, 'callback should only have been called once');


    arr = ['a','b','c'];
    expected = ['a','x'];
    count = 0;
    arr.map(function(el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(el, expected[count], 'elements should be as expected');
      count++;
    });
    equal(count, 2, 'elements deleted after the loop begins should not be visited');
  });


  method('filter', function() {
    var arr, count, expected, result;

    equal(Array.prototype.filter.length, 1, 'should have argument length of 1');

    arr = [];
    raisesError(function() { [].filter(); }, 'should raise an error when no first param');
    result = arr.filter(function() {
      equal(this, testNullScope, 'scope should be undefined when not passed');
    });
    [1].filter(function() {
      equal(this.toString(), 'wasabi', 'scope can be passed');
    }, 'wasabi');
    [1].filter(function() {
      equal(this.toString(), '', 'scope can be falsy');
    }, '');
    equal([].filter(function() { return true; }), [], 'empty arrays will always be []');
    equal([].filter(function() { return false; }), [], 'empty arrays will always be [] even when false returned');
    equal([1].filter(function() { return 1; }), [1], '1 coerced to true');
    equal([1].filter(function() { return 0; }), [], '0 coerced to false');
    equal([1].filter(function() { return 'blah'; }), [1], 'non-null string coerced to true');
    equal([1].filter(function() { return ''; }), [], 'blank string coerced to false');

    arr = ['c','c','c'];
    count = 0;
    result = arr.filter(function(el, i, a) {
      equal(el, 'c', 'first argument is element');
      equal(i, count, 'second argument is index');
      equal(a, arr, 'third argument is the array');
      count++;
      return el == 'c';
    });
    equal(result, ['c','c','c'], 'filter are c');
    equal(count, 3, 'should have executed 3 times');


    arr = ['a','b','c'];
    count = 0;
    result = arr.filter(function(el) {
      count++;
      return el == 'b';
    });
    equal(result, ['b'], 'returns [b]');
    equal(count, 3, 'should have been called 3 times');


    arr = [];
    arr[247] = 'a';
    count = 0;
    result = arr.filter(function(el) {
      count++;
      return true;
    });
    equal(result, ['a'], 'sparse arrays should not count missing elements');
    equal(count, 1, 'sparse arrays should have called once only');


    arr = ['a','b','c'];
    expected = ['a','x'];
    count = 0;
    result = arr.filter(function(el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(el, expected[count], 'elements should be as expected');
      count++;
      return true;
    });
    equal(result, ['a','x'], 'modified array should appear as the result');
    equal(count, 2, 'elements deleted after the loop begins should not be visited');
  });

  method('reduce', function() {
    var arr, count, result, previous, current;

    equal(Array.prototype.reduce.length, 1, 'should have argument length of 1');

    arr = [];
    raisesError(function() { [1].reduce(); }, 'should raise an error when no callback provided');
    raisesError(function() { [].reduce(function() {}); }, 'should raise an error on an empty array with no initial value');
    [1].reduce(function() {
      equal(this, testNullScope, 'scope should be undefined');
    }, 1);


    arr = [1,2,3];
    previous = [1,3];
    current = [2,3];
    count = 0;

    result = arr.reduce(function(prev, el, i, o) {
      equal(prev, previous[count], 'first argument is the prev value');
      equal(el, current[count], 'second argument is element');
      equal(i, count + 1, 'third argument is index');
      equal(o, arr, 'fourth argument is the array');
      count++;
      return prev + el;
    });

    equal(result, 6, 'result is correct');
    equal(count, 2, 'should have been called 3 times');


    equal([1].reduce(function() { return 324242; }), 1, 'function is not called and returns 1');

    count = 0;
    [1].reduce(function(prev, current, i) {
      equal(prev, 5, 'prev is equal to the inital value if it is provided');
      equal(current, 1, 'current is equal to the first value in the array if no intial value provided');
      equal(i, 0, 'i is 0 when an initial value is passed');
      count++;
    }, 5);
    equal(count, 1, 'should have been called once');

    arr = ['a','b','c'];
    previous = ['a','ab'];
    current  = ['b','c'];
    count = 0;
    result = arr.reduce(function(prev, el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(prev, previous[count], 'previous should be as expected');
      equal(el, current[count], 'current should be as expected');
      count++;
      return prev + el;
    });
    equal(count, 2, 'elements deleted after the loop begins should not be visited');

    equal([1,2,3].reduce(function(a, n) { return a + n; }, 0), 6, 'can handle initial value of 0');


    equal([0,1,2,3,4].reduce(function(a,b) { return a + b; }), 10, 'a + b');
    equal([[0,1],[2,3],[4,5]].reduce(function(a,b) { return a.concat(b); }, []), [0,1,2,3,4,5], 'concat');
    ['a'].reduce(function(p, c, i, a) {
      equal(p, 'c', 'a | first parameter is the lhs');
      equal(c, 'a', 'a | second parameter is the rhs');
      equal(i, 0, 'a | third parameter is the index');
      equal(a, ['a'], 'a | fourth parameter is the array');
    }, 'c');
    [55,66].reduce(function(p, c, i, a) {
      equal(p, 55, '55,66 | first parameter is the lhs');
      equal(c, 66, '55,66 | second parameter is the rhs');
      equal(i, 1, '55,66 | third parameter is the index');
      equal(a, [55,66], '55,66 | fourth parameter is the array');
    });
    [1].reduce(function(p, c, i, a) {
      // This assertion should never be called.
      equal(true, false, 'one element array with no rhs passed in does not iterate');
    });
    equal([1].reduce(function() {}), 1, '[1] reduces to 1');

  });


  method('reduceRight', function() {
    var arr, count, result, previous, current;

    equal(Array.prototype.reduceRight.length, 1, 'should have argument length of 1');

    arr = [];
    raisesError(function() { [1].reduceRight(); }, 'should raise an error when no callback provided');
    raisesError(function() { [].reduceRight(function() {}); }, 'should raise an error on an empty array with no initial value');
    [1].reduceRight(function() {
      equal(this, testNullScope, 'scope should be undefined');
    }, 1);


    arr = [1,2,3];
    previous = [3,5];
    current = [2,1];
    count = 0;

    result = arr.reduceRight(function(prev, el, i, o) {
      equal(prev, previous[count], 'first argument is the prev value');
      equal(el, current[count], 'second argument is element');
      equal(i, 1 - count, 'third argument is index');
      equal(o, arr, 'fourth argument is the array');
      count++;
      return prev + el;
    });

    equal(result, 6, 'result is correct');
    equal(count, 2, 'should have been called 3 times');


    equal([1].reduceRight(function() { return 324242; }), 1, 'function is not called and returns 1');

    count = 0;
    [1].reduceRight(function(prev, current, i) {
      equal(prev, 5, 'prev is equal to the inital value if it is provided');
      equal(current, 1, 'current is equal to the first value in the array if no intial value provided');
      equal(i, 0, 'i is 0 when an initial value is passed');
      count++;
    }, 5);
    equal(count, 1, 'should have been called once');

    arr = ['a','b','c'];
    previous = ['c','cb'];
    current  = ['b','a'];
    count = 0;
    result = arr.reduceRight(function(prev, el, i) {
      if(i == 0) {
        arr[1] = 'x';
        delete arr[2];
      }
      equal(prev, previous[count], 'previous should be as expected');
      equal(el, current[count], 'current should be as expected');
      count++;
      return prev + el;
    });
    equal(count, 2, 'elements deleted after the loop begins should not be visited');

    equal([1,2,3].reduceRight(function(a, n) { return a + n; }, 0), 6, 'can handle initial value of 0');


    equal([0,1,2,3,4].reduceRight(function(a,b) { return a + b; }), 10, 'a + b');
    equal([[0,1],[2,3],[4,5]].reduceRight(function(a,b) { return a.concat(b); }, []), [4,5,2,3,0,1], 'concat');
    ['a'].reduceRight(function(p, c, i, a) {
      equal(p, 'c', 'a | first parameter is the lhs');
      equal(c, 'a', 'a | second parameter is the rhs');
      equal(i, 0, 'a | third parameter is the index');
      equal(a, ['a'], 'a | fourth parameter is the array');
    }, 'c');
    [55,66].reduceRight(function(p, c, i, a) {
      equal(p, 66, '55,66 | first parameter is the lhs');
      equal(c, 55, '55,66 | second parameter is the rhs');
      equal(i, 0, '55,66 | third parameter is the index');
      equal(a, [55,66], '55,66 | fourth parameter is the array');
    });
    [1].reduceRight(function(p, c, i, a) {
      // This assertion should never be called.
      equal(true, false, 'one element array with no rhs passed in does not iterate');
    });
    equal([1].reduceRight(function() {}), 1, '[1] reduces to 1');

  });


  group('Array Inheritance', function() {
    var count;

    var Soup = function() {};
    Soup.prototype = [1,2,3];

    var x = new Soup();

    count = 0;
    x.every(function() {
      count++;
      return true;
    });
    x.some(function() {
      count++;
    });
    x.map(function() {
      count++;
    });
    x.filter(function() {
      count++;
    });
    x.forEach(function() {
      count++;
    });
    x.reduce(function() {
      count++;
    });
    x.reduceRight(function() {
      count++;
    });

    equal(count, 19, 'array elements in the prototype chain are also properly iterated');
    equal(x.indexOf(2), 1, 'indexOf | array elements in the prototype chain are also properly iterated');
    equal(x.lastIndexOf(2), 1, 'lastIndexOf | array elements in the prototype chain are also properly iterated');
  });

});
