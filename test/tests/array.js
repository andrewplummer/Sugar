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
      assertEqual(sum([{a:2},{a:5}], 'a'), 7);
      assertNaN(sum([{a:2},{a:5}], 'b'));
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

});
