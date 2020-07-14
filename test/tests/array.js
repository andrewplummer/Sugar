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

});
