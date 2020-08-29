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
      const arr = [
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

});
