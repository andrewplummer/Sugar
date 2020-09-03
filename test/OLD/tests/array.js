namespace('Array', function () {
  'use strict';

  group('Chainable', function() {
    var arr = [1,2,3];
    var arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };
    var args = (function() { return arguments; })('a','b','c');
    var Soup = function() {}; Soup.prototype = [1,2,3]; var inst = new Soup();

    equal(new Sugar.Array(arr).raw === arr, true, 'should simply wrap an existing array');
    equal(new Sugar.Array(inst).raw === inst, true, 'should simply wrap an inherited array');

    equal(new Sugar.Array().raw, [], 'no argument produces empty array');
    equal(new Sugar.Array(undefined).raw, [], 'undefined is the same as no argument');
    equal(new Sugar.Array(8).raw, [8], 'non-object argument wraps in array');
    equal(new Sugar.Array('abc').raw, ['a','b','c'], 'string is split into array');
    equal(new Sugar.Array(null).raw, [null], 'null is wrapped');
    equal(new Sugar.Array(arrayLike).raw, [1,2,3], 'accepts array-likes');
    equal(new Sugar.Array(args).raw, ['a','b','c'], 'works on arguments object');
  });

  method('create', function() {
    var arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 }
    var args = (function() { return arguments; })('a','b','c');
    var Soup = function() {}; Soup.prototype = [1,2,3]; var inst = new Soup();

    var arr = [1,2,3];
    equal(run(Array, 'create', [arr]) === arr, true, 'should return a reference by default');

    var arr = [1,2,3];
    equal(run(Array, 'create', [arr, true]) === arr, false, 'should clone the array with argument');

    equal(run(Array, 'create', [inst]) === inst, true, 'should return reference to inherited');
    test(Array, [], 'no argument produces empty array');
    test(Array, [undefined], [], 'undefined is the same as no argument');
    test(Array, [8], [8], 'non-object argument wraps in array');
    test(Array, ['abc'], ['a','b','c'], 'string is split into array');
    test(Array, [null], [null], 'null is wrapped');
    test(Array, [arrayLike], [1,2,3], 'accepts array-likes');
    test(Array, [args], ['a','b','c'], 'works on arguments object');
  });

  method('construct', function() {

    function square(i) {
      return i * i;
    }
    test(Array, [3, square], [0,1,4], 'basic array construction');
    test(Array, ['3', square], [0,1,4], 'numeric string creates the array');

    test(Array, [3], safeArray(undefined, undefined, undefined), 'no function becomes all undefined');
    test(Array, [0], [], '0 constructs an empty array');
    test(Array, [null], [], 'null constructs an empty array');
    test(Array, [3, parseInt], [0,1,2], 'works with parseInt');
    test(Array, [], [], 'no arguments is an empty array');
    test(Array, [NaN], [], 'NaN is an empty array');
    test(Array, [undefined], [], 'NaN is an empty array');
    test(Array, ['foo'], [], 'non-numeric string is empty array');

  });

  method('isEqual', function() {

    test(['a'], [['a']], true, 'basic 1 element array');
    test(['a'], [['b']], false, 'basic 1 element array | inequal');
    test(['a','b','c'], [['a','b','c']], true, '3 element array');
    test(['a','b','c'], [['a','b','d']], false, '3 element array | inequal');

    test(['a','b'], [{0:'a',1:'b',length:2}], false, 'object with length is not egal with array');

    test([0], [[0]], true, 'arrays of numbers are equal');
    test([undefined], [[undefined]], true, 'arrays of undefined are equal');
    test([null], [[null]], true, 'arrays of null are equal');
    test([NaN], [[NaN]], true, 'arrays of NaN are equal');
    test(testGetSparseArray(4, 'a'), [testGetSparseArray(4, 'a')], true, 'sparse arrays are equal');

    test([], [[]], true, 'empty arrays are equal');
    test([], [{}], false, 'empty array is not equal to empty object');

    var args = (function(){ return arguments; })('a','b','c');
    test(['a','b','c'], [args], false, 'array is not egal with arguments object');

    var user1 = { name: 'Larry' };
    var user2 = { name: 'David' };

    test([user1, user2], [[user1, user2]], true, 'array of objects is equal');
    test([user1, user2], [[user2, user1]], false, 'array of objects is not equal if not in the same order');
    test([user1, user2], [[user1]], false, 'array of objects 2:1');
    test([user1], [[user1, user2]], false, 'array of objects 1:2');
  });

  method('add', function() {

    test([], [], [], 'nothing');
    test([1], [[2]], [1,2], '[1] + [2]');
    test([], [[1]], [1], '[] + [1]');

    test(['a','b','d'], ['c', 2], ['a','b','c','d'], 'nothing');

    test(oneUndefined, [oneUndefined], twoUndefined, 'undefined + undefined');
    test(oneUndefined, [twoUndefined], threeUndefined, 'undefined + 2undefined');

    var arr = [1,2,3];
    var result = run(arr, 'add', [[4,5,6]]);
    equal(result, [1,2,3,4,5,6], 'array should have been added');
    equal(arr, [1,2,3], 'original array should be untouched');

    var arr1 = []; arr1[5]  = 'a';
    var arr2 = []; arr1[10] = 'b';
    var expected = []; expected[5] = 'a'; expected[10] = 'b';
    var result = run(arr1, 'add', [arr2]);
    equal(result, expected, 'should work on sparse arrays');
    equal(result.length, 11, 'sparse result length should be 11');

  });

  method('subtract', function() {

    test([1,2,3], [[3,4,5]], [1,2], '[1,2,3] - [3,4,5]');
    test([1,1,2,2,3,3,4,4,5,5], [[2,3,4]], [1,1,5,5], '[1,1,2,2,3,3,4,4,5,5] - [2,3,4]');
    test(['a','b','c'], [['c','d','e']], ['a','b'], '[a,b,c] - [c,d,e]');
    test([1,2,3], [[1,2,3]], [], '[1,2,3] - [1,2,3]');
    test([1,2,3], [[3,2,1]], [], '[1,2,3] - [3,2,1]');
    test([], [[3]], [], '[] - [3]');
    test([3], [[]], [3], '[3] - []');
    test([], [[]], [], '[] - []');
    test([null], [[]], [null], '[null] - []');
    test([null], [[null]], [], '[null] - [null]');
    test([false], [[false]], [], '[false] - [false]');
    test([false], [[0]], [false], '[false] - [0]');
    test([false], [[null]], [false], '[false] - [null]');
    test([false], nestedUndefined, [false], '[false] - [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1}], '[a:1,b:2] - [b:2,c:3]');
    test([1,1,3], [[1,5,6]], [3], '[1,1,3] - [1,5,6]');
    test([1,2,3], [[4,5,6]], [1,2,3], '[1,2,3] - [4,5,6]');
    test([1,2,3], [[2]], [1,3], '[1,2,3] - [2]');
    test([1,2,3], [2], [1,3], '[1,2,3] - 2');
    test(safeArray(undefined), [undefined], [], '[undefined] - undefined');

    test([0,1,2,3], [undefined], [0,1,2,3], '[0,1,2,3] - undefined');
    test([0,1,2,3], [null], [0,1,2,3], '[0,1,2,3] - null');
    test([0,1,2,3], [{0:0}], [0,1,2,3], '[0,1,2,3] - {0:0}');

    var arr = [1,2,3];
    run(arr, 'subtract', [[3]]);
    equal(arr, [1,2,3], 'is non-destructive');

    var s1 = testGetSparseArray(3, 'a','b');
    var s2 = testGetSparseArray(3, 'c','b');
    test(s1, [s2], ['a'], 'works on sparse arrays');

    var yFunc = function () { return 'y'; }
    var xFunc = function () { return 'x'; }

    test([xFunc], [[]], [xFunc], 'functions with different content | [x] - []');
    test([yFunc], [[]], [yFunc], 'functions with different content | [y] - []');
    test([], [[xFunc]], [], 'functions with different content | [] - [x]');
    test([], [[yFunc]], [], 'functions with different content | [] - [y]');
    test([], [[xFunc, yFunc]], [], 'functions with different content | [] - [x,y]');
    test([xFunc], [[xFunc]], [], 'functions with different content | [x] - [x]');
    test([xFunc], [[yFunc]], [xFunc], 'functions with different content | [x] - [y]');
    test([xFunc], [[xFunc, yFunc]], [], 'functions with different content | [x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [], 'functions with different content | [x,x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [], 'functions with different content | [x,x] - [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [], 'functions with different content | [x,y] - [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [], 'functions with different content | [x,y] - [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [xFunc], 'functions with different content | [x,y] - [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [], 'functions with different content | [y,x] - [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [], 'functions with different content | [y,x] - [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [yFunc], 'functions with different content | [y,x] - [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [xFunc,xFunc], 'functions with different content | [x,x] - [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [yFunc,yFunc], 'functions with different content | [y,y] - [x,x]');

    var xFunc = function() {};
    var yFunc = function() {};

    test([xFunc], [[]], [xFunc], 'functions with identical content | [x] - []');
    test([yFunc], [[]], [yFunc], 'functions with identical content | [y] - []');
    test([], [[xFunc]], [], 'functions with identical content | [] - [x]');
    test([], [[yFunc]], [], 'functions with identical content | [] - [y]');
    test([], [[xFunc, yFunc]], [], 'functions with identical content | [] - [x,y]');
    test([xFunc], [[xFunc]], [], 'functions with identical content | [x] - [x]');
    test([xFunc], [[yFunc]], [xFunc], 'functions with identical content | [x] - [y]');
    test([xFunc], [[xFunc, yFunc]], [], 'functions with identical content | [x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [], 'functions with identical content | [x,x] - [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [], 'functions with identical content | [x,x] - [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [], 'functions with identical content | [x,y] - [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [], 'functions with identical content | [x,y] - [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [xFunc], 'functions with identical content | [x,y] - [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [], 'functions with identical content | [y,x] - [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [], 'functions with identical content | [y,x] - [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [yFunc], 'functions with identical content | [y,x] - [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [xFunc,xFunc], 'functions with identical content | [x,x] - [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [yFunc,yFunc], 'functions with identical content | [y,y] - [x,x]');

    equal(run([function(){ return 'a' }, function() { return 'b'; }], 'subtract', [[function() { return 'a'; }]]).length, 2, 'functions are always unique');
    test([xFunc, yFunc], [[xFunc]], [yFunc], 'function references are ===');

  });

  method('append', function() {

    test([1,2,3], [4], [1,2,3,4], '[1,2,3] + 4');
    test(['a','b','c'], ['d'], ['a','b','c','d'], '[a,b,c] + d');
    test([{a:1},{a:2}], [{a:3}], [{a:1},{a:2},{a:3}], '[a:1,a:2] + a:3');
    test([1,2,3], [[3,4,5]], [1,2,3,3,4,5], '[1,2,3] + [3,4,5]');
    test(['a','b','c'], [['c','d','e']], ['a','b','c','c','d','e'], '[a,b,c] + [c,d,e]');
    test([1,2,3], [[1,2,3]], [1,2,3,1,2,3], '[1,2,3] + [1,2,3]');
    test([1,2,3], [[3,2,1]], [1,2,3,3,2,1], '[1,2,3] + [3,2,1]');
    test([], [[3]], [3], '[] + [3]');
    test([3], [[]], [3], '[3] + []');
    test([], [[]], [], '[] + []');
    test([null], [[]], [null], '[null] + []');
    test([null], [[null]], [null, null], '[null] + [null]');
    test([false], [[false]], [false, false], '[false] + [false]');
    test([false], [[0]], [false, 0], '[false] + [0]');
    test([false], [[null]], [false, null], '[false] + [null]');
    test([false], nestedUndefined, safeArray(false, undefined), '[false] + [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{b:2},{c:3}], '[a:1,b:2] + [b:2,c:3]');
    test([1,1,3], [[1,5,6]], [1,1,3,1,5,6], '[1,1,3] + [1,5,6]');
    test([1,2,3], [[4,5,6]], [1,2,3,4,5,6], '[1,2,3] + [4,5,6]');
    test([1,2,3], [1], [1,2,3,1], '[1,2,3] + [1]');

    test(['c','d'], [['a','b'], 0], ['a','b','c','d'], 'can effectively prepend');

    test([1,2,3], [4, 1], [1,4,2,3], 'index 1 | 4');
    test(['a','b','c'], ['d', 1], ['a','d','b','c'], 'index 1 | d');
    test([{a:1},{a:2}], [{a:3}, 1], [{a:1},{a:3},{a:2}], 'index 1 | a:3');
    test([1,2,3], [4, 2], [1,2,4,3], 'index 2 | 4');
    test(['a','b','c'], ['d', 2], ['a','b','d','c'], 'index 2 | d');
    test([{a:1},{a:2}], [{a:3}, 2], [{a:1},{a:2},{a:3}], 'index 2 | a:3');

    test(['a','b','c'], ['d', 0], ['d','a','b','c'], 'index 0 | d');
    test(['a','b','c'], ['d', 5], ['a','b','c','d'], 'index 5 | d');
    test(['a','b','c'], ['d', -1], ['a','b','d','c'], 'index -1 | d');
    test(['a','b','c'], ['d', -2], ['a','d','b','c'], 'index -2 | d');
    test(['a','b','c'], ['d', -3], ['d','a','b','c'], 'index -3 | d');
    test(['a','b','c'], ['d', -4], ['d','a','b','c'], 'index -4 | d');
    test(['a','b','c'], ['d', null], ['d','a','b','c'], 'null index | d');
    test(['a','b','c'], safeArray('d', undefined), ['a','b','c','d'], 'undefined index | d');
    test(['a','b','c'], ['d', 'a'], ['a','b','c','d'], 'index a | d');
    test(['a','b','c'], ['d', NaN], ['a','b','c','d'], 'index NaN | d');
    test(['a','b','c'], ['d', '0'], ['d','a','b','c'], "index '0' | d");

    var arr = [1,2,3];
    run(arr, 'append', [4]);
    equal(arr, [1,2,3,4], 'should affect the original array');

  });

  method('insert', function() {

    test([1,2,3], [4], [1,2,3,4], '[1,2,3] + 4');
    test(['a','b','c'], ['d'], ['a','b','c','d'], '[a,b,c] + d');
    test([{a:1},{a:2}], [{a:3}], [{a:1},{a:2},{a:3}], '[a:1,a:2] + a:3');
    test([1,2,3], [[3,4,5]], [1,2,3,3,4,5], '[1,2,3] + [3,4,5]');
    test(['a','b','c'], [['c','d','e']], ['a','b','c','c','d','e'], '[a,b,c] + [c,d,e]');
    test([1,2,3], [[1,2,3]], [1,2,3,1,2,3], '[1,2,3] + [1,2,3]');
    test([1,2,3], [[3,2,1]], [1,2,3,3,2,1], '[1,2,3] + [3,2,1]');
    test([], [[3]], [3], '[] + [3]');
    test([3], [[]], [3], '[3] + []');
    test([], [[]], [], '[] + []');
    test([null], [[]], [null], '[null] + []');
    test([null], [[null]], [null, null], '[null] + [null]');
    test([false], [[false]], [false, false], '[false] + [false]');
    test([false], [[0]], [false, 0], '[false] + [0]');
    test([false], [[null]], [false, null], '[false] + [null]');
    test([false], nestedUndefined, safeArray(false, undefined), '[false] + [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{b:2},{c:3}], '[a:1,b:2] + [b:2,c:3]');
    test([1,1,3], [[1,5,6]], [1,1,3,1,5,6], '[1,1,3] + [1,5,6]');
    test([1,2,3], [[4,5,6]], [1,2,3,4,5,6], '[1,2,3] + [4,5,6]');
    test([1,2,3], [1], [1,2,3,1], '[1,2,3] + 1');

    test([1,2,3], [4, 1], [1,4,2,3], 'index 1 | 4');
    test(['a','b','c'], ['d', 1], ['a','d','b','c'], 'index 1 | d');
    test([{a:1},{a:2}], [{a:3}, 1], [{a:1},{a:3},{a:2}], 'index 1 | a:3');
    test([1,2,3], [4, 2], [1,2,4,3], 'index 2 | 4');
    test(['a','b','c'], ['d', 2], ['a','b','d','c'], 'index 2 | d');
    test([{a:1},{a:2}], [{a:3}, 2], [{a:1},{a:2},{a:3}], 'index 2 | a:3');
    test(['a','b','c'], ['d', 5], ['a','b','c','d'], 'index 5 | d');

    test(['a','b','c'], ['d', 0], ['d','a','b','c'], 'index 0 | d');
    test(['a','b','c'], ['d', -1], ['a','b','d','c'], 'index -1 | d');
    test(['a','b','c'], ['d', -2], ['a','d','b','c'], 'index -2 | d');
    test(['a','b','c'], ['d', -3], ['d','a','b','c'], 'index -3 | d');
    test(['a','b','c'], ['d', -4], ['d','a','b','c'], 'index -4 | d');
    test(['a','b','c'], ['d', null], ['d','a','b','c'], 'null index | d');
    test(['a','b','c'], safeArray('d', undefined), ['a','b','c','d'], 'undefined index | d');
    test(['a','b','c'], ['d', 'a'], ['a','b','c','d'], 'index a | d');
    test(['a','b','c'], ['d', NaN], ['a','b','c','d'], 'index NaN | d');

    test(['a','b','c'], ['d', '0'], ['d','a','b','c'], 'string numerals should also be recognized');

    var arr = [1,2,3];
    run(arr, 'insert', [4]);
    equal(arr, [1,2,3,4], 'should affect the original array');

  });

  method('removeAt', function() {
    test([1,2,2,3], [1,2,2,3], 'numeric | no argument');
    test([1,2,2,3], [0], [2,2,3], 'numeric | 0');
    test([1,2,2,3], [1], [1,2,3], 'numeric | 1');
    test([1,2,2,3], [2], [1,2,3], 'numeric | 2');
    test([1,2,2,3], [3], [1,2,2], 'numeric | 3');
    test([1,2,2,3], [4], [1,2,2,3], 'numeric | 4');
    test(['a','b','c','c'], ['a','b','c','c'], 'alphabet | no argument');
    test(['a','b','c','c'], [0], ['b','c','c'], 'alphabet | 0');
    test(['a','b','c','c'], [1], ['a','c','c'], 'alphabet | 1');
    test(['a','b','c','c'], [2], ['a','b','c'], 'alphabet | 2');
    test(['a','b','c','c'], [3], ['a','b','c'], 'alphabet | 3');
    test(['a','b','c','c'], [4], ['a','b','c','c'], 'alphabet | 4');
    test([{a:1},{a:2},{a:1}], [1], [{a:1},{a:1}], 'objects | 1');
    test([1,2,2,3], [0,1], [2,3], '0 to 1');
    test([1,2,2,3], [0,2], [3], '0 to 2');
    test([1,2,2,3], [1,2], [1,3], '1 to 2');
    test([1,2,2,3], [1,5], [1], '1 to 5');
    test([1,2,2,3], [0,5], [], '0 to 5');
    test([1,2,2,3], [null,5], [], 'also accepts null');

    var arr = [1,2,3];
    run(arr, 'removeAt', [1]);
    equal(arr, [1,3], 'should affect the original array');
  });

  method('unique', function() {

    test([1,1,3], [1,3], '1,1,3');
    test([0,0,0], [0], '0,0,0');
    test([-0,-0,-0], [-0], '-0,-0,-0');
    test([0,-0,0,-0], [0,-0], '0,-0,0,-0');
    test([0, -0, new Number(0), new Number(-0)], [0, -0, new Number(0), new Number(-0)], '0,-0 with non-primitives');
    test(['a','b','c'], ['a','b','c'], 'a,b,c');
    test(['a','a','c'], ['a','c'], 'a,a,c');
    test([NaN,NaN], [NaN], 'NaN');

    test([{ foo:'bar' }, { foo:'bar' }], [{foo:'bar'}], 'objects uniqued as well');
    test([{ first: 'John', last: 'Woo' }, { first: 'Reynold', last: 'Woo' }], [function(n){ return n.last; }], [{ first: 'John', last: 'Woo' }], 'can be uniqued via a mapping function');
    test([{ first: 'John', last: 'Woo' }, { first: 'Reynold', last: 'Woo' }], ['last'], [{ first: 'John', last: 'Woo' }], 'can be uniqued via a mapping shortcut');
    test([{name:{first:'John',last:'P'}}, {name:{first:'Reynold',last:'P'}}], ['name.last'], [{name:{first:'John',last:'P'}}], 'mapping function can go deep with dot operator');

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
    }
    run([1], 'unique', [fn]);

    equal(run([function(){ return 'a' }, function() { return 'a'; }, function() { return 'b'; }]).length, 3, 'Functions are always unique');

    test(['toString'], [], ['toString'], 'toString is respected as unique');
    test(['watch'], [], ['watch'], 'watch is respected as unique');
    test(['watch', 'flowers', 'toString'], [], ['watch', 'flowers', 'toString'], 'toString and watch mixed');

    test(testGetSparseArray(3, 'a','b','a'), ['a','b'], 'should handle sparse arrays');

    var arr = ['a'];
    arr[Math.pow(2, 32) - 2] = 'a';
    // This test doesn't ever fail but is massively
    // slow if not handling sparse arrays smartly.
    test(arr, [], ['a'], 'does not take O(n) for sparse arrays');

    test([['a'], {0:'a'}], [], [['a'],{0:'a'}], 'cannot be fooled by array-like');

    // Class Instances

    function Foo () {}
    var f1 = new Foo;
    var f2 = new Foo;
    var o1 = { foo: f1 };
    var o2 = { foo: f1 };
    var o3 = { foo: f2 };
    test([f1, f2], [f1, f2], 'instances | separate');
    test([f1, f1], [f1], 'instances | same');
    test([o1, o2], [o1], 'instances | same deep reference is equal');
    test([o1, o3], [o1, o3], 'instances | different deep reference is not equal');

    var foo = {};
    test([{foo:foo}], [{foo:foo}], 'Handles cyclic structures');

    var foo = {};
    foo.bar = foo;
    test([foo], [foo], 'Handles cyclic structures');

  });

  method('flatten', function() {

    test([1,2,3], [1,2,3], '1,2,3');
    test(['a','b','c'], ['a','b','c'], 'a,b,c');
    test([{a:1},{a:2},{a:1}], [{a:1},{a:2},{a:1}], 'a:1,a:2,a:1');
    test([[1],[2],[3]], [1,2,3], '[1],[2],[3]');
    test([[1,2],[3]], [1,2,3], '[1,2],[3]');
    test([[1,2,3]], [1,2,3], '[1,2,3]');
    test([['a'],['b'],['c']], ['a','b','c'], '[a],[b],[c]');
    test([['a','b'],['c']], ['a','b','c'], '[a,b],[c]');
    test([['a','b','c']], ['a','b','c'], '[a,b,c]');
    test([[{a:1}],[{a:2}],[{a:1}]], [{a:1},{a:2},{a:1}], '[a:1],[a:2],[a:1]');
    test([[{a:1},{a:2}],[{a:1}]], [{a:1},{a:2},{a:1}], '[a:1,a:2],[a:1]');
    test([[{a:1},{a:2},{a:1}]], [{a:1},{a:2},{a:1}], '[a:1,a:2,a:1]');
    test([[[['a','b'],'c',['d','e']],'f'],['g']], ['a','b','c','d','e','f','g'], '[[a,b],c,[d,e],f],g');

    test([[[['a','b'],'c',['d','e']],'f'],['g']], [1], [[['a','b'],'c',['d','e']],'f','g'], 'can flatten only first level');
    test([[[['a','b'],'c',['d','e']],'f'],['g']], [false], ['a','b','c','d','e','f','g'], 'wont explode on false');
    test([[[['a','b'],'c',['d','e']],'f'],['g']], [true], [[['a','b'],'c',['d','e']],'f','g'], 'wont explode on true');

    equal(run(oneUndefined, 'flatten').length, 1, 'should not compact arrays');

    var arr = testGetSparseArray(2, 'a', testGetSparseArray(2, 'b'), 'c');
    test(arr, [], ['a','b','c'], 'works on sparse arrays');

  });

  method('first', function() {
    test(['a','b','c'], 'a', 'no argument');
    test(['a','b','c'], [1], ['a'], '1');
    test(['a','b','c'], [2], ['a','b'], '2');
    test(['a','b','c'], [3], ['a','b','c'], '3');
    test(['a','b','c'], [4], ['a','b','c'], '4');
    test(['a','b','c'], [-1], [], '-1');
    test(['a','b','c'], [-2], [], '-2');
    test(['a','b','c'], [-3], [], '-3');
  });


  method('last', function() {
    test(['a','b','c'], 'c', 'no argument');
    test(['a','b','c'], [1], ['c'], '1');
    test(['a','b','c'], [2], ['b','c'], '2');
    test(['a','b','c'], [3], ['a','b','c'], '3');
    test(['a','b','c'], [4], ['a','b','c'], '4');
    test(['a','b','c'], [-1], [], '-1');
    test(['a','b','c'], [-2], [], '-2');
    test(['a','b','c'], [-3], [], '-3');
    test(['a','b','c'], [-4], [], '-4');
  });

  method('from', function() {
    test(['a','b','c'], ['a','b','c'], 'no argument');
    test(['a','b','c'], [1], ['b','c'], '');
    test(['a','b','c'], [2], ['c'], '2');
    test(['a','b','c'], [3], [], '3');
    test(['a','b','c'], [4], [], '4');
    test(['a','b','c'], [-1], ['c'], '-1');
    test(['a','b','c'], [-2], ['b','c'], '-2');
    test(['a','b','c'], [-3], ['a','b','c'], '-3');
    test(['a','b','c'], [-4], ['a','b','c'], '-4');
  });


  method('to', function() {
    test(['a','b','c'], ['a','b','c'], 'no argument');
    test(['a','b','c'], [0], [], 'no argument');
    test(['a','b','c'], [1], ['a'], '1');
    test(['a','b','c'], [2], ['a','b'], '2');
    test(['a','b','c'], [3], ['a','b','c'], '3');
    test(['a','b','c'], [4], ['a','b','c'], '4');
    test(['a','b','c'], [-1], ['a','b'], '-1');
    test(['a','b','c'], [-2], ['a'], '-2');
    test(['a','b','c'], [-3], [], '-3');
    test(['a','b','c'], [-4], [], '-4');
  });

  method('compact', function() {
    var f1 = function() {};
    var f2 = function() {};

    test([1,2,3], [1,2,3], '1,2,3');
    test([1,2,null,3], [1,2,3], '1,2,null,3');
    test([1,2,undefined,3], [1,2,3], '1,2,undefined,3');
    test(threeUndefined, [], 'undefined,undefined,undefined');
    test([null,null,null], [], 'null,null,null');
    test([NaN,NaN,NaN], [], 'NaN,NaN,NaN');
    test(['','',''], ['','',''], 'empty strings');
    test([false,false,false], [false,false,false], 'false is left alone');
    test([0,1,2], [0,1,2], '0,1,2');
    test([], [], 'empty array');
    test(['a','b','c'], ['a','b','c'], 'a,b,c');
    test([f1, f2], [f1, f2], 'functions');
    test([[null]], [[null]], 'does not deeply compact');
    test([null,[null],[false,[null,undefined,3]]], [[null],[false,[null,undefined,3]]], 'does not deeply compact | complex');

    test([false,false,false], [true], [], 'falsy | false is removed');
    test([0,0], [true], [], 'falsy | 0');
    test(['',''], [true], [], 'falsy | empty string');
    test([' ',' '], [true], [' ',' '], 'falsy | strings with spaces are kept');
    test([8,3], [true], [8,3], 'falsy | numbers are kept');
    test([false,undefined,false,null,NaN], [true], [], 'falsy | others are also handled');
  });

  method('groupBy', function() {

    var people = [
      { name: 'mary',   age: 52, hair: 'blonde' },
      { name: 'edmund', age: 27, hair: 'blonde' },
      { name: 'jim',    age: 27, hair: 'brown'  },
      { name: 'ronnie', age: 13, hair: 'brown'  }
    ];

    test([], {}, 'empty array');
    test([1,1,2,2,3,3,4], {1:[1,1],2:[2,2],3:[3,3],4:[4]}, '1,1,2,2,3,3,4');
    test(['a','b','c','a','e','c'], {'a':['a','a'],'b':['b'],'c':['c','c'],'e':['e']}, 'a,b,c,a,e,c');
    test([{a:1,b:5},{a:8,b:5},{a:8,b:3}], ['a'], {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'grouping by "a"');
    test([{a:1,b:5},{a:8,b:5},{a:8,b:3}], [function(el) { return el['a']; }], {8:[{a:8,b:5},{a:8,b:3}],1:[{a:1,b:5}]}, 'grouping by "a" by function');


    test(people, [function(p) { return p.age; }], {27: [{name:'edmund',age:27,hair:'blonde'},{name:'jim',age:27,hair:'brown'}],52:[{name:'mary',age:52,hair:'blonde'}],13:[{name:'ronnie',age:13,hair:'brown'}]}, 'grouping people by age');

    test([1,2,3], oneUndefined, { 1: [1], 2: [2], 3: [3] }, 'undefined');
    test([1,2,3], [null], { 1: [1], 2: [2], 3: [3] }, 'null');
    test([1,2,3], [4], { 'undefined': [1,2,3] }, 'number');

    var counter = 0;
    var expectedGroups = [['one','two'],['three']], expectedKeys = ['3','5'], groups = [], keys = [];
    var fn = function(group, key) {
      groups.push(group);
      keys.push(key);
      counter++;
    }
    run(['one','two','three'], 'groupBy', ['length', fn]);
    equal(counter, 2, 'should allow a callback fn');
    equal(groups, expectedGroups, 'Groups should be equal');
    equal(keys, expectedKeys, 'Keys should be equal');

    var arr1 = ['a','b','c'];
    var arr2 = ['d','e','f'];
    var fn = function(el, i) {
      return arr2[i];
    };
    var obj = run(arr1, 'groupBy', [fn]);

    var fn = function(el,i,a) {
      equal(this, [1], 'scope should be the array');
      equal(i, 0, 'second param should be the index');
      equal(a, [1], 'third param should also be the array');
    }
    run([1], 'groupBy', [fn]);

    equal(obj, { 'd':['a'],'e':['b'],'f':['c'] }, 'should use an index');

    var arr = [
      {id:1,a:{b:{c:'x'}}},
      {id:2,a:{b:{c:'x'}}},
      {id:3,a:{b:{c:'y'}}}
    ];
    var expected = {
      x: [{id:1,a:{b:{c:'x'}}}, {id:2,a:{b:{c:'x'}}}],
      y: [{id:3,a:{b:{c:'y'}}}]
    };
    test(arr, ['a.b.c'], expected, 'grouping by deep dot operator');

  });

  method('inGroups', function() {
    test([1,2,3,4,5,6,7,8,9,10], [1], [[1,2,3,4,5,6,7,8,9,10]], 'in groups of 1');
    test([1,2,3,4,5,6,7,8,9,10], [2], [[1,2,3,4,5],[6,7,8,9,10]], 'in groups of 2');
    test([1,2,3,4,5,6,7,8,9,10], [3], [[1,2,3,4],[5,6,7,8],[9,10]], 'in groups of 3');
    test([1,2,3,4,5,6,7,8,9,10], [4], [[1,2,3],[4,5,6],[7,8,9],[10]], 'in groups of 4');
    test([1,2,3,4,5,6,7,8,9,10], [5], [[1,2],[3,4],[5,6],[7,8],[9,10]], 'in groups of 5');
    test([1,2,3,4,5,6,7,8,9,10], [6], [[1,2],[3,4],[5,6],[7,8],[9,10],[]], 'in groups of 6');
    test([1,2,3,4,5,6,7,8,9,10], [7], [[1,2],[3,4],[5,6],[7,8],[9,10],[],[]], 'in groups of 7');
    test([1,2,3,4,5,6,7,8,9,10], [3, null], [[1,2,3,4],[5,6,7,8],[9,10,null,null]], 'pad with null | in groups of 3');
    test([1,2,3,4,5,6,7,8,9,10], [4, null], [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'pad with null | in groups of 4');
    test([1,2,3,4,5,6,7,8,9,10], [5, null], [[1,2],[3,4],[5,6],[7,8],[9,10]], 'pad with null | in groups of 5');
    test([1,2,3,4,5,6,7,8,9,10], [6, null], [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null]], 'pad with null | in groups of 6');
    test([1,2,3,4,5,6,7,8,9,10], [7, null], [[1,2],[3,4],[5,6],[7,8],[9,10],[null,null],[null,null]], 'pad with null | in groups of 7');
  });

  method('inGroupsOf', function() {

    test([1,2,3,4,5,6,7,8,9,10], [3], [[1,2,3],[4,5,6],[7,8,9],[10,null,null]], 'groups of 3 | 1 to 10');
    test([1,2,3,4,5,6,7,8,9], [3], [[1,2,3],[4,5,6],[7,8,9]], 'groups of 3 | 1 to 9');
    test([1,2,3,4,5,6,7,8], [3], [[1,2,3],[4,5,6],[7,8,null]], 'groups of 3 | 1 to 8');
    test([1,2,3,4,5,6,7], [3], [[1,2,3],[4,5,6],[7,null,null]], 'groups of 3 | 1 to 7');
    test([1,2,3,4,5,6], [3], [[1,2,3],[4,5,6]], 'groups of 3 | 1 to 6');
    test([1,2,3,4,5], [3], [[1,2,3],[4,5,null]], 'groups of 3 | 1 to 5');
    test([1,2,3,4], [3], [[1,2,3],[4,null,null]], 'groups of 3 | 1 to 4');
    test([1,2,3], [3], [[1,2,3]], 'groups of 3 | 1 to 3');
    test([1,2], [3], [[1,2,null]], 'groups of 3 | 1 to 2');
    test([1], [3], [[1,null,null]], 'groups of 3 | 1');

    test([1,2,3,4,5,6,7,8,9,10], [3, null], [[1,2,3],[4,5,6],[7,8,9],[10, null, null]], 'groups of 3 | pad with null | 1 to 10');
    test([1,2,3,4,5,6,7,8,9], [3, null], [[1,2,3],[4,5,6],[7,8,9]], 'groups of 3 | pad with null | 1 to 9');
    test([1,2,3,4,5,6,7,8], [3, null], [[1,2,3],[4,5,6],[7,8, null]], 'groups of 3 | pad with null | 1 to 8');
    test([1,2,3,4,5,6,7], [3, null], [[1,2,3],[4,5,6],[7, null, null]], 'groups of 3 | pad with null | 1 to 7');
    test([1,2,3,4,5,6], [3, null], [[1,2,3],[4,5,6]], 'groups of 3 | pad with null | 1 to 6');
    test([1,2,3,4,5], [3, null], [[1,2,3],[4,5,null]], 'groups of 3 | pad with null | 1 to 5');
    test([1,2,3,4], [3, null], [[1,2,3],[4,null,null]], 'groups of 3 | pad with null | 1 to 4');
    test([1,2,3], [3, null], [[1,2,3]], 'groups of 3 | pad with null | 1 to 3');
    test([1,2], [3, null], [[1,2,null]], 'groups of 3 | pad with null | 1 to 2');
    test([1], [3, null], [[1,null,null]], 'groups of 3 | pad with null | 1');

    test([1], [3, ' '], [[1,' ',' ']], 'pad with spaces');
    test([1], [3, true], [[1,true,true]], 'pad with true');
    test([1], [3, false], [[1,false,false]], 'pad with false');

    test([1], [], [[1]], 'no argument');
    test([1], [1, null], [[1]], 'pad with null | no argument');

    test([1], [0], [1], '0');
    test([1], [0, null], [1], 'pad with null | 0');

    test([1], [3, null], [[1, null, null]], 'pad with null | 3');
    test([1], [1, null], [[1]], 'pad with null | 1');
    test([], [3], [], 'empty array');
    test([], [3, null], [], 'pad with null | empty array');
    test([null], [3], [[null,null,null]], '[null] in groups of 3');
    test([null], [3, null], [[null,null,null]], 'pad with null | [null] in groups of 3');
    test([1], safeArray(3, undefined), [[1,null,null]], 'passing undefined reverts to null');

    // Issue #142 - inGroupsOf corrupting array length
    var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    run(arr, 'inGroupsOf', [3]);
    equal(arr.length, 20, 'does not corrupt original array length');

  });

  method('zip', function() {
    test([1, 2, 3], [[1], [2], [3]], 'one array');
    test([1, 2, 3], [[4, 5, 6]], [[1, 4], [2, 5], [3, 6]], 'two arrays');
    test([1, 2, 3], [[4, 5, 6], [7, 8, 9]], [[1, 4, 7], [2, 5, 8], [3, 6, 9]], 'three arrays');
    test([1, 2], [[4, 5, 6], [7, 8, 9]], [[1, 4, 7], [2, 5, 8]], 'constrained by length of first');
    test([4, 5, 6], [[1, 2], [8]], [[4, 1, 8], [5, 2, null], [6, null, null]], 'filled with null');
  });

  method('union', function() {

    test([1,2,3], [[3,4,5]], [1,2,3,4,5], '1,2,3 + 3,4,5');
    test([1,1,1], [[1,2,3]], [1,2,3], '1,1,1 + 1,2,3');
    test([0,0,0], [[1,2,3]], [0,1,2,3], '0,0,0 + 1,2,3');
    test([0,0,0], [[0,0,0]], [0], '0,0,0 + 0,0,0');
    test([], [[]], [], '2 empty arrays');
    test([-1,-2,-3], [[-2,-4,-5]], [-1,-2,-3,-4,-5], '-1,-2,-3 + -2,-4,-5');
    test([-1,-2,-3], [[3,4,5]], [-1,-2,-3,3,4,5], '-1,-2,-3 + 3,4,5');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{a:1},{b:2},{c:3}], 'a:1,b:2 + b:2,c:3');
    test([1,2,3], [[4]], [1,2,3,4], '1,2,3 + 4');

    test([1,2,3], [[4,8,10]], [1,2,3,4,8,10], '1,2,3 + 4 8 10');

    var arr = [1,2,3];
    run(arr, 'union', [[4,5,6]]);
    equal(arr, [1,2,3], 'is non-destructive');

    var s1 = testGetSparseArray(3, 'a','b');
    var s2 = testGetSparseArray(3, 'c','b');
    test(s1, [s2], ['a','b','c'], 'works on sparse arrays');


    // Comprehensive unit tests for new uniquing method.

    var aFunc = function(){
      return 'a';
    }
    var bFunc = function(){
      return 'b';
    }
    var cFunc = function(){
      return 'c';
    }
    var dFunc = function(){
      return 'd';
    }

    assertArrayEquivalent(run([1,2,3], 'union', [[3,4,5]]), [1,2,3,4,5], 'basic');
    assertArrayEquivalent(run([1,2,3], 'union', [['1','2','3']]), [1,2,3,'1','2','3'], 'Numbers vs. Strings');
    assertArrayEquivalent(run([[1,2,3]], 'union', [[['1','2','3']]]), [[1,2,3],['1','2','3']], 'Numbers vs. Strings nested');

    assertArrayEquivalent(run([1,2,3], 'union', [[1,2,3]]), [1,2,3], 'Number array');
    assertArrayEquivalent(run([[1,2,3]], 'union', [[[1,2,3]]]), [[1,2,3]], 'Nested number array');
    assertArrayEquivalent(run([[1,2,3]], 'union', [[[3,2,1]]]), [[1,2,3],[3,2,1]], 'Nested and reversed');

    assertArrayEquivalent(run([aFunc], 'union', [[bFunc]]), [aFunc, bFunc], 'Function references');
    assertArrayEquivalent(run([aFunc], 'union', [[bFunc, cFunc]]), [aFunc, bFunc, cFunc], 'Function references');
    assertArrayEquivalent(run([aFunc, bFunc], 'union', [[bFunc, cFunc]]), [aFunc, bFunc, cFunc], 'Function references');
    assertArrayEquivalent(run([aFunc, bFunc, cFunc], 'union', [[aFunc, bFunc, cFunc]]), [aFunc, bFunc, cFunc], 'Function references');
    assertArrayEquivalent(run([cFunc, cFunc], 'union', [[cFunc, cFunc]]), [cFunc], 'Function references');
    assertArrayEquivalent(run([], 'union', [[aFunc]]), [aFunc], 'Function references');

    equal(run([function() { return 'a'; }], 'union', [[function() { return 'a'; }]]).length, 2, 'Functions are never equivalent');

    assertArrayEquivalent(run([/bar/], 'union', [[/bas/]]), [/bar/,/bas/], 'Regexes');
    assertArrayEquivalent(run([[/bar/]], 'union', [[[/bas/,/bap/]]]), [[/bar/],[/bas/,/bap/]], 'Nested Regexes');
    assertArrayEquivalent(run([{ reg: /bar/ }], 'union', [[{ reg: /bar/ }, { reg: /map/ }]]), [{ reg: /bar/ }, { reg: /map/ }], 'Object Regexes');

    assertArrayEquivalent(run([true], 'union', [[false]]), [true,false], 'Booleans');
    assertArrayEquivalent(run([true], 'union', [[true]]), [true], 'Same Booleans');
    assertArrayEquivalent(run([[true]], 'union', [[[true, false]]]), [[true],[true, false]], 'Nested Booleans');
    assertArrayEquivalent(run([{ b: false }], 'union', [[{ b: false }, { b: true }]]), [{ b: false }, { b: true }], 'Object Booleans');


    assertArrayEquivalent(run([{},{}], 'union', [[{},{}]]), [{}], 'empty object array');
    assertArrayEquivalent(run([[{}]], 'union', [[[{},{}]]]), [[{}],[{},{}]], 'nested empty object array');
    assertArrayEquivalent(run([[{},{}]], 'union', [[[{},{}]]]), [[{},{}]], 'nested double object array');

    assertArrayEquivalent(run([{0:1}], 'union', [[[1]]]), [{0:1},[1]], 'object posing as array');
    assertArrayEquivalent(run([{}], 'union', [[[]]]), [{},[]], 'empty object vs. empty array');

    assertArrayEquivalent(run([[[],1]], 'union', [[[[1]]]]), [[[],1], [[1]]], 'empty array, 1 vs. empty array WITH one');

    var aObj = {
      text: 'foo',
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 5, 15)
    }

    var bObj = {
      text: 'foo',
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 5, 15)
    }

    var cObj = {
      text: 'foo',
      reg: /moofo/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 5, 15)
    }

    var dObj = {
      text: 'foo',
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'car'}],
      date: new Date(2001, 8, 15)
    }

    var eObj = {
      text: 'foo',
      reg: /moofa/,
      arr: [{foo:'bar'},{moo:'par'}],
      date: new Date(2001, 8, 15)
    }


    assertArrayEquivalent(run([aObj], 'union', [[aObj]]), [aObj], 'Nested objects a + a');
    assertArrayEquivalent(run([aObj], 'union', [[bObj]]), [aObj], 'Nested objects a + b');
    assertArrayEquivalent(run([aObj,bObj,cObj], 'union', [[]]), [aObj, cObj], 'Nested objects a,b,c + []');
    assertArrayEquivalent(run([], 'union', [[aObj,bObj,cObj]]), [aObj, cObj], 'Nested objects [] + a,b,c');
    assertArrayEquivalent(run([aObj,bObj], 'union', [[cObj]]), [aObj, cObj], 'Nested objects a,b + c');
    assertArrayEquivalent(run([cObj, cObj], 'union', [[cObj, cObj]]), [cObj], 'Nested objects c,c + c,c');
    assertArrayEquivalent(run([aObj, bObj, cObj, dObj], 'union', [[]]), [aObj, cObj, dObj], 'Nested objects a,b,c,d + []');
    assertArrayEquivalent(run([], 'union', [[aObj, bObj, cObj, dObj]]), [aObj, cObj, dObj], 'Nested objects a,b,c,d + a,c,d');
    assertArrayEquivalent(run([aObj, bObj], 'union', [[cObj, dObj]]), [aObj, cObj, dObj], 'Nested objects a,b + c,d');

    assertArrayEquivalent(run([aObj, bObj, cObj, dObj, eObj], 'union', [[aObj, bObj, cObj, dObj, eObj]]), [aObj, cObj, dObj, eObj], 'Nested objects a,b,c,d,e + a,b,c,d,e');

    var fnA = function() { return 'a'; }
    var fnC = function() { return 'c'; }

    var aFuncObj = {
      text: 'foo',
      func: fnA,
      arr:  ['a','b','c'],
      reg: /moofa/,
      date: new Date(2001, 5, 15)
    }

    var bFuncObj = {
      text: 'foo',
      func: fnA,
      arr:  ['a','b','c'],
      reg: /moofa/,
      date: new Date(2001, 5, 15)
    }

    var cFuncObj = {
      text: 'foo',
      func: fnC,
      arr:  ['a','b','c'],
      reg: /moofa/,
      date: new Date(2001, 5, 15)
    }


    assertArrayEquivalent(run([aFuncObj], 'union', [[aFuncObj]]), [aFuncObj], 'Nested objects with functions');
    assertArrayEquivalent(run([aFuncObj], 'union', [[bFuncObj]]), [aFuncObj], 'Nested objects with functions');
    assertArrayEquivalent(run([aFuncObj,bFuncObj,cFuncObj], 'union', [[]]), [aFuncObj, cFuncObj], 'Nested objects with functions');
    assertArrayEquivalent(run([aFuncObj,bFuncObj], 'union', [[cFuncObj]]), [aFuncObj, cFuncObj], 'Nested objects with functions');
    assertArrayEquivalent(run([cFuncObj, cFuncObj], 'union', [[cFuncObj, cFuncObj]]), [cFuncObj], 'Nested objects with functions meh');

    assertArrayEquivalent(run([NaN,NaN], 'union', [[NaN,NaN]]), [NaN], 'NaN');
    assertArrayEquivalent(run([null,null], 'union', [[null,null]]), [null], 'Null');
    assertArrayEquivalent(run(oneUndefined, 'union', nestedUndefined), oneUndefined, 'undefined');


    var aObj = {
      one:    1,
      two:    2,
      three:  3
    }

    var bObj = {
      three:  3,
      two:    2,
      one:    1
    }

    equal(run([aObj], 'union', [[bObj]]).length, 1, 'Properties may not be in the same order.');


    var xFunc = function (){ return 'x'; }
    var yFunc = function (){ return 'y'; }

    assertArrayEquivalent(run([xFunc], 'union', [[]]), [xFunc], 'functions with different content | [x] + []');
    assertArrayEquivalent(run([yFunc], 'union', [[]]), [yFunc], 'functions with different content | [y] + []');
    assertArrayEquivalent(run([], 'union', [[xFunc]]), [xFunc], 'functions with different content | [] + [x]');
    assertArrayEquivalent(run([], 'union', [[yFunc]]), [yFunc], 'functions with different content | [] + [y]');
    assertArrayEquivalent(run([], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [] + [x,y]');
    assertArrayEquivalent(run([xFunc], 'union', [[xFunc]]), [xFunc], 'functions with different content | [x] + [x]');
    assertArrayEquivalent(run([xFunc], 'union', [[yFunc]]), [xFunc,yFunc], 'functions with different content | [x] + [y]');
    assertArrayEquivalent(run([xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x] + [x,y]');
    assertArrayEquivalent(run([xFunc, xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,x] + [x,y]');
    assertArrayEquivalent(run([xFunc, xFunc], 'union', [[xFunc, xFunc]]), [xFunc], 'functions with different content | [x,x] + [x,x]');
    assertArrayEquivalent(run([xFunc, yFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,y] + [x,y]');
    assertArrayEquivalent(run([xFunc, yFunc], 'union', [[yFunc, xFunc]]), [xFunc,yFunc], 'functions with different content | [x,y] + [y,x]');
    assertArrayEquivalent(run([xFunc, yFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,y] + [y,y]');
    assertArrayEquivalent(run([yFunc, xFunc], 'union', [[yFunc, xFunc]]), [yFunc,xFunc], 'functions with different content | [y,x] + [y,x]');
    assertArrayEquivalent(run([yFunc, xFunc], 'union', [[xFunc, yFunc]]), [yFunc,xFunc], 'functions with different content | [y,x] + [x,y]');
    assertArrayEquivalent(run([yFunc, xFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with different content | [y,x] + [x,x]');
    assertArrayEquivalent(run([xFunc, xFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with different content | [x,x] + [y,y]');
    assertArrayEquivalent(run([yFunc, yFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with different content | [y,y] + [x,x]');


    xFunc = function (){}
    yFunc = function (){}

    assertArrayEquivalent(run([xFunc], 'union', [[]]), [xFunc], 'functions with identical content | [x] + []');
    assertArrayEquivalent(run([yFunc], 'union', [[]]), [yFunc], 'functions with identical content | [y] + []');
    assertArrayEquivalent(run([], 'union', [[xFunc]]), [xFunc], 'functions with identical content | [] + [x]');
    assertArrayEquivalent(run([], 'union', [[yFunc]]), [yFunc], 'functions with identical content | [] + [y]');
    assertArrayEquivalent(run([], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [] + [x,y]');
    assertArrayEquivalent(run([xFunc], 'union', [[xFunc]]), [xFunc], 'functions with identical content | [x] + [x]');
    assertArrayEquivalent(run([xFunc], 'union', [[yFunc]]), [xFunc,yFunc], 'functions with identical content | [x] + [y]');
    assertArrayEquivalent(run([xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x] + [x,y]');
    assertArrayEquivalent(run([xFunc, xFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,x] + [x,y]');
    assertArrayEquivalent(run([xFunc, xFunc], 'union', [[xFunc, xFunc]]), [xFunc], 'functions with identical content | [x,x] + [x,x]');
    assertArrayEquivalent(run([xFunc, yFunc], 'union', [[xFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,y] + [x,y]');
    assertArrayEquivalent(run([xFunc, yFunc], 'union', [[yFunc, xFunc]]), [xFunc,yFunc], 'functions with identical content | [x,y] + [y,x]');
    assertArrayEquivalent(run([xFunc, yFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,y] + [y,y]');
    assertArrayEquivalent(run([yFunc, xFunc], 'union', [[yFunc, xFunc]]), [yFunc,xFunc], 'functions with identical content | [y,x] + [y,x]');
    assertArrayEquivalent(run([yFunc, xFunc], 'union', [[xFunc, yFunc]]), [yFunc,xFunc], 'functions with identical content | [y,x] + [x,y]');
    assertArrayEquivalent(run([yFunc, xFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with identical content | [y,x] + [x,x]');
    assertArrayEquivalent(run([xFunc, xFunc], 'union', [[yFunc, yFunc]]), [xFunc,yFunc], 'functions with identical content | [x,x] + [y,y]');
    assertArrayEquivalent(run([yFunc, yFunc], 'union', [[xFunc, xFunc]]), [yFunc,xFunc], 'functions with identical content | [y,y] + [x,x]');

  });

  method('intersect', function() {

    test([1,2,3], [[3,4,5]], [3], '1,2,3 & 3,4,5');
    test(['a','b','c'], [['c','d','e']], ['c'], 'a,b,c & c,d,e');
    test([1,2,3], [[1,2,3]], [1,2,3], '1,2,3 & 1,2,3');
    test([1,2,3], [[3,2,1]], [1,2,3], '1,2,3 & 3,2,1');
    test([], [[3]], [], 'empty array & 3');
    test([3], [[]], [], '3 & empty array');
    test([], [[]], [], '2 empty arrays');
    test([null], [[]], [], '[null] & empty array');
    test([null], [[null]], [null], '[null] & [null]');
    test([false], [[false]], [false], '[false] & [false]');
    test([false], [[0]], [], '[false] & [0]');
    test([false], [[null]], [], '[false] & [null]');
    test([false], nestedUndefined, [], '[false] & [undefined]');
    test([{a:1},{b:2}], [[{b:2},{c:3}]], [{b:2}], 'a:1,b:2 & b:2,c:3');
    test([1,1,3], [[1,5,6]], [1], '1,1,3 & 1,5,6');
    test([1,2,3], [[4,5,6]], [], '1,1,3 & 4,5,6');
    test([1,1], [[1,1,[1,1]]], [1], 'assure uniqueness');
    test([1,2,3], [[1]], [1], '1,2,3 + 1');
    test(safeArray(undefined), [undefined], safeArray(undefined), '[undefined] & undefined');

    var arr = [1,2,3];
    run(arr, 'intersect', [[3,4,5]]);
    equal(arr, [1,2,3], 'is non-destructive');

    var s1 = testGetSparseArray(3, 'a','b');
    var s2 = testGetSparseArray(3, 'c','b');
    test(s1, [s2], ['b'], 'works on sparse arrays');


    var yFunc = function () { return 'y'; }
    var xFunc = function () { return 'x'; }

    test([function(){ return 'a' }], [[function() { return 'a'; }, function() { return 'b'; }]], [], 'functions are always unique');
    test([xFunc], [[]], [], 'functions with different content | [x] & []');
    test([yFunc], [[]], [], 'functions with different content | [y] & []');
    test([], [[xFunc]], [], 'functions with different content | [] & [x]');
    test([], [[yFunc]], [], 'functions with different content | [] & [y]');
    test([], [[xFunc, yFunc]], [], 'functions with different content | [] & [x,y]');
    test([xFunc], [[xFunc]], [xFunc], 'functions with different content | [x] & [x]');
    test([xFunc], [[yFunc]], [], 'functions with different content | [x] & [y]');
    test([xFunc], [[xFunc, yFunc]], [xFunc], 'functions with different content | [x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [xFunc], 'functions with different content | [x,x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with different content | [x,x] & [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [xFunc,yFunc], 'functions with different content | [x,y] & [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [xFunc,yFunc], 'functions with different content | [x,y] & [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [yFunc], 'functions with different content | [x,y] & [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [yFunc,xFunc], 'functions with different content | [y,x] & [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [yFunc,xFunc], 'functions with different content | [y,x] & [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with different content | [y,x] & [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [], 'functions with different content | [x,x] & [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [], 'functions with different content | [y,y] & [x,x]');

    var xFunc = function() {};
    var yFunc = function() {};

    test([xFunc], [[]], [], 'functions with identical content | [x] & []');
    test([yFunc], [[]], [], 'functions with identical content | [y] & []');
    test([], [[xFunc]], [], 'functions with identical content | [] & [x]');
    test([], [[yFunc]], [], 'functions with identical content | [] & [y]');
    test([], [[xFunc, yFunc]], [], 'functions with identical content | [] & [x,y]');
    test([xFunc], [[xFunc]], [xFunc], 'functions with identical content | [x] & [x]');
    test([xFunc], [[yFunc]], [], 'functions with identical content | [x] & [y]');
    test([xFunc], [[xFunc, yFunc]], [xFunc], 'functions with identical content | [x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, yFunc]], [xFunc], 'functions with identical content | [x,x] & [x,y]');
    test([xFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with identical content | [x,x] & [x,x]');
    test([xFunc, yFunc], [[xFunc, yFunc]], [xFunc,yFunc], 'functions with identical content | [x,y] & [x,y]');
    test([xFunc, yFunc], [[yFunc, xFunc]], [xFunc,yFunc], 'functions with identical content | [x,y] & [y,x]');
    test([xFunc, yFunc], [[yFunc, yFunc]], [yFunc], 'jrray#intersect | functions with identical content | [x,y] & [y,y]');
    test([yFunc, xFunc], [[yFunc, xFunc]], [yFunc,xFunc], 'functions with identical content | [y,x] & [y,x]');
    test([yFunc, xFunc], [[xFunc, yFunc]], [yFunc,xFunc], 'functions with identical content | [y,x] & [x,y]');
    test([yFunc, xFunc], [[xFunc, xFunc]], [xFunc], 'functions with identical content | [y,x] & [x,x]');
    test([xFunc, xFunc], [[yFunc, yFunc]], [], 'functions with identical content | [x,x] & [y,y]');
    test([yFunc, yFunc], [[xFunc, xFunc]], [], 'functions with identical content | [y,y] & [x,x]');

  });

  group('Complex Union/Intersect', function() {

    // Testing Array#union and Array#intersect on complex elements as found http://ermouth.com/fastArray/
    // Thanks to @ermouth!

    var yFunc = function () { return 'y'; }
    var xFunc = function () { return 'x'; }

    var arr1 = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      /randy/,
      yFunc,
      [6, "1679091c5a880faf6fb5e6087eb1b2dc"],
      xFunc,
      2
    ];

    var arr2 = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      /pandy/,
      xFunc,
      { e4da3b7fbbce2345d7772b0674a318d5: 5 },
      [8, "c9f0f895fb98ab9159f51fd0297e236d"]
    ];

    var unionExpected = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      /randy/,
      yFunc,
      [6, "1679091c5a880faf6fb5e6087eb1b2dc"],
      xFunc,
      2,
      /pandy/,
      { e4da3b7fbbce2345d7772b0674a318d5: 5 },
      [8, "c9f0f895fb98ab9159f51fd0297e236d"]
    ];

    var intersectExpected = [
      { eccbc87e4b5ce2fe28308fd9f2a7baf3: 3 },
      /rowdy/,
      xFunc
    ];


    equal(run(arr1, 'union', [arr2]), unionExpected, 'complex array unions');
    equal(run(arr1, 'intersect', [arr2]), intersectExpected, 'complex array intersects');

    equal(run([['a',1]], 'intersect', [[['a',1],['b',2]]]), [['a',1]], 'nested arrays are not flattened');
    equal(run([['a',1],['b',2]], 'subtract', [[['a',1]]]), [['b',2]], 'nested arrays are not flattened');
  });

});

