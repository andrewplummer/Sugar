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

});
