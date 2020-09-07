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

});
