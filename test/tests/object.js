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
});
