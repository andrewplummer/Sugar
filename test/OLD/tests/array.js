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

});
