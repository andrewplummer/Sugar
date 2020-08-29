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
});
