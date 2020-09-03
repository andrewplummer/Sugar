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

  describeInstance('none', function(none) {

    it('should match by primitive matchers', function() {
      assertEqual(none({a:'a',b:'b'}, 'a'), false);
      assertEqual(none({a:'a',b:'b'}, 'd'), true);
      assertEqual(none({a:1,b:2}, 7), true);
      assertEqual(none({a:true,b:false}, true), false);
      assertEqual(none({a:false,b:false}, true), true);
    });

    it('should match by regex', function() {
      assertEqual(none({a:'a',b:'b'}, /[ac]/), false);
      assertEqual(none({a:'a',b:'b'}, /[AC]/), true);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(none({a:d1,b:d2}, new Date(2020, 7, 28)), false);
      assertEqual(none({a:d1,b:d2}, new Date(2020, 7, 30)), true);
    });

    it('should match by function', function() {
      assertEqual(none({a:1,b:2}, (key, n) => n % 2 === 0), false);
      assertEqual(none({a:2,b:4}, (key, n) => n % 2 === 1), true);
      assertEqual(none({a:1,b:2}, (key, n) => n > 5), true);
      assertEqual(none({a:1,b:2}, (key, n) => n > 1), false);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(none({a:fn1, b:fn2}, fn2), false);
      assertEqual(none({a:fn1}, fn2), true);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(
        none({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        false
      );
      assertEqual(none({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Bob'}),
        true
      );
      assertEqual(none({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-F]/}),
        false
      );
      assertEqual(none({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[N-Z]/}),
        true
      );
    });

    it('should pass correct params', function() {
      none({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(none({a:1}, null), true);
      assertEqual(none({a:1}, NaN), true);
      assertError(function() { none({}); });
      assertError(function() { none(null); });
      assertError(function() { none('a'); });
      assertError(function() { none(1); });
    });

  });

  describeInstance('findKey', function(findKey) {

    it('should match by primitive matchers', function() {
      assertEqual(findKey({a:'a',b:'b'}, 'a'), 'a');
      assertEqual(findKey({a:'a',b:'b'}, 'c'), undefined);
      assertEqual(findKey({a:1,b:2}, 2), 'b');
      assertEqual(findKey({a:1,b:2}, 3), undefined);
      assertEqual(findKey({a:true,b:false}, true), 'a');
      assertEqual(findKey({a:true,b:true}, false), undefined);
    });

    it('should match by regex', function() {
      assertEqual(findKey({a:'a',b:'b'}, /[a-c]/), 'a');
      assertEqual(findKey({a:'a',b:'b'}, /[c-z]/), undefined);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(findKey({a:d1,b:d2}, new Date(2020, 7, 28)), 'a');
      assertEqual(findKey({a:d1,b:d1}, new Date(2020, 7, 29)), undefined);
    });

    it('should match by function', function() {
      assertEqual(findKey({a:1,b:2}, (key, n) => n % 2 === 0), 'b');
      assertEqual(findKey({a:1,b:3}, (key, n) => n % 2 === 0), undefined);
      assertEqual(findKey({a:1,b:2}, (key, n) => n > 5), undefined);
      assertEqual(findKey({a:1,b:2}, (key, n) => n > 0), 'a');
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(findKey({a:fn1, b:fn2}, fn2), 'b');
      assertEqual(findKey({a:fn1, b:fn1}, fn2), undefined);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(
        findKey({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        '1'
      );
      assertEqual(findKey({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        undefined
      );
      assertEqual(findKey({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        '1'
      );
      assertEqual(findKey({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        undefined
      );
    });

    it('should pass correct params', function() {
      findKey({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(findKey({a:1}, null), undefined);
      assertEqual(findKey({a:1}, NaN), undefined);
      assertError(function() { findKey({}); });
      assertError(function() { findKey(null); });
      assertError(function() { findKey('a'); });
      assertError(function() { findKey(1); });
    });

  });

  describeInstance('filterValues', function(filterValues) {

    it('should match by primitive matchers', function() {
      assertObjectEqual(filterValues({a:'a',b:'b'}, 'a'), {a:'a'});
      assertObjectEqual(filterValues({a:'a',b:'b'}, 'c'), {});
      assertObjectEqual(filterValues({a:1,b:2}, 2), {b:2});
      assertObjectEqual(filterValues({a:1,b:2}, 3), {});
      assertObjectEqual(filterValues({a:true,b:false}, true), {a:true});
      assertObjectEqual(filterValues({a:true,b:true}, false), {});
    });

    it('should match by regex', function() {
      assertObjectEqual(filterValues({a:'a',b:'b'}, /[a-c]/), {a:'a',b:'b'});
      assertObjectEqual(filterValues({a:'a',b:'b'}, /[c-z]/), {});
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(filterValues({a:d1,b:d2}, new Date(2020, 7, 28)), {a:d1});
      assertObjectEqual(filterValues({a:d1,b:d1}, new Date(2020, 7, 29)), {});
    });

    it('should match by function', function() {
      assertObjectEqual(filterValues({a:1,b:2}, (key, n) => n % 2 === 0), {b:2});
      assertObjectEqual(filterValues({a:1,b:3}, (key, n) => n % 2 === 0), {});
      assertObjectEqual(filterValues({a:1,b:2}, (key, n) => n > 5), {});
      assertObjectEqual(filterValues({a:1,b:2}, (key, n) => n > 0), {a:1,b:2});
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(filterValues({a:fn1, b:fn2}, fn2), {b:fn2});
      assertObjectEqual(filterValues({a:fn1, b:fn1}, fn2), {});
    });

    it('should match by fuzzy matching', function() {
      assertObjectEqual(
        filterValues({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        { 1: { name:'Frank'} },
      );
      assertObjectEqual(filterValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        {},
      );
      assertObjectEqual(filterValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        {
          1: { name:'Frank'},
          2: { name:'James'},
        },
      );
      assertObjectEqual(filterValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        {}
      );
    });

    it('should pass correct params', function() {
      filterValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should not modify the object', function() {
      const obj = {};
      assertEqual(obj === filterValues(obj, 1), false);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(filterValues({a:1}, null), {});
      assertObjectEqual(filterValues({a:1}, NaN), {});
      assertError(function() { filterValues({}); });
      assertError(function() { filterValues(null); });
      assertError(function() { filterValues('a'); });
      assertError(function() { filterValues(1); });
    });

  });

  describeInstance('excludeValues', function(excludeValues) {

    it('should match by primitive matchers', function() {
      assertObjectEqual(excludeValues({a:'a',b:'b'}, 'a'), {b:'b'});
      assertObjectEqual(excludeValues({a:'a',b:'b'}, 'c'), {a:'a',b:'b'});
      assertObjectEqual(excludeValues({a:1,b:2}, 2), {a:1});
      assertObjectEqual(excludeValues({a:1,b:2}, 3), {a:1,b:2});
      assertObjectEqual(excludeValues({a:true,b:false}, true), {b:false});
      assertObjectEqual(excludeValues({a:true,b:true}, false), {a:true,b:true});
    });

    it('should match by regex', function() {
      assertObjectEqual(excludeValues({a:'a',b:'b'}, /[a-c]/), {});
      assertObjectEqual(excludeValues({a:'a',b:'b'}, /[c-z]/), {a:'a',b:'b'});
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(excludeValues({a:d1,b:d2}, new Date(2020, 7, 28)), {b:d2});
      assertObjectEqual(excludeValues({a:d1,b:d1}, new Date(2020, 7, 29)), {a:d1,b:d1});
    });

    it('should match by function', function() {
      assertObjectEqual(excludeValues({a:1,b:2}, (key, n) => n % 2 === 0), {a:1});
      assertObjectEqual(excludeValues({a:1,b:3}, (key, n) => n % 2 === 0), {a:1,b:3});
      assertObjectEqual(excludeValues({a:1,b:2}, (key, n) => n > 5), {a:1,b:2});
      assertObjectEqual(excludeValues({a:1,b:2}, (key, n) => n > 0), {});
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(excludeValues({a:fn1, b:fn2}, fn2), {a:fn1});
      assertObjectEqual(excludeValues({a:fn1, b:fn1}, fn2), {a:fn1,b:fn1});
    });

    it('should match by fuzzy matching', function() {
      assertObjectEqual(
        excludeValues({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        { 2: { name:'James'} },
      );
      assertObjectEqual(excludeValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        {
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
      );
      assertObjectEqual(excludeValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        {},
      );
      assertObjectEqual(excludeValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        {
          1:{ name:'Frank'},
          2:{ name:'James'},
        }
      );
    });

    it('should pass correct params', function() {
      excludeValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should not modify the object', function() {
      const obj = {};
      assertEqual(obj === excludeValues(obj, 1), false);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(excludeValues({a:1}, null), {a:1});
      assertObjectEqual(excludeValues({a:1}, NaN), {a:1});
      assertError(function() { excludeValues({}); });
      assertError(function() { excludeValues(null); });
      assertError(function() { excludeValues('a'); });
      assertError(function() { excludeValues(1); });
    });

  });

  describeInstance('removeValues', function(removeValues) {

    it('should match by primitive matchers', function() {
      assertObjectEqual(removeValues({a:'a',b:'b'}, 'a'), {b:'b'});
      assertObjectEqual(removeValues({a:'a',b:'b'}, 'c'), {a:'a',b:'b'});
      assertObjectEqual(removeValues({a:1,b:2}, 2), {a:1});
      assertObjectEqual(removeValues({a:1,b:2}, 3), {a:1,b:2});
      assertObjectEqual(removeValues({a:true,b:false}, true), {b:false});
      assertObjectEqual(removeValues({a:true,b:true}, false), {a:true,b:true});
    });

    it('should match by regex', function() {
      assertObjectEqual(removeValues({a:'a',b:'b'}, /[a-c]/), {});
      assertObjectEqual(removeValues({a:'a',b:'b'}, /[c-z]/), {a:'a',b:'b'});
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(removeValues({a:d1,b:d2}, new Date(2020, 7, 28)), {b:d2});
      assertObjectEqual(removeValues({a:d1,b:d1}, new Date(2020, 7, 29)), {a:d1,b:d1});
    });

    it('should match by function', function() {
      assertObjectEqual(removeValues({a:1,b:2}, (key, n) => n % 2 === 0), {a:1});
      assertObjectEqual(removeValues({a:1,b:3}, (key, n) => n % 2 === 0), {a:1,b:3});
      assertObjectEqual(removeValues({a:1,b:2}, (key, n) => n > 5), {a:1,b:2});
      assertObjectEqual(removeValues({a:1,b:2}, (key, n) => n > 0), {});
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(removeValues({a:fn1, b:fn2}, fn2), {a:fn1});
      assertObjectEqual(removeValues({a:fn1, b:fn1}, fn2), {a:fn1,b:fn1});
    });

    it('should match by fuzzy matching', function() {
      assertObjectEqual(
        removeValues({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        { 2: { name:'James'} },
      );
      assertObjectEqual(removeValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        {
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
      );
      assertObjectEqual(removeValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        {},
      );
      assertObjectEqual(removeValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        {
          1:{ name:'Frank'},
          2:{ name:'James'},
        }
      );
    });

    it('should pass correct params', function() {
      removeValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should modify the object', function() {
      const obj1 = {a:1};
      const obj2 = removeValues(obj1, 1);
      assertEqual(obj1, obj2);
      assertObjectEqual(obj1, {});
    });

    it('should handle irregular input', function() {
      assertObjectEqual(removeValues({a:1}, null), {a:1});
      assertObjectEqual(removeValues({a:1}, NaN), {a:1});
      assertError(function() { removeValues({}); });
      assertError(function() { removeValues(null); });
      assertError(function() { removeValues('a'); });
      assertError(function() { removeValues(1); });
    });

  });

  describeInstance('filter', function(filter) {

    it('should filter by enumerated arguments', function() {
      assertObjectEqual(filter({a:1,b:2}, 'a'), {a:1});
      assertObjectEqual(filter({a:1,b:2}, 'a', 'b'), {a:1,b:2});
      assertObjectEqual(filter({a:1,b:2}), {});
      assertObjectEqual(filter({a:1,b:2}, 'c'), {});
    });

    it('should filter by array argument', function() {
      assertObjectEqual(filter({a:1,b:2}, ['a']), {a:1});
      assertObjectEqual(filter({a:1,b:2}, ['a', 'b']), {a:1,b:2});
      assertObjectEqual(filter({a:1,b:2}, []), {});
      assertObjectEqual(filter({a:1,b:2}, ['c']), {});
    });

    it('should not modify the object', function() {
      const obj1 = {a:1};
      const obj2 = filter(obj1, 1);
      assertFalse(obj1 === obj2);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(filter({a:1}, null), {});
      assertObjectEqual(filter({a:1}, NaN), {});
      assertError(function() { filter(null); });
      assertError(function() { filter('a'); });
      assertError(function() { filter(1); });
    });

  });

  describeInstance('exclude', function(exclude) {

    it('should exclude by enumerated arguments', function() {
      assertObjectEqual(exclude({a:1,b:2}, 'a'), {b:2});
      assertObjectEqual(exclude({a:1,b:2}, 'a', 'b'), {});
      assertObjectEqual(exclude({a:1,b:2}), {a:1,b:2});
      assertObjectEqual(exclude({a:1,b:2}, 'c'), {a:1,b:2});
    });

    it('should exclude by array argument', function() {
      assertObjectEqual(exclude({a:1,b:2}, ['a']), {b:2});
      assertObjectEqual(exclude({a:1,b:2}, ['a', 'b']), {});
      assertObjectEqual(exclude({a:1,b:2}, []), {a:1,b:2});
      assertObjectEqual(exclude({a:1,b:2}, ['c']), {a:1,b:2});
    });

    it('should not modify the object', function() {
      const obj1 = {a:1};
      const obj2 = exclude(obj1, 1);
      assertFalse(obj1 === obj2);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(exclude({a:1}, null), {a:1});
      assertObjectEqual(exclude({a:1}, NaN), {a:1});
      assertError(function() { exclude(null); });
      assertError(function() { exclude('a'); });
      assertError(function() { exclude(1); });
    });

  });

  describeInstance('remove', function(remove) {

    it('should remove by enumerated arguments', function() {
      assertObjectEqual(remove({a:1,b:2}, 'a'), {b:2});
      assertObjectEqual(remove({a:1,b:2}, 'a', 'b'), {});
      assertObjectEqual(remove({a:1,b:2}), {a:1,b:2});
      assertObjectEqual(remove({a:1,b:2}, 'c'), {a:1,b:2});
    });

    it('should remove by array argument', function() {
      assertObjectEqual(remove({a:1,b:2}, ['a']), {b:2});
      assertObjectEqual(remove({a:1,b:2}, ['a', 'b']), {});
      assertObjectEqual(remove({a:1,b:2}, []), {a:1,b:2});
      assertObjectEqual(remove({a:1,b:2}, ['c']), {a:1,b:2});
    });

    it('should modify the object', function() {
      const obj1 = {a:1};
      const obj2 = remove(obj1, 1);
      assertTrue(obj1 === obj2);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(remove({a:1}, null), {a:1});
      assertObjectEqual(remove({a:1}, NaN), {a:1});
      assertError(function() { remove(null); });
      assertError(function() { remove('a'); });
      assertError(function() { remove(1); });
    });

  });

  describeInstance('count', function(count) {

    it('should match by primitive matchers', function() {
      assertEqual(count({a:'a',b:'b'}, 'a'), 1);
      assertEqual(count({a:'a',b:'b'}, 'c'), 0);
      assertEqual(count({a:1,b:2}, 2), 1);
      assertEqual(count({a:1,b:2}, 3), 0);
      assertEqual(count({a:true,b:false}, true), 1);
      assertEqual(count({a:true,b:true}, false), 0);
    });

    it('should match by regex', function() {
      assertEqual(count({a:'a',b:'b'}, /[a-c]/), 2);
      assertEqual(count({a:'a',b:'b'}, /[c-z]/), 0);
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(count({a:d1,b:d2}, new Date(2020, 7, 28)), 1);
      assertEqual(count({a:d1,b:d1}, new Date(2020, 7, 29)), 0);
    });

    it('should match by function', function() {
      assertEqual(count({a:1,b:2}, (key, n) => n % 2 === 0), 1);
      assertEqual(count({a:1,b:3}, (key, n) => n % 2 === 0), 0);
      assertEqual(count({a:1,b:2}, (key, n) => n > 5), 0);
      assertEqual(count({a:1,b:2}, (key, n) => n > 0), 2);
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(count({a:fn1, b:fn2}, fn2), 1);
      assertEqual(count({a:fn1, b:fn1}, fn2), 0);
    });

    it('should match by fuzzy matching', function() {
      assertEqual(
        count({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        1,
      );
      assertEqual(count({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        0,
      );
      assertEqual(count({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        2,
      );
      assertEqual(count({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        0
      );
    });

    it('should pass correct params', function() {
      count({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(count({a:1}, null), 0);
      assertEqual(count({a:1}, NaN), 0);
      assertError(function() { count({}); });
      assertError(function() { count(null); });
      assertError(function() { count('a'); });
      assertError(function() { count(1); });
    });

  });

  describeInstance('sum', function(sum) {

    it('should sum all values with no arguments', function() {
      assertEqual(sum({a:1,b:2}), 3);
      assertEqual(sum({a:0,b:0}), 0);
      assertEqual(sum({a:1}), 1);
      assertEqual(sum({}), 0);
    });

    it('should sum with function mapper', function() {
      assertEqual(sum({a:1,b:2}, (key, n) => n * 2), 6);
      assertEqual(sum({a:1,b:2}, (key, n) => n % 2 === 0 ? n : 0), 2);
      assertEqual(sum({a:1,b:2}, (key, n) => n > 5 ? n : 0), 0);
      assertEqual(sum({a:1,b:2}, (key, n) => n > 1 ? n : 0), 2);
    });

    it('should sum with string mapper', function() {
      assertEqual(sum({1:{age:2},2:{age:5}}, 'age'), 7);
      assertNaN(sum({1:{age:2},2:{age:5}}, 'height'));
    });

    it('should handle deep properties', function() {
      assertEqual(sum({
        1: { profile: { likes: 20 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 36 } },
      }, 'profile.likes'), 73);
      assertEqual(sum({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), 189);
      assertEqual(sum({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), 189);
    });

    it('should pass correct params', function() {
      sum({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(sum({a:null,b:false}), 0);
      assertError(function() { sum(); });
      assertError(function() { sum(null); });
      assertError(function() { sum(1); });
      assertError(function() { sum('a'); });
    });

  });

  describeInstance('average', function(average) {

    it('should average all values with no arguments', function() {
      assertEqual(average({a:1,b:2,c:3}), 2);
      assertEqual(average({a:0,b:0,c:0}), 0);
      assertEqual(average({}), 0);
    });

    it('should average with function mapper', function() {
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n * 2), 5);
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n % 2 === 0 ? n : 0), 1.5);
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n > 5 ? n : 0), 0);
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n > 2 ? n : 0), 1.75);
    });

    it('should average with string mapper', function() {
      assertEqual(average({1:{age:2},2:{age:5}}, 'age'), 3.5);
      assertNaN(average({1:{age:2},2:{age:5}}, 'height'));
    });

    it('should handle deep properties', function() {
      assertEqual(average({
        1: { profile: { likes: 20 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 38 } },
      }, 'profile.likes'), 25);
      assertEqual(average({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), 63);
      assertEqual(average({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), 63);
    });

    it('should handle irregular input', function() {
      assertEqual(average({a:null,b:false}), 0);
      assertNaN(average({a:NaN,b:NaN}));
      assertError(function() { average(); });
      assertError(function() { average(null); });
      assertError(function() { average(1); });
      assertError(function() { average('a'); });
    });

  });

  describeInstance('median', function(median) {

    it('should median average all values with no arguments', function() {
      assertEqual(median({a:1,b:5,c:7}), 5);
      assertEqual(median({a:1,b:5,c:6,d:8}), 5.5);
      assertEqual(median({a:8,b:6,c:5,d:1}), 5.5);
      assertEqual(median({a:8,b:5,c:6,d:1}), 5.5);
      assertEqual(median({a:1,b:80,c:81}), 80);
      assertEqual(median({a:0,b:0,c:0}), 0);
      assertEqual(median({}), 0);
    });

    it('should median average with function mapper', function() {
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n * 2), 5);
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n % 2 === 0 ? n : 0), 1);
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n > 5 ? n : 0), 0);
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n > 2 ? n : 0), 1.5);
    });

    it('should average with string mapper', function() {
      assertEqual(median({1:{age:2},2:{age:5}}, 'age'), 3.5);
      assertNaN(median({1:{age:2},2:{age:5}}, 'height'));
    });

    it('should handle deep properties', function() {
      assertEqual(median({
        1: { profile: { likes: 10 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 38 } },
        4: { profile: { likes: 18 } },
      }, 'profile.likes'), 17.5);
      assertEqual(median({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), 80);
      assertEqual(median({
        1: { posts: [{ views: 20 }] },
        2: { posts: [{ views: 80 }] },
        3: { posts: [{ views: 97 }] },
        4: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), 50);
    });

    it('should handle irregular input', function() {
      assertEqual(median({a:null,b:false}), 0);
      assertNaN(median({a:NaN,b:NaN}));
      assertError(function() { median(); });
      assertError(function() { median(null); });
      assertError(function() { median(1); });
      assertError(function() { median('a'); });
    });

  });

  describeInstance('minKey', function(minKey) {

    it('should work with no arguments', function() {
      assertEqual(minKey({a:1,b:2,c:3}), 'a');
      assertEqual(minKey({a:0,b:0,c:0}), 'a');
    });

    it('should allow a function mapper', function() {
      assertEqual(minKey({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), 'd');
    });

    it('should allow a string mapper', function() {
      assertEqual(minKey({1:{age:5},2:{age:2}}, 'age'), '2');
      assertEqual(minKey({1:{age:2},2:{age:5}}, 'height'), '1');
    });

    it('should handle deep properties', function() {
      assertEqual(minKey({
        1: { profile: { likes: 20 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 36 } },
      }, 'profile.likes'), '2');
      assertEqual(minKey({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), '3');
      assertEqual(minKey({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), '3');
    });

    it('should handle infinite values', function() {
      assertEqual(minKey({a:Infinity}), 'a');
      assertEqual(minKey({a:-Infinity}), 'a');
    });

    it('should pass correct params', function() {
      minKey({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(minKey({}), undefined);
      assertEqual(minKey({a:'a',b:'b',c:'c'}), 'a');
      assertEqual(minKey({a:null, b:false}), 'a');
      assertError(function() { minKey(); });
      assertError(function() { minKey(null); });
      assertError(function() { minKey(1); });
      assertError(function() { minKey('a'); });
    });

  });

  describeInstance('maxKey', function(maxKey) {

    it('should work with no arguments', function() {
      assertEqual(maxKey({a:1,b:2,c:3}), 'c');
      assertEqual(maxKey({a:0,b:0,c:0}), 'a');
    });

    it('should allow a function mapper', function() {
      assertEqual(maxKey({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), 'a');
    });

    it('should allow a string mapper', function() {
      assertEqual(maxKey({1:{age:5},2:{age:2}}, 'age'), '1');
      assertEqual(maxKey({1:{age:2},2:{age:5}}, 'height'), '1');
    });

    it('should handle deep properties', function() {
      assertEqual(maxKey({
        1: { profile: { likes: 20 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 36 } },
      }, 'profile.likes'), '3');
      assertEqual(maxKey({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), '2');
      assertEqual(maxKey({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), '2');
    });

    it('should handle infinite values', function() {
      assertEqual(maxKey({a:Infinity}), 'a');
      assertEqual(maxKey({a:-Infinity}), 'a');
    });

    it('should pass correct params', function() {
      maxKey({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertEqual(maxKey({}), undefined);
      assertEqual(maxKey({a:'a',b:'b',c:'c'}), 'c');
      assertEqual(maxKey({a:null, b:false}), 'a');
      assertError(function() { maxKey(); });
      assertError(function() { maxKey(null); });
      assertError(function() { maxKey(1); });
      assertError(function() { maxKey('a'); });
    });

  });

  describeInstance('minKeys', function(minKeys) {

    it('should work with no arguments', function() {
      assertArrayEqual(minKeys({a:1,b:2,c:3}), ['a']);
      assertArrayEqual(minKeys({a:1,b:1,c:3}), ['a','b']);
      assertArrayEqual(minKeys({a:0,b:0,c:0}), ['a','b','c']);
    });

    it('should allow a function mapper', function() {
      assertArrayEqual(minKeys({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), ['d']);
    });

    it('should allow a string mapper', function() {
      assertArrayEqual(minKeys({1:{age:5},2:{age:2}}, 'age'), ['2']);
      assertArrayEqual(minKeys({1:{age:2},2:{age:5}}, 'height'), ['1', '2']);
    });

    it('should handle deep properties', function() {
      assertArrayEqual(minKeys({
        1: { profile: { likes: 20 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 36 } },
      }, 'profile.likes'), ['2']);
      assertArrayEqual(minKeys({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), ['3']);
      assertArrayEqual(minKeys({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), ['3']);
    });

    it('should handle infinite values', function() {
      assertArrayEqual(minKeys({a:Infinity}), ['a']);
      assertArrayEqual(minKeys({a:-Infinity}), ['a']);
    });

    it('should pass correct params', function() {
      minKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertArrayEqual(minKeys({}), []);
      assertArrayEqual(minKeys({a:'a',b:'b',c:'c'}), ['a']);
      assertArrayEqual(minKeys({a:null, b:false}), ['a']);
      assertError(function() { minKeys(); });
      assertError(function() { minKeys(null); });
      assertError(function() { minKeys(1); });
      assertError(function() { minKeys('a'); });
    });

  });

  describeInstance('maxKeys', function(maxKeys) {

    it('should work with no arguments', function() {
      assertArrayEqual(maxKeys({a:1,b:2,c:3}), ['c']);
      assertArrayEqual(maxKeys({a:1,b:3,c:3}), ['b','c']);
      assertArrayEqual(maxKeys({a:0,b:0,c:0}), ['a','b','c']);
    });

    it('should allow a function mapper', function() {
      assertArrayEqual(maxKeys({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), ['a']);
    });

    it('should allow a string mapper', function() {
      assertArrayEqual(maxKeys({1:{age:5},2:{age:2}}, 'age'), ['1']);
      assertArrayEqual(maxKeys({1:{age:2},2:{age:5}}, 'height'), ['1', '2']);
    });

    it('should handle deep properties', function() {
      assertArrayEqual(maxKeys({
        1: { profile: { likes: 20 } },
        2: { profile: { likes: 17 } },
        3: { profile: { likes: 36 } },
      }, 'profile.likes'), ['3']);
      assertArrayEqual(maxKeys({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts[0].views'), ['2']);
      assertArrayEqual(maxKeys({
        1: { posts: [{ views: 80 }] },
        2: { posts: [{ views: 97 }] },
        3: { posts: [{ views: 12 }] },
      }, 'posts.0.views'), ['2']);
    });

    it('should handle infinite values', function() {
      assertArrayEqual(maxKeys({a:Infinity}), ['a']);
      assertArrayEqual(maxKeys({a:-Infinity}), ['a']);
    });

    it('should pass correct params', function() {
      maxKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', function() {
      assertArrayEqual(maxKeys({}), []);
      assertArrayEqual(maxKeys({a:'a',b:'b',c:'c'}), ['c']);
      assertArrayEqual(maxKeys({a:null, b:false}), ['a']);
      assertError(function() { maxKeys(); });
      assertError(function() { maxKeys(null); });
      assertError(function() { maxKeys(1); });
      assertError(function() { maxKeys('a'); });
    });

  });

});
