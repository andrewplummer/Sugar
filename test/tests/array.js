'use strict';

namespace('Array', function() {

  describeInstance('groupBy', function(groupBy) {

    var basic = [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 3 },
    ];

    var people = [
      { name: { first: 'Jim',    last: 'Beam'   }, age: 52 },
      { name: { first: 'Edmund', last: 'Edgar'  }, age: 27 },
      { name: { first: 'Jim',    last: 'Croche' }, age: 27 },
      { name: { first: 'Ron',    last: 'Howard' }, age: 13 }
    ];

    it('should group empty arrays', function () {
      assertObjectEqual(groupBy([]), {});
    });

    it('should group by function', function () {
      assertObjectEqual(
        groupBy(basic, function(el) {
          return el['a'];
        }),
        {
          1: [{ a: 1, b: 2 }, { a: 1, b: 3 }],
          2: [{ a: 2, b: 3 }],
        }
      );
      assertObjectEqual(
        groupBy(people, function(person) {
          return person.age;
        }),
        {
          52: [people[0]],
          27: [people[1], people[2]],
          13: [people[3]],
        }
      );
    });

    it('should group by identity', function () {
      assertObjectEqual(groupBy([1,1,2,2,3,3,4]), {1:[1,1],2:[2,2],3:[3,3],4:[4]});
      assertObjectEqual(groupBy(['a','b','a','e']), {'a':['a','a'],'b':['b'],'e':['e']});
    });

    it('should group by string shortcut', function () {
      assertObjectEqual(
        groupBy(basic, 'a'),
        {
          1: [{ a: 1, b: 2 }, { a: 1, b: 3 }],
          2: [{ a: 2, b: 3 }],
        }
      );
      assertObjectEqual(
        groupBy(['one','two','three'], 'length'),
        {
          3: ['one', 'two'],
          5: ['three'],
        }
      );
    });

    it('should group by deep shortcut', function () {
      assertObjectEqual(
        groupBy(people, 'name.first'),
        {
          'Jim': [
            { name: { first: 'Jim',    last: 'Beam'   }, age: 52 },
            { name: { first: 'Jim',    last: 'Croche' }, age: 27 },
          ],
          'Edmund': [
            { name: { first: 'Edmund', last: 'Edgar'  }, age: 27 },
          ],
          'Ron': [
            { name: { first: 'Ron',    last: 'Howard' }, age: 13 }
          ],
        }
      );
    });

    it('should call a function if necessary', function () {
      var arr = [
        { name: function() { return 'Jim'; } },
      ];
      assertObjectEqual(
        groupBy(arr, 'name'),
        {
          'Jim': [
            arr[0],
          ],
        }
      );
    });

    it('should have correct arguments', function () {
      groupBy(['a'], function(el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
        assertArrayEqual(this, ['a']);
      });
    });

  });

  describeInstance('at', function(at) {

    it('should work with normal indexes', function () {
      assertEqual(at(['a','b','c'], 0), 'a');
      assertEqual(at(['a','b','c'], 1), 'b');
      assertEqual(at(['a','b','c'], 2), 'c');
      assertUndefined(at(['a','b','c'], 3));
    });

    it('should work with negative indexes', function () {
      assertEqual(at(['a','b','c'], -1), 'c');
      assertEqual(at(['a','b','c'], -2), 'b');
      assertEqual(at(['a','b','c'], -3), 'a');
      assertUndefined(at(['a','b','c'], -4));
    });

    it('should allow looping with positive indexes', function () {
      assertEqual(at(['a','b','c'], 3, true), 'a');
      assertEqual(at(['a','b','c'], 4, true), 'b');
      assertEqual(at(['a','b','c'], 5, true), 'c');
      assertEqual(at(['a','b','c'], 6, true), 'a');
      assertEqual(at(['a','b','c'], 6000, true), 'a');
    });

    it('should allow looping with negative indexes', function () {
      assertEqual(at(['a','b','c'], -4, true), 'c');
      assertEqual(at(['a','b','c'], -5, true), 'b');
      assertEqual(at(['a','b','c'], -6, true), 'a');
      assertEqual(at(['a','b','c'], -7, true), 'c');
      assertEqual(at(['a','b','c'], -7000, true), 'c');
    });

    it('should return multiple elements with an array', function () {
      assertArrayEqual(at(['a','b','c'], [0, 2]), ['a', 'c']);
      assertArrayEqual(at(['a','b','c'], [1, 2]), ['b', 'c']);
      assertArrayEqual(at(['a','b','c'], [1, 3]), ['b', undefined]);
    });

    it('should return multiple elements with negative indexes', function () {
      assertArrayEqual(at(['a','b','c'], [-1, -2]), ['c', 'b']);
      assertArrayEqual(at(['a','b','c'], [-1, -3]), ['c', 'a']);
      assertArrayEqual(at(['a','b','c'], [-1, -4]), ['c', undefined]);
    });

    it('should return multiple elements with mixed indexes', function () {
      assertArrayEqual(at(['a','b','c'], [-1, 1]), ['c', 'b']);
      assertArrayEqual(at(['a','b','c'], [ 1,-1]), ['b', 'c']);
    });

    it('should return multiple elements with looping', function () {
      assertArrayEqual(at(['a','b','c'], [1, 3], true), ['b', 'a']);
      assertArrayEqual(at(['a','b','c'], [-1, -4], true), ['c', 'c']);
      assertArrayEqual(at(['a','b','c'], [-4000, 5000], true), ['c', 'c']);
    });

    it('should have no issues with sparse arrays', function() {
      /* eslint-disable no-sparse-arrays */
      assertEqual(at(['a',,'c'], 0), 'a');
      assertUndefined(at(['a',,'c'], 1));
      assertEqual(at(['a',,'c'], 2), 'c');
      assertUndefined(at(['a',,'c'], 3));
      assertEqual(at(['a',,'c'], 3, true), 'a');
      assertEqual(at(['a',,'c'], -1), 'c');
      assertUndefined(at(['a',,'c'], -2));
      assertEqual(at(['a',,'c'], -3), 'a');
      assertUndefined(at(['a',,'c'], -4));
      assertEqual(at(['a',,'c'], -4, true), 'c');
    });

    it('should handle irregular input', function() {
      assertEqual(at(['a','b','c'], '0'), 'a');
      assertEqual(at(['a','b','c'], '1'), 'b');
      assertEqual(at(['a','b','c'], '-1'), 'c');
      assertEqual(at(['a','b','c'], '-0'), 'a');
      assertEqual(at(['a','b','c'], null), 'a');
      assertEqual(at(['a','b','c'], true), 'b');
      assertEqual(at(['a','b','c'], false), 'a');
      assertUndefined(at(['a','b','c']));
      assertUndefined(at(['a','b','c'], undefined));
    });

  });

  describeInstance('remove', function(remove) {

    it('should modify the array', function() {
      var arr1 = ['a', 'b', 'c'];
      var arr2 = remove(arr1, 'c');
      assertEqual(arr1.length, 2);
      assertEqual(arr2, arr1);
    });

    it('should remove array members', function() {
      assertArrayEqual(remove([1,2,2,3], 2), [1,3]);
      assertArrayEqual(remove([0,1], 0), [1]);
    });

    it('should remove by regex', function() {
      assertArrayEqual(remove(['a','b','c'], /[ac]/), ['b']);
      assertArrayEqual(remove([1,2,3,4], /[2-3]/), [1,4]);
    });

    it('should remove by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertArrayEqual(remove([d1, d2], new Date(2020, 7, 28)), [d2]);
    });

    it('should remove by function', function() {
      assertArrayEqual(remove([1,2,3,4], (n) => n % 2 === 0), [1,3]);
      assertArrayEqual(remove([1,2,3,4], (n) => n > 5), [1,2,3,4]);
      assertArrayEqual(remove([1,2,3,4], (n) => n > 2), [1,2]);
    });

    it('should remove by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertArrayEqual(remove([fn1, fn2], fn2), [fn1]);
    });

    it('should remove by fuzzy matching', function() {
      assertArrayEqual(remove([{a:1,b:1},{a:2,b:2}], {a:1}), [{a:2,b:2}]);
      assertArrayEqual(remove([{name:'Frank'},{name:'James'}], {name: /^[A-F]/}), [{name:'James'}]);
    });

    it('should pass correct params to callback', function() {
      remove(['a'], function (el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
      });
    });

    it('should not iterate over all members of sparse arrays', function() {
      var count = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      remove(arr, function () {
        count++;
      });
      assertEqual(count, 2);
    });

    it('should handle irregular input', function() {
      assertArrayEqual(remove([1,2,2,3]), [1,2,2,3]);
      assertArrayEqual(remove([1,2,2,3], null), [1,2,2,3]);
      assertArrayEqual(remove([1,2,2,3], NaN), [1,2,2,3]);
      assertError(function() { remove(null); });
      assertError(function() { remove('a'); });
      assertError(function() { remove(1); });
    });

  });

  describeInstance('exclude', function(exclude) {

    it('should not modify the array', function() {
      var arr1 = ['a', 'b', 'c'];
      var arr2 = exclude(arr1, 'c');
      assertEqual(arr1.length, 3);
      assertEqual(arr2.length, 2);
    });

    it('should exclude array members', function() {
      assertArrayEqual(exclude([1,2,2,3], 2), [1,3]);
      assertArrayEqual(exclude([0,1], 0), [1]);
    });

    it('should exclude by regex', function() {
      assertArrayEqual(exclude(['a','b','c'], /[ac]/), ['b']);
      assertArrayEqual(exclude([1,2,3,4], /[2-3]/), [1,4]);
    });

    it('should exclude by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertArrayEqual(exclude([d1, d2], new Date(2020, 7, 28)), [d2]);
    });

    it('should exclude by function', function() {
      assertArrayEqual(exclude([1,2,3,4], (n) => n % 2 === 0), [1,3]);
      assertArrayEqual(exclude([1,2,3,4], (n) => n > 5), [1,2,3,4]);
      assertArrayEqual(exclude([1,2,3,4], (n) => n > 2), [1,2]);
    });

    it('should exclude by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertArrayEqual(exclude([fn1, fn2], fn2), [fn1]);
    });

    it('should exclude by fuzzy matching', function() {
      assertArrayEqual(exclude([{a:1,b:1},{a:2,b:2}], {a:1}), [{a:2,b:2}]);
      assertArrayEqual(exclude([{name:'Frank'},{name:'James'}], {name: /^[A-F]/}), [{name:'James'}]);
    });

    it('should pass correct params to callback', function() {
      exclude(['a'], function (el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
      });
    });

    it('should not iterate over all members of sparse arrays', function() {
      var count = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      exclude(arr, function () {
        count++;
      });
      assertEqual(count, 2);
    });

    it('should handle irregular input', function() {
      assertArrayEqual(exclude([1,2,2,3]), [1,2,2,3]);
      assertArrayEqual(exclude([1,2,2,3], null), [1,2,2,3]);
      assertArrayEqual(exclude([1,2,2,3], NaN), [1,2,2,3]);
      assertError(function() { exclude(null); });
      assertError(function() { exclude('a'); });
      assertError(function() { exclude(1); });
    });

  });

  describeInstance('map', function(map) {

    it('should map with function mapper', function() {
      assertArrayEqual(map([1,2,3,4], (n) => n * 2), [2,4,6,8]);
      assertArrayEqual(map([1,2,3,4], (n) => n % 2 === 0 ? n : 0), [0,2,0,4]);
      assertArrayEqual(map([1,2,3,4], (n) => n > 5 ? n : 0), [0,0,0,0]);
      assertArrayEqual(map([1,2,3,4], (n) => n > 2 ? n : 0), [0,0,3,4]);
    });

    it('should map with string mapper', function() {
      assertArrayEqual(map([{age:2},{age:5}], 'age'), [2,5]);
      assertArrayEqual(map([{age:2},{age:5}], 'height'), [undefined, undefined]);
    });

    it('should handle deep properties', function() {
      assertArrayEqual(map([
        { profile: { likes: 20 } },
        { profile: { likes: 17 } },
        { profile: { likes: 36 } },
      ], 'profile.likes'), [20,17,36]);
      assertArrayEqual(map([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts[0].views'), [80,97,12]);
      assertArrayEqual(map([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts[-1].views'), [80,97,12]);
      assertArrayEqual(map([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts.0.views'), [80,97,12]);
    });

    it('should be able multiple properties with an array', function() {
      // Issue #386
      assertArrayEqual(map([
        { name: 'John', age: 25 },
        { name: 'Fred', age: 85 },
        { name: 'Kirk', age: 17 },
      ], ['name', 'age']), [['John',25],['Fred',85],['Kirk',17]]);
    });

    it('should be able to map with array range syntax', function() {
      assertArrayEqual(map([
        { posts: [{ views: 80 }, { views: 40 }, { views: 20 }] },
        { posts: [{ views: 97 }, { views: 13 }, { views: 52 }] },
        { posts: [{ views: 11 }, { views: 45 }, { views: 81 }] },
      ], 'posts[1..2].views'), [[40,20],[13,52],[45,81]]);
    });

    it('should not iterate over all members of sparse arrays', function() {
      var count = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      map(arr, function () {
        count++;
      });
      assertEqual(count, 2);
    });

    it('should be able to use built-in properties', function() {
      assertArrayEqual(map(['a','aa','aaa'], 'length'), [1,2,3]);
    });

    it('should be able to use built-in functions', function() {
      assertArrayEqual(map([1,4,9], Math.sqrt), [1,2,3]);
    });

    it('should handle issue #525', function() {
      assertArrayEqual(
        map([{foo:'foo'},{bar:'bar'}], Object.keys),
        [['foo'],['bar']]
      );
    });

    it('should be able to pass context', function() {
      map([1], function (el) {
        assertEqual(this, 'context');
      }, 'context');
    });

    it('should handle irregular input', function() {
      assertArrayEqual(map([1,2,3], null), [1,2,3]);
      assertArrayEqual(map([1,2], '.'), [undefined, undefined]);
      assertArrayEqual(map([1,2], '..'), [undefined, undefined]);
      assertArrayEqual(map([1,2], 4), [undefined, undefined]);
      assertError(function() { map(); });
      assertError(function() { map([]); });
      assertError(function() { map(null); });
      assertError(function() { map(1); });
      assertError(function() { map('a'); });
    });

  });

  describeInstance('some', function(some) {

    it('should match by primitive matchers', function() {
      assertEqual(some(['a','b','c'], 'a'), true);
      assertEqual(some(['a','b','c'], 'd'), false);
      assertEqual(some([3,1,2,3], 7), false);
      assertEqual(some([true, true, false, true], true), true);
      assertEqual(some([false, false, false], true), false);
    });

    it('should match by regex', function() {
      assertEqual(some(['a','b','c'], /[ac]/), true);
      assertEqual(some(['a','b','c'], /[AC]/), false);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(some([d1, d2], new Date(2020, 7, 28)), true);
      assertEqual(some([d1, d2], new Date(2020, 7, 30)), false);
    });

    it('should match by function', function() {
      assertEqual(some([1,2,3,4], (n) => n % 2 === 0), true);
      assertEqual(some([2,4,6,8], (n) => n % 2 === 1), false);
      assertEqual(some([1,2,3,4], (n) => n > 5), false);
      assertEqual(some([1,2,3,4], (n) => n > 2), true);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(some([fn1, fn2], fn2), true);
      assertEqual(some([fn1], fn2), false);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(some([{a:1,b:1},{a:2,b:2}], {a:1}), true);
      assertEqual(some([{a:1,b:1},{a:2,b:2}], {a:5}), false);
      assertEqual(some([{name:'Frank'},{name:'James'}], {name: /^[A-F]/}), true);
      assertEqual(some([{name:'Frank'},{name:'James'}], {name: /^[N-Z]/}), false);
    });

    it('should pass correct params to callback', function() {
      some(['a'], function (el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
      });
    });

    it('should not iterate over all members of sparse arrays', function() {
      var n = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      some(arr, function () {
        n++;
      });
      assertEqual(n, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(some([1,2,2,3], null), false);
      assertEqual(some([1,2,2,3], NaN), false);
      assertError(function() { some([1]); });
      assertError(function() { some(null); });
      assertError(function() { some('a'); });
      assertError(function() { some(1); });
    });

  });

  describeInstance('none', function(none) {

    it('should match by primitive matchers', function() {
      assertEqual(none(['a','b','c'], 'a'), false);
      assertEqual(none(['a','b','c'], 'd'), true);
      assertEqual(none([3,1,2,3], 7), true);
      assertEqual(none([true, true, false, true], true), false);
      assertEqual(none([false, false, false], true), true);
    });

    it('should match by regex', function() {
      assertEqual(none(['a','b','c'], /[ac]/), false);
      assertEqual(none(['a','b','c'], /[AC]/), true);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(none([d1, d2], new Date(2020, 7, 28)), false);
      assertEqual(none([d1, d2], new Date(2020, 7, 30)), true);
    });

    it('should match by function', function() {
      assertEqual(none([1,2,3,4], (n) => n % 2 === 0), false);
      assertEqual(none([2,4,6,8], (n) => n % 2 === 1), true);
      assertEqual(none([1,2,3,4], (n) => n > 5), true);
      assertEqual(none([1,2,3,4], (n) => n > 2), false);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(none([fn1, fn2], fn2), false);
      assertEqual(none([fn1], fn2), true);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(none([{a:1,b:1},{a:2,b:2}], {a:1}), false);
      assertEqual(none([{a:1,b:1},{a:2,b:2}], {a:7}), true);
      assertEqual(none([{name:'Frank'},{name:'James'}], {name: /^[A-F]/}), false);
      assertEqual(none([{name:'Frank'},{name:'James'}], {name: /^[N-Z]/}), true);
    });

    it('should pass correct params to callback', function() {
      none(['a'], function (el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
      });
    });

    it('should not iterate over all members of sparse arrays', function() {
      var n = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      none(arr, function () {
        n++;
      });
      assertEqual(n, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(none([1,2,2,3], null), true);
      assertEqual(none([1,2,2,3], NaN), true);
      assertError(function() { none([1]); });
      assertError(function() { none(null); });
      assertError(function() { none('a'); });
      assertError(function() { none(1); });
    });

  });

  describeInstance('every', function(every) {

    it('should match by primitive matchers', function() {
      assertEqual(every(['a','b','c'], 'a'), false);
      assertEqual(every(['a','a','a'], 'a'), true);
      assertEqual(every([1,1,1], 2), false);
      assertEqual(every([1,1,1], 1), true);
      assertEqual(every([false, false, true], false), false);
      assertEqual(every([false, false, false], false), true);
    });

    it('should match by regex', function() {
      assertEqual(every(['a','b','c'], /[ac]/), false);
      assertEqual(every(['a','b','c'], /[a-c]/), true);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(every([d1, d2], new Date(2020, 7, 28)), false);
      assertEqual(every([d1, d1], new Date(2020, 7, 28)), true);
    });

    it('should match by function', function() {
      assertEqual(every([1,2,3,4], (n) => n % 2 === 0), false);
      assertEqual(every([2,4,6,8], (n) => n % 2 === 0), true);
      assertEqual(every([1,2,3,4], (n) => n > 5), false);
      assertEqual(every([1,2,3,4], (n) => n > 0), true);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(every([fn1, fn2], fn2), false);
      assertEqual(every([fn2, fn2], fn2), true);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(every([{a:1,b:1},{a:2,b:2}], {a:1}), false);
      assertEqual(every([{a:1,b:1},{a:1,b:2}], {a:1}), true);
      assertEqual(every([{name:'Frank'},{name:'James'}], {name: /^[A-F]/}), false);
      assertEqual(every([{name:'Frank'},{name:'James'}], {name: /^[A-J]/}), true);
    });

    it('should pass correct params to callback', function() {
      every(['a'], function (el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
      });
    });

    it('should not iterate over all members of sparse arrays', function() {
      var n = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      every(arr, function () {
        n++;
        return true;
      });
      assertEqual(n, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(every([1,2,2,3], null), false);
      assertEqual(every([1,2,2,3], NaN), false);
      assertError(function() { every([1]); });
      assertError(function() { every(null); });
      assertError(function() { every('a'); });
      assertError(function() { every(1); });
    });

  });

  describeInstance('count', function(count) {

    it('should count all elements with no arguments', function() {
      assertEqual(count(['a','b','c']), 3);
    });

    it('should count by primitive matchers', function() {
      assertEqual(count(['a','b','c'], 'a'), 1);
      assertEqual(count([3,1,2,3], 3), 2);
      assertEqual(count([true, true, false, true], true), 3);
    });

    it('should match by regex', function() {
      assertEqual(count(['a','b','c'], /[ac]/), 2);
      assertEqual(count([1,2,3,4], /[3]/), 1);
    });

    it('should count by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(count([d1, d2], new Date(2020, 7, 28)), 1);
    });

    it('should count by function', function() {
      assertEqual(count([1,2,3,4], (n) => n % 2 === 0), 2);
      assertEqual(count([1,2,3,4], (n) => n > 5), 0);
      assertEqual(count([1,2,3,4], (n) => n > 2), 2);
    });

    it('should count by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(count([fn1, fn2], fn2), 1);
    });

    it('should count by fuzzy matching', function() {
      assertEqual(count([{a:1,b:1},{a:2,b:2}], {a:1}), 1);
      assertEqual(count([{name:'Frank'},{name:'James'}], {name: /^[A-F]/}), 1);
    });

    it('should pass correct params to callback', function() {
      count(['a'], function (el, i, arr) {
        assertEqual(el, 'a');
        assertEqual(i, 0);
        assertArrayEqual(arr, ['a']);
      });
    });

    it('should not iterate over all members of sparse arrays', function() {
      var n = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      count(arr, function () {
        n++;
      });
      assertEqual(n, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(count([1,2,2,3], null), 0);
      assertEqual(count([1,2,2,3], NaN), 0);
      assertError(function() { count(null); });
      assertError(function() { count('a'); });
      assertError(function() { count(1); });
    });

  });

  describeInstance('sum', function(sum) {

    it('should sum all elements with no arguments', function() {
      assertEqual(sum([1,2,3]), 6);
      assertEqual(sum([0,0,0]), 0);
    });

    it('should sum with function mapper', function() {
      assertEqual(sum([1,2,3,4], (n) => n * 2), 20);
      assertEqual(sum([1,2,3,4], (n) => n % 2 === 0 ? n : 0), 6);
      assertEqual(sum([1,2,3,4], (n) => n > 5 ? n : 0), 0);
      assertEqual(sum([1,2,3,4], (n) => n > 2 ? n : 0), 7);
    });

    it('should sum with string mapper', function() {
      assertEqual(sum([{age:2},{age:5}], 'age'), 7);
      assertNaN(sum([{age:2},{age:5}], 'height'));
    });

    it('should handle deep properties', function() {
      assertEqual(sum([
        { profile: { likes: 20 } },
        { profile: { likes: 17 } },
        { profile: { likes: 36 } },
      ], 'profile.likes'), 73);
      assertEqual(sum([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts[0].views'), 189);
      assertEqual(sum([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts.0.views'), 189);
    });

    it('should not iterate over all members of sparse arrays', function() {
      var count = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      sum(arr, function () {
        count++;
      });
      assertEqual(count, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(sum([]), 0);
      assertEqual(sum([null, false]), 0);
      assertError(function() { sum(); });
      assertError(function() { sum(null); });
      assertError(function() { sum(1); });
      assertError(function() { sum('a'); });
    });

  });

  describeInstance('average', function(average) {

    it('should average all elements with no arguments', function() {
      assertEqual(average([1,2,3]), 2);
      assertEqual(average([0,0,0]), 0);
    });

    it('should average with function mapper', function() {
      assertEqual(average([1,2,3,4], (n) => n * 2), 5);
      assertEqual(average([1,2,3,4], (n) => n % 2 === 0 ? n : 0), 1.5);
      assertEqual(average([1,2,3,4], (n) => n > 5 ? n : 0), 0);
      assertEqual(average([1,2,3,4], (n) => n > 2 ? n : 0), 1.75);
    });

    it('should average with string mapper', function() {
      assertEqual(average([{age:2},{age:5}], 'age'), 3.5);
      assertNaN(average([{age:2},{age:5}], 'height'));
    });

    it('should handle deep properties', function() {
      assertEqual(average([
        { profile: { likes: 20 } },
        { profile: { likes: 17 } },
        { profile: { likes: 38 } },
      ], 'profile.likes'), 25);
      assertEqual(average([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts[0].views'), 63);
      assertEqual(average([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts.0.views'), 63);
    });

    it('should not iterate over all members of sparse arrays', function() {
      var count = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      average(arr, function () {
        count++;
      });
      assertEqual(count, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(average([]), 0);
      assertEqual(average([null, false]), 0);
      assertNaN(average([NaN, NaN]));
      assertError(function() { average(); });
      assertError(function() { average(null); });
      assertError(function() { average(1); });
      assertError(function() { average('a'); });
    });

  });

  describeInstance('median', function(median) {

    it('should median average all elements with no arguments', function() {
      assertEqual(median([1,2,5,6,7]), 5);
      assertEqual(median([1,2,5,6,7,8]), 5.5);
      assertEqual(median([8,7,6,5,2,1]), 5.5);
      assertEqual(median([1,2,80,81,82]), 80);
      assertEqual(median([0,0,0]), 0);
    });

    it('should median average with function mapper', function() {
      assertEqual(median([1,2,3,4], (n) => n * 2), 5);
      assertEqual(median([1,2,3,4], (n) => n % 2 === 0 ? n : 0), 1);
      assertEqual(median([1,2,3,4], (n) => n > 5 ? n : 0), 0);
      assertEqual(median([1,2,3,4], (n) => n > 2 ? n : 0), 1.5);
    });

    it('should average with string mapper', function() {
      assertEqual(median([{age:2},{age:5}], 'age'), 3.5);
      assertNaN(median([{age:2},{age:5}], 'height'));
    });

    it('should handle deep properties', function() {
      assertEqual(median([
        { profile: { likes: 10 } },
        { profile: { likes: 17 } },
        { profile: { likes: 38 } },
        { profile: { likes: 18 } },
      ], 'profile.likes'), 17.5);
      assertEqual(median([
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts[0].views'), 80);
      assertEqual(median([
        { posts: [{ views: 20 }] },
        { posts: [{ views: 80 }] },
        { posts: [{ views: 97 }] },
        { posts: [{ views: 12 }] },
      ], 'posts.0.views'), 50);
    });

    it('should not iterate over all members of sparse arrays', function() {
      var count = 0;
      var arr = ['a'];
      arr[8000] = 'b';
      median(arr, function () {
        count++;
      });
      assertEqual(count, 2);
    });

    it('should handle irregular input', function() {
      assertEqual(median([]), 0);
      assertEqual(median([null, false]), 0);
      assertNaN(median([NaN, NaN]));
      assertError(function() { median(); });
      assertError(function() { median(null); });
      assertError(function() { median(1); });
      assertError(function() { median('a'); });
    });

  });

});
