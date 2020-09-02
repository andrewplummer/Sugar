'use strict';

namespace('Object', function () {

  describeInstance('mapKeys', function (mapKeys) {

    it('should map basic object keys', () => {
      assertObjectEqual(
        mapKeys({ a: 1, b: 2 }, (key) => key + '1'),
        { a1: 1, b1: 2 }
      );
    });

    it('should be able to map by string shortcut', () => {
      assertObjectEqual(
        mapKeys(
          {
            a: { name: 'John' },
            b: { name: 'Fred' },
          },
          'name'
        ),
        {
          John: { name: 'John' },
          Fred: { name: 'Fred' },
        }
      );
    });

    it('should handle deep properties', () => {
      assertObjectEqual(
        mapKeys(
          {
            a: { profile: { name: 'John' } },
            b: { profile: { name: 'Fred' } },
          },
          'profile.name'
        ),
        {
          John: { profile: { name: 'John' } },
          Fred: { profile: { name: 'Fred' } },
        }
      );
    });

    it('should handle empty objects', () => {
      const obj = {};
      const empty = mapKeys(obj, () => {});
      assertFalse(obj === empty);
      assertObjectEqual(obj, empty);
    });

    it('should pass correct params', function () {
      mapKeys({ a: 1 }, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, { a: 1 });
      });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        mapKeys({ a: 1 });
      });
      assertError(() => {
        mapKeys(null);
      });
      assertError(() => {
        mapKeys(NaN);
      });
      assertError(() => {
        mapKeys(1);
      });
      assertError(() => {
        mapKeys('1');
      });
    });
  });

  describeInstance('mapValues', function (mapValues) {

    it('should map basic object values', () => {
      assertObjectEqual(
        mapValues({ a: 1, b: 2 }, (key) => key),
        { a: 'a', b: 'b' }
      );
      assertObjectEqual(
        mapValues({ a: 1, b: 2 }, (key, val) => val * 2),
        { a: 2, b: 4 }
      );
    });

    it('should be able to map by string shortcut', () => {
      assertObjectEqual(
        mapValues(
          {
            a: { name: 'John' },
            b: { name: 'Fred' },
          },
          'name'
        ),
        {
          a: 'John',
          b: 'Fred',
        }
      );
    });

    it('should handle deep properties', () => {
      assertObjectEqual(
        mapValues(
          {
            a: { profile: { name: 'John' } },
            b: { profile: { name: 'Fred' } },
          },
          'profile.name'
        ),
        {
          a: 'John',
          b: 'Fred',
        }
      );
    });

    it('should handle empty objects', () => {
      const obj = {};
      const empty = mapValues(obj, () => {});
      assertFalse(obj === empty);
      assertObjectEqual(obj, empty);
    });

    it('should pass correct params', function () {
      mapValues({ a: 1 }, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, { a: 1 });
      });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        mapValues({ a: 1 });
      });
      assertError(() => {
        mapValues(null);
      });
      assertError(() => {
        mapValues(NaN);
      });
      assertError(() => {
        mapValues(1);
      });
      assertError(() => {
        mapValues('1');
      });
    });
  });

  describeInstance('forEach', function (forEach) {

    it('should iterate over an object', () => {
      let count = 0;
      forEach({ a: 1, b: 2, c: 3 }, (key, val) => {
        count += val;
      });
      assertEqual(count, 6);
    });

    it('should handle empty objects', () => {
      let iterated = false;
      forEach({}, () => {
        iterated = true;
      });
      assertFalse(iterated);
    });

    it('should pass correct params', function () {
      forEach({ a: 1 }, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, { a: 1 });
      });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        forEach({ a: 1 });
      });
      assertError(() => {
        forEach(null);
      });
      assertError(() => {
        forEach(NaN);
      });
      assertError(() => {
        forEach(1);
      });
      assertError(() => {
        forEach('1');
      });
    });
  });

  describeInstance('some', function(some) {

    it('should match by primitive matchers', function() {
      assertEqual(some({a:'a',b:'b'}, 'a'), true);
      assertEqual(some({a:'a',b:'b'}, 'd'), false);
      assertEqual(some({a:1,b:2}, 7), false);
      assertEqual(some({a:true,b:false}, true), true);
      assertEqual(some({a:false,b:false}, true), false);
    });

    it('should match by regex', function() {
      assertEqual(some({a:'a',b:'b'}, /[ac]/), true);
      assertEqual(some({a:'a',b:'b'}, /[AC]/), false);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(some({a:d1,b:d2}, new Date(2020, 7, 28)), true);
      assertEqual(some({a:d1,b:d2}, new Date(2020, 7, 30)), false);
    });

    it('should match by function', function() {
      assertEqual(some({a:1,b:2}, (key, n) => n % 2 === 0), true);
      assertEqual(some({a:2,b:4}, (key, n) => n % 2 === 1), false);
      assertEqual(some({a:1,b:2}, (key, n) => n > 5), false);
      assertEqual(some({a:1,b:2}, (key, n) => n > 1), true);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(some({a:fn1, b:fn2}, fn2), true);
      assertEqual(some({a:fn1}, fn2), false);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(
        some({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        true
      );
      assertEqual(some({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Bob'}),
        false
      );
      assertEqual(some({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-F]/}),
        true
      );
      assertEqual(some({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[N-Z]/}),
        false
      );
    });

    it('should pass correct params', function() {
      some({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(some({a:1}, null), false);
      assertEqual(some({a:1}, NaN), false);
      assertError(function() { some({}); });
      assertError(function() { some(null); });
      assertError(function() { some('a'); });
      assertError(function() { some(1); });
    });

  });

  describeInstance('every', function(every) {

    it('should match by primitive matchers', function() {
      assertEqual(every({a:'a',b:'b'}, 'c'), false);
      assertEqual(every({a:'a',b:'b'}, 'a'), false);
      assertEqual(every({a:'a',b:'a'}, 'a'), true);
      assertEqual(every({a:1,b:2}, 3), false);
      assertEqual(every({a:1,b:2}, 2), false);
      assertEqual(every({a:1,b:1}, 1), true);
      assertEqual(every({a:true,b:false}, true), false);
      assertEqual(every({a:true,b:true}, true), true);
    });

    it('should match by regex', function() {
      assertEqual(every({a:'a',b:'b'}, /[ac]/), false);
      assertEqual(every({a:'a',b:'b'}, /[a-c]/), true);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(every({a:d1,b:d2}, new Date(2020, 7, 28)), false);
      assertEqual(every({a:d1,b:d1}, new Date(2020, 7, 28)), true);
    });

    it('should match by function', function() {
      assertEqual(every({a:1,b:2}, (key, n) => n % 2 === 0), false);
      assertEqual(every({a:2,b:4}, (key, n) => n % 2 === 0), true);
      assertEqual(every({a:1,b:2}, (key, n) => n > 5), false);
      assertEqual(every({a:1,b:2}, (key, n) => n > 0), true);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(every({a:fn1, b:fn2}, fn2), false);
      assertEqual(every({a:fn1, b:fn1}, fn1), true);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(
        every({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        false
      );
      assertEqual(every({
        1:{ name:'Frank'},
        2:{ name:'Frank'},
      }, {name:'Frank'}),
        true
      );
      assertEqual(every({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        true
      );
      assertEqual(every({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[G-Z]/}),
        false
      );
    });

    it('should pass correct params', function() {
      every({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(every({a:1}, null), false);
      assertEqual(every({a:1}, NaN), false);
      assertError(function() { every({}); });
      assertError(function() { every(null); });
      assertError(function() { every('a'); });
      assertError(function() { every(1); });
    });

  });

});
