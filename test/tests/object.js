'use strict';
/* eslint-disable no-sparse-arrays */

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

    it('should pass correct arguments', function () {
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

    it('should pass correct arguments', function () {
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

    it('should pass correct arguments', function () {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

  describeInstance('selectValues', function(selectValues) {

    it('should match by primitive matchers', function() {
      assertObjectEqual(selectValues({a:'a',b:'b'}, 'a'), {a:'a'});
      assertObjectEqual(selectValues({a:'a',b:'b'}, 'c'), {});
      assertObjectEqual(selectValues({a:1,b:2}, 2), {b:2});
      assertObjectEqual(selectValues({a:1,b:2}, 3), {});
      assertObjectEqual(selectValues({a:true,b:false}, true), {a:true});
      assertObjectEqual(selectValues({a:true,b:true}, false), {});
    });

    it('should match by regex', function() {
      assertObjectEqual(selectValues({a:'a',b:'b'}, /[a-c]/), {a:'a',b:'b'});
      assertObjectEqual(selectValues({a:'a',b:'b'}, /[c-z]/), {});
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(selectValues({a:d1,b:d2}, new Date(2020, 7, 28)), {a:d1});
      assertObjectEqual(selectValues({a:d1,b:d1}, new Date(2020, 7, 29)), {});
    });

    it('should match by function', function() {
      assertObjectEqual(selectValues({a:1,b:2}, (key, n) => n % 2 === 0), {b:2});
      assertObjectEqual(selectValues({a:1,b:3}, (key, n) => n % 2 === 0), {});
      assertObjectEqual(selectValues({a:1,b:2}, (key, n) => n > 5), {});
      assertObjectEqual(selectValues({a:1,b:2}, (key, n) => n > 0), {a:1,b:2});
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(selectValues({a:fn1, b:fn2}, fn2), {b:fn2});
      assertObjectEqual(selectValues({a:fn1, b:fn1}, fn2), {});
    });

    it('should match by fuzzy matching', function() {
      assertObjectEqual(
        selectValues({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        { 1: { name:'Frank'} },
      );
      assertObjectEqual(selectValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        {},
      );
      assertObjectEqual(selectValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        {
          1: { name:'Frank'},
          2: { name:'James'},
        },
      );
      assertObjectEqual(selectValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        {}
      );
    });

    it('should pass correct arguments', function() {
      selectValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should not modify the object', function() {
      const obj = {};
      assertEqual(obj === selectValues(obj, 1), false);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(selectValues({a:1}, null), {});
      assertObjectEqual(selectValues({a:1}, NaN), {});
      assertError(function() { selectValues({}); });
      assertError(function() { selectValues(null); });
      assertError(function() { selectValues('a'); });
      assertError(function() { selectValues(1); });
    });

  });

  describeInstance('rejectValues', function(rejectValues) {

    it('should match by primitive matchers', function() {
      assertObjectEqual(rejectValues({a:'a',b:'b'}, 'a'), {b:'b'});
      assertObjectEqual(rejectValues({a:'a',b:'b'}, 'c'), {a:'a',b:'b'});
      assertObjectEqual(rejectValues({a:1,b:2}, 2), {a:1});
      assertObjectEqual(rejectValues({a:1,b:2}, 3), {a:1,b:2});
      assertObjectEqual(rejectValues({a:true,b:false}, true), {b:false});
      assertObjectEqual(rejectValues({a:true,b:true}, false), {a:true,b:true});
    });

    it('should match by regex', function() {
      assertObjectEqual(rejectValues({a:'a',b:'b'}, /[a-c]/), {});
      assertObjectEqual(rejectValues({a:'a',b:'b'}, /[c-z]/), {a:'a',b:'b'});
    });

    it('should match by date', function() {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(rejectValues({a:d1,b:d2}, new Date(2020, 7, 28)), {b:d2});
      assertObjectEqual(rejectValues({a:d1,b:d1}, new Date(2020, 7, 29)), {a:d1,b:d1});
    });

    it('should match by function', function() {
      assertObjectEqual(rejectValues({a:1,b:2}, (key, n) => n % 2 === 0), {a:1});
      assertObjectEqual(rejectValues({a:1,b:3}, (key, n) => n % 2 === 0), {a:1,b:3});
      assertObjectEqual(rejectValues({a:1,b:2}, (key, n) => n > 5), {a:1,b:2});
      assertObjectEqual(rejectValues({a:1,b:2}, (key, n) => n > 0), {});
    });

    it('should match by function when strictly equal', function() {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(rejectValues({a:fn1, b:fn2}, fn2), {a:fn1});
      assertObjectEqual(rejectValues({a:fn1, b:fn1}, fn2), {a:fn1,b:fn1});
    });

    it('should match by fuzzy matching', function() {
      assertObjectEqual(
        rejectValues({
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
          {name:'Frank'}
        ),
        { 2: { name:'James'} },
      );
      assertObjectEqual(rejectValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:'Robert'}),
        {
          1:{ name:'Frank'},
          2:{ name:'James'},
        },
      );
      assertObjectEqual(rejectValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[A-J]/}),
        {},
      );
      assertObjectEqual(rejectValues({
        1:{ name:'Frank'},
        2:{ name:'James'},
      }, {name:/^[K-Z]/}),
        {
          1:{ name:'Frank'},
          2:{ name:'James'},
        }
      );
    });

    it('should pass correct arguments', function() {
      rejectValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should not modify the object', function() {
      const obj = {};
      assertEqual(obj === rejectValues(obj, 1), false);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(rejectValues({a:1}, null), {a:1});
      assertObjectEqual(rejectValues({a:1}, NaN), {a:1});
      assertError(function() { rejectValues({}); });
      assertError(function() { rejectValues(null); });
      assertError(function() { rejectValues('a'); });
      assertError(function() { rejectValues(1); });
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

    it('should pass correct arguments', function() {
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

  describeInstance('select,selectKeys', function(selectKeys) {

    it('should select by string argument', function() {
      assertObjectEqual(selectKeys({a:1,b:2}, 'a'), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, 'b'), {b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, 'c'), {});
      assertObjectEqual(selectKeys({a:1,b:2}, ''), {});
    });

    it('should select by array argument', function() {
      assertObjectEqual(selectKeys({a:1,b:2}, ['a']), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, ['a', 'b']), {a:1,b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, []), {});
      assertObjectEqual(selectKeys({a:1,b:2}, ['c']), {});
    });

    it('should select by function', function() {
      assertObjectEqual(selectKeys({a:1,b:2}, (key) => key === 'a'), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, (key) => key === 'b'), {b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, (key) => key === 'c'), {});
    });

    it('should pass correct arguments', function() {
      selectKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should select by regex', function() {
      assertObjectEqual(selectKeys({a:1,b:2}, /a/), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, /[ab]/), {a:1,b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, /c/), {});
    });

    it('should not modify the object', function() {
      const obj1 = {a:1};
      const obj2 = selectKeys(obj1, 1);
      assertFalse(obj1 === obj2);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(selectKeys({a:1}, null), {});
      assertObjectEqual(selectKeys({a:1}, NaN), {});
      assertError(function() { selectKeys(null); });
      assertError(function() { selectKeys('a'); });
      assertError(function() { selectKeys(1); });
    });

  });

  describeInstance('reject,rejectKeys', function(rejectKeys) {

    it('should reject by string argument', function() {
      assertObjectEqual(rejectKeys({a:1,b:2}, 'a'), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, 'b'), {a:1});
      assertObjectEqual(rejectKeys({a:1,b:2}, 'c'), {a:1,b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, ''), {a:1,b:2});
    });

    it('should reject by array argument', function() {
      assertObjectEqual(rejectKeys({a:1,b:2}, ['a']), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, ['a', 'b']), {});
      assertObjectEqual(rejectKeys({a:1,b:2}, []), {a:1,b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, ['c']), {a:1,b:2});
    });

    it('should reject by function', function() {
      assertObjectEqual(rejectKeys({a:1,b:2}, (key) => key === 'a'), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, (key) => key === 'b'), {a:1});
      assertObjectEqual(rejectKeys({a:1,b:2}, (key) => key === 'c'), {a:1,b:2});
    });

    it('should pass correct arguments', function() {
      rejectKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should reject by regex', function() {
      assertObjectEqual(rejectKeys({a:1,b:2}, /a/), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, /[ab]/), {});
      assertObjectEqual(rejectKeys({a:1,b:2}, /c/), {a:1,b:2});
    });

    it('should not modify the object', function() {
      const obj1 = {a:1};
      const obj2 = rejectKeys(obj1, 1);
      assertFalse(obj1 === obj2);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(rejectKeys({a:1}, null), {a:1});
      assertObjectEqual(rejectKeys({a:1}, NaN), {a:1});
      assertError(function() { rejectKeys(null); });
      assertError(function() { rejectKeys('a'); });
      assertError(function() { rejectKeys(1); });
    });

  });

  describeInstance('remove,removeKeys', function(removeKeys) {

    it('should remove by string argument', function() {
      assertObjectEqual(removeKeys({a:1,b:2}, 'a'), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, 'b'), {a:1});
      assertObjectEqual(removeKeys({a:1,b:2}, 'c'), {a:1,b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, ''), {a:1,b:2});
    });

    it('should remove by array argument', function() {
      assertObjectEqual(removeKeys({a:1,b:2}, ['a']), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, ['a', 'b']), {});
      assertObjectEqual(removeKeys({a:1,b:2}, []), {a:1,b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, ['c']), {a:1,b:2});
    });

    it('should remove by function', function() {
      assertObjectEqual(removeKeys({a:1,b:2}, (key) => key === 'a'), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, (key) => key === 'b'), {a:1});
      assertObjectEqual(removeKeys({a:1,b:2}, (key) => key === 'c'), {a:1,b:2});
    });

    it('should pass correct arguments', function() {
      removeKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should remove by regex', function() {
      assertObjectEqual(removeKeys({a:1,b:2}, /a/), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, /[ab]/), {});
      assertObjectEqual(removeKeys({a:1,b:2}, /c/), {a:1,b:2});
    });

    it('should modify the object', function() {
      const obj1 = {a:1};
      const obj2 = removeKeys(obj1, 1);
      assertTrue(obj1 === obj2);
    });

    it('should handle irregular input', function() {
      assertObjectEqual(removeKeys({a:1}, null), {a:1});
      assertObjectEqual(removeKeys({a:1}, NaN), {a:1});
      assertError(function() { removeKeys(null); });
      assertError(function() { removeKeys('a'); });
      assertError(function() { removeKeys(1); });
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

    it('should pass correct arguments', function() {
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

  describeInstance('reduce', function(reduce) {

    it('should accumulate the result of the passed function', function() {
      assertEqual(reduce({a:1}, () => 1), 1);
      assertEqual(reduce({a:1,b:2,c:3}, () => 1), 1);
    });

    it('should be able to perform basic sum', function() {
      assertEqual(reduce({a:1,b:2,c:3}, (acc, key, val) => acc + val), 6);
      assertEqual(reduce({a:1,b:2,c:3}, (acc, key, val) => acc + val, 0), 6);
    });

    it('should have correct arguments when no initial value passed', function() {
      reduce({a:1,b:2}, (acc, key, val, obj) => {
        assertEqual(acc, 1);
        assertEqual(key, 'b');
        assertEqual(val, 2);
        assertObjectEqual(obj, {a:1,b:2});
      });
      reduce({1:{name:'John'},2:{name:'Frank'}}, (acc, key, val, obj) => {
        assertObjectEqual(acc, {name:'John'});
        assertEqual(key, '2');
        assertObjectEqual(val, {name:'Frank'});
        assertObjectEqual(obj, {1:{name:'John'},2:{name:'Frank'}});
      });
    });

    it('should have correct arguments when initial value passed', function() {
      reduce({a:1}, (acc, key, val, obj) => {
        assertEqual(acc, 2);
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      }, 2);
      reduce({1:{name:'John'}}, (acc, key, val, obj) => {
        assertObjectEqual(acc, {name:'Frank'});
        assertEqual(key, '1');
        assertObjectEqual(val, {name:'John'});
        assertObjectEqual(obj, {1:{name:'John'}});
      }, {name:'Frank'});
    });

    it('should correctly iterate when initial value is undefined', function() {
      reduce({a:1}, (acc) => {
        assertEqual(acc, undefined);
      }, undefined);
    });

    it('should error when object empty and no initial value', function() {
      assertError(() => { reduce({}, () => {}) }, TypeError);
    });
  });

  describeInstance('isEmpty', function(isEmpty) {

    it('should report true for empty objects', function() {
      assertTrue(isEmpty({}));
    });

    it('should report false for non-empty objects', function() {
      assertFalse(isEmpty({a:1}));
      assertFalse(isEmpty({a:null}));
      assertFalse(isEmpty({a:undefined}));
    });

    it('should work correctly on class instances', function() {
      function Foo(a) {
        if (a) {
          this.a = a;
        }
      }
      assertTrue(isEmpty(new Foo));
      assertFalse(isEmpty(new Foo(1)));
    });

    it('should handle irregular input', function() {
      assertError(() => { isEmpty(null); });
      assertError(() => { isEmpty('8'); });
      assertError(() => { isEmpty(8); });
    });

  });

  describeInstance('size', function(size) {

    it('should report correct size of objects', function() {
      assertEqual(size({}), 0);
      assertEqual(size({a:1}), 1);
      assertEqual(size({a:1,b:2,c:3}), 3);
      assertEqual(size({a:null}), 1);
      assertEqual(size({a:undefined}), 1);
    });

    it('should work correctly on class instances', function() {
      function Foo(a) {
        if (a) {
          this.a = a;
        }
      }
      assertEqual(size(new Foo), 0);
      assertEqual(size(new Foo(1)), 1);
    });

    it('should handle irregular input', function() {
      assertError(() => { size(null); });
      assertError(() => { size('8'); });
      assertError(() => { size(8); });
    });

  });

  describeInstance('isEqual', function(isEqual) {

    it('should handle primitives', function() {
      assertEqual(isEqual(1, 1), true);
      assertEqual(isEqual(1, 2), false);
      assertEqual(isEqual(2, 1), false);
      assertEqual(isEqual('a', 'a'), true);
      assertEqual(isEqual('a', 'b'), false);
      assertEqual(isEqual('b', 'a'), false);
      assertEqual(isEqual(true, true), true);
      assertEqual(isEqual(true, false), false);
      assertEqual(isEqual(false, true), false);
    });

    it('should handle irregular primitive cases', function() {
      assertEqual(isEqual(0, 0), true);
      assertEqual(isEqual(-0, -0), true);
      assertEqual(isEqual(-0, 0), false);
      assertEqual(isEqual(0, -0), false);
      assertEqual(isEqual(NaN, NaN), true);
      assertEqual(isEqual(Infinity, Infinity), true);
      assertEqual(isEqual(-Infinity, -Infinity), true);
      assertEqual(isEqual(Infinity, -Infinity), false);
      assertEqual(isEqual(-Infinity, Infinity), false);
      assertEqual(isEqual(Infinity, NaN), false);
      assertEqual(isEqual(NaN, Infinity), false);
      assertEqual(isEqual(null, null), true);
      assertEqual(isEqual(null, undefined), false);
      assertEqual(isEqual(undefined, null), false);
      assertEqual(isEqual(undefined, undefined), true);
    });

    it('should function as expected with insufficient arguments', function() {
      assertEqual(isEqual(), true);
      assertEqual(isEqual(undefined), true);
      assertEqual(isEqual(null), false);
      assertEqual(isEqual(''), false);
      assertEqual(isEqual(NaN), false);
      assertEqual(isEqual(0), false);
    });

    it('should distinguish primitives from wrapped counterparts', function() {
      assertEqual(isEqual(new String('a'), new String('a')), true);
      assertEqual(isEqual('a', new String('a')), false);
      assertEqual(isEqual(new String('a'), 'a'), false);
      assertEqual(isEqual(new String('a'), new String('b')), false);
      assertEqual(isEqual(new String('a'), { toString: () => 'a' }), false);

      assertEqual(isEqual(new Number(1), new Number(1)), true);
      assertEqual(isEqual(1, new Number(1)), false);
      assertEqual(isEqual(new Number(1), 1), false);
      assertEqual(isEqual(new Number(1), new Number(2)), false);
      assertEqual(isEqual(new Number(1), { valueOf: () => 1 }), false);

      assertEqual(isEqual(new Boolean, new Boolean), true);
      assertEqual(isEqual(true, new Boolean(true)), false);
      assertEqual(isEqual(new Boolean(true), true), false);
      assertEqual(isEqual(new Boolean(true), new Boolean(false)), false);
    });

    it('should distinguish common type coercions', function() {
      assertEqual(isEqual('1', 1), false);
      assertEqual(isEqual(1, '1'), false);
      assertEqual(isEqual(new Number(1), new String(1)), false);
      assertEqual(isEqual(new String(1), new Number(1)), false);
      assertEqual(isEqual('', false), false);
      assertEqual(isEqual(false, ''), false);
      assertEqual(isEqual(0, ''), false);
      assertEqual(isEqual('', 0), false);
      assertEqual(isEqual(0, false), false);
      assertEqual(isEqual(false, 0), false);
      assertEqual(isEqual(1, true), false);
      assertEqual(isEqual(true, 1), false);
      assertEqual(isEqual(1599470036490, new Date(1599470036490)), false);
      assertEqual(isEqual(new Date(1599470036490), 1599470036490), false);
    });

    it('should handle plain objects', function() {
      assertEqual(isEqual({}, {}), true);
      assertEqual(isEqual({a:1}, {a:1}), true);
      assertEqual(isEqual({a:1}, {a:2}), false);
      assertEqual(isEqual({a:1,b:2}, {a:1,b:2}), true);
      assertEqual(isEqual({a:1,b:2}, {a:1}), false);
      assertEqual(isEqual({b:2}, {a:1,b:2}), false);
    });

    it('should distinguish missing keys', function() {
      assertEqual(isEqual({a:undefined}, {}), false);
      assertEqual(isEqual({}, {a:undefined}), false);
    });

    it('should distinguish object types', function() {
      assertEqual(isEqual([], {}), false);
      assertEqual(isEqual({}, []), false);
      assertEqual(isEqual([{}], [{}]), true);
      assertEqual(isEqual([[]], [[]]), true);
      assertEqual(isEqual([[]], [{}]), false);
      assertEqual(isEqual([{}], [[]]), false);
      assertEqual(isEqual(new Set(), {}), false);
      assertEqual(isEqual(new Map(), {}), false);
      assertEqual(isEqual({length:0}, []), false);
      assertEqual(isEqual([], {length:0}), false);
    });

    it('should handle object references', function() {
      const obj1 = {a:1};
      const obj2 = {a:1};
      assertEqual(isEqual({a:obj1,b:obj1}, {a:obj1,b:obj1}), true);
      assertEqual(isEqual({a:obj2,b:obj1}, {a:obj1,b:obj1}), true);
      assertEqual(isEqual({a:obj1,b:obj2}, {a:obj1,b:obj1}), true);
      assertEqual(isEqual({a:obj1,b:obj1}, {a:obj2,b:obj1}), true);
      assertEqual(isEqual({a:obj1,b:obj1}, {a:obj1,b:obj2}), true);
    });

    it('should handle cyclic references', function() {
      const obj1 = {};
      const obj2 = {};
      obj1.a = obj1;
      obj2.a = obj2;
      assertEqual(isEqual({a:obj1}, {a:obj1}), true);
      assertEqual(isEqual({a:obj1}, {a:obj2}), false);

      const arr1 = [];
      const arr2 = [];
      arr1.push(arr1);
      arr2.push(arr2);
      assertEqual(isEqual([arr1], [arr1]), true);
      assertEqual(isEqual([arr1], [arr2]), false);
    });

    it('should complex nested objects', function() {
      assertEqual(isEqual({
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }, {
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }), true);
      assertEqual(isEqual({
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }, {
        obj: {
          a: 'b',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }), false);
      assertEqual(isEqual({
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }, {
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','a','c'],
        }
      }), false);
      assertEqual(isEqual({
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 1),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }, {
        obj: {
          a: 'a',
          b: 1,
          c: true,
          d: new Date(2000, 0, 2),
          e: new String('a'),
          f: ['a','b','c'],
        }
      }), false);
    });

    it('should function as expected for arrays', function() {
      assertEqual(isEqual([], []), true);
      assertEqual(isEqual([], [1]), false);
      assertEqual(isEqual([1], []), false);
      assertEqual(isEqual([1], [1]), true);
      assertEqual(isEqual([1], [2]), false);
      assertEqual(isEqual([1], ['1']), false);
      assertEqual(isEqual([1,2,3], [1,2,3]), true);
      assertEqual(isEqual([1,2,3], [1,2,4]), false);
      assertEqual(isEqual([1], {0:1,length:1}), false);
      assertEqual(isEqual([1,'a',{a:1}], [1,'a',{a:1}]), true);
      assertEqual(isEqual([1,'a',{a:1}], [1,'a',{a:2}]), false);
      assertEqual(isEqual([1,'a',{a:1}], [1,'b',{a:1}]), false);
    });

    it('should handle object references inside arrays', function() {
      const obj1 = {a:1};
      const obj2 = {a:2};
      assertEqual(isEqual([obj1, obj2], [obj1, obj2]), true);
      assertEqual(isEqual([obj1, obj2], [obj2, obj1]), false);
      assertEqual(isEqual([obj1, obj2], [obj1]), false);
      assertEqual(isEqual([obj1], [obj1, obj2]), false);
    });

    it('should distinguish arrays and arguments', function() {
      const args1 = (function() {
        return arguments;
      })('a','b','c');
      const args2 = (function() {
        return arguments;
      })('a','b','c');
      assertEqual(isEqual(args1, args2), true);
      assertEqual(isEqual(['a','b','c'], args1), false);
      assertEqual(isEqual(args1, ['a','b','c']), false);
    });

    it('should handle irregular array cases', function() {
      assertEqual(isEqual([], {}), false);
      assertEqual(isEqual([0], [0]), true);
      assertEqual(isEqual([undefined], [undefined]), true);
      assertEqual(isEqual([null], [null]), true);
      assertEqual(isEqual([NaN], [NaN]), true);
    });

    it('should distinguish sparse and dense arrays', function() {
      assertEqual(isEqual(new Array(3), new Array(3)), true);
      assertEqual(isEqual(new Array(3), new Array(6)), false);
      assertEqual(isEqual(new Array(6), new Array(3)), false);
      assertEqual(isEqual([,1], [undefined,1]), false);
    });

    it('should function as expected for dates', function() {
      assertEqual(isEqual(new Date(2020, 8, 7), new Date(2020, 8, 7)), true);
      assertEqual(isEqual(new Date(2020, 8, 7), new Date(2020, 8, 8)), false);
      assertEqual(isEqual(new Date(2020, 8, 7), new Date(2020, 8, 7, 0, 0, 0, 1)), false);
      assertEqual(isEqual(new Date(1599470036490), { getTime: () => 1599470036490 }), false);
      assertEqual(isEqual({ getTime: () => 1599470036490 }, new Date(1599470036490)), false);
      assertEqual(isEqual(new Date('Invalid'), new Date('Invalid')), true);
    });

    it('should function as expected for functions', function() {
      const fn1 = () => {};
      const fn2 = () => {};
      assertEqual(isEqual(fn1, fn1), true);
      assertEqual(isEqual(fn1, fn2), false);
      assertEqual(isEqual(fn2, fn1), false);
    });

    it('should function as expected for regexes', function() {
      assertEqual(isEqual(/a/, /a/), true);
      assertEqual(isEqual(/a/, /a/i), false);
      assertEqual(isEqual(/a/i, /a/), false);
      assertEqual(isEqual(/a/gim, /a/gim), true);
      assertEqual(isEqual(/a/gim, /b/gim), false);
      assertEqual(isEqual(/b/gim, /a/gim), false);
    });

    it('should function as expected for class instances', function() {
      function Foo(val) {
        this.value = val;
      }
      assertEqual(isEqual(new Foo, new Foo), false);
      assertEqual(isEqual({value: 1}, new Foo(1)), false);
      assertEqual(isEqual(new Foo(1), {value: 1}), false);
    });

    it('should function as expected for sets', function() {
      assertEqual(isEqual(new Set([1]), new Set([1])), true);
      assertEqual(isEqual(new Set([1]), new Set([2])), false);
      assertEqual(isEqual(new Set([2]), new Set([1])), false);
    });

    it('should function as expected for maps', function() {
      assertEqual(isEqual(new Map([[1,1]]), new Map([[1,1]])), true);
      assertEqual(isEqual(new Map([[1,1]]), new Map([[1,2]])), false);
      assertEqual(isEqual(new Map([[1,2]]), new Map([[1,1]])), false);
    });

    it('should function as expected for typed arrays', function() {
      assertEqual(isEqual([1], Uint8Array.from(1)), false);
      assertEqual(isEqual(Uint8Array.from(1), [1]), false);
      assertEqual(isEqual(Int8Array.from(1), Int8Array.from(1)), true);
      assertEqual(isEqual(Int8Array.from(1), Uint8Array.from(1)), false);
      assertEqual(isEqual(Int16Array.from(1), Int32Array.from(1)), false);
      assertEqual(isEqual(Int32Array.from(1), Int16Array.from(1)), false);
      assertEqual(isEqual(Float32Array.from(1), Float32Array.from(1)), true);
      assertEqual(isEqual(Float32Array.from(1), Float64Array.from(1)), false);
      assertEqual(isEqual(Float64Array.from(1), Float32Array.from(1)), false);
    });

    it('should only return true for symbols by reference', function() {
      const sym = Symbol('a');
      assertEqual(isEqual(sym, sym), true);
      assertEqual(isEqual(Symbol('a'), Symbol('a')), false);
      assertEqual(isEqual(Object(sym), sym), false);
      assertEqual(isEqual(Object(sym), Object(sym)), false);
    });

    it('should function as expected for errors', function() {
      assertEqual(isEqual(new Error, new Error), true);
      assertEqual(isEqual(new Error('a'), new Error('a')), true);
      assertEqual(isEqual(new TypeError('a'), new TypeError('a')), true);
      assertEqual(isEqual(new Error, new TypeError), false);
      assertEqual(isEqual(new TypeError, new Error), false);
    });

    it('should function as expected with overwritten isEqual', function() {
      assertEqual(isEqual({}, {
        isEqual: () => true,
      }), false);
    });

  });

  describeInstance('intersect', function(intersect) {

    it('should intersect with second value', function() {
      assertObjectEqual(intersect({a:1}, {a:1}), {a:1});
      assertObjectEqual(intersect({a:1}, {a:2}), {a:2});
      assertObjectEqual(intersect({a:1}, {a:2,b:2}), {a:2});
      assertObjectEqual(intersect({a:1,b:2}, {a:2}), {a:2});
      assertObjectEqual(intersect({a:1,b:2}, {a:2,b:2}), {a:2,b:2});
      assertObjectEqual(intersect({a:1}, {}), {});
      assertObjectEqual(intersect({}, {a:1}), {});
      assertObjectEqual(intersect({}, {}), {});
    });

    it('should intersect with resolver', function() {
      function add(key, n1, n2) {
        return n1 + n2;
      }
      assertObjectEqual(intersect({a:1}, {a:1}, add), {a:2});
      assertObjectEqual(intersect({a:1,b:2}, {b:2,c:3}, add), {b:4});
      assertObjectEqual(intersect({}, {}, add), {});
    });

    it('should pass correct arguments to resolver', function() {
      intersect({a:1}, {a:2}, (key, val1, val2, obj1, obj2) => {
        assertEqual(key, 'a');
        assertEqual(val1, 1);
        assertEqual(val2, 2);
        assertObjectEqual(obj1, {a:1});
        assertObjectEqual(obj2, {a:2});
      });
    });

    it('should handle irregular input', function() {
      assertError(() => {
        intersect();
      });
      assertError(() => {
        intersect({});
      });
      assertError(() => {
        intersect(null, {});
      });
    });
  });

  describeInstance('subtract', function(subtract) {

    it('should correctly subtract on primitive values', function() {
      assertObjectEqual(subtract({a:1}, {a:1}), {});
      assertObjectEqual(subtract({a:1}, {a:1,b:2}), {});
      assertObjectEqual(subtract({a:1,b:2}, {a:1}), {b:2});
      assertObjectEqual(subtract({a:1,b:2}, {a:1,b:2}), {});
      assertObjectEqual(subtract({a:1}, {a:2}), {a:1});
      assertObjectEqual(subtract({a:1}, {}), {a:1});
      assertObjectEqual(subtract({}, {a:1}), {});
      assertObjectEqual(subtract({}, {}), {});
    });

    it('should correctly subtract on nested objects', function() {
      assertObjectEqual(subtract({a:{b:1}}, {a:{b:1}}), {});
      assertObjectEqual(subtract({a:{b:1}}, {a:{b:2}}), {a:{b:1}});
      assertObjectEqual(subtract({a:{b:2}}, {a:{b:1}}), {a:{b:2}});
      assertObjectEqual(subtract({a:{b:1}}, {a:{b:1,c:1}}), {a:{b:1}});
      assertObjectEqual(subtract({a:{b:1,c:1}}, {a:{b:1}}), {a:{b:1,c:1}});
      assertObjectEqual(subtract({a:{b:1},c:{b:2}}, {a:{b:1}}), {c:{b:2}});
    });

    it('should correctly subtract on function references', function() {
      const fn1 = () => {};
      const fn2 = () => {};
      assertObjectEqual(subtract({a:{b:fn1}}, {a:{b:fn1}}), {});
      assertObjectEqual(subtract({a:{b:fn1}}, {a:{b:fn2}}), {a:{b:fn1}});
      assertObjectEqual(subtract({a:{b:fn2}}, {a:{b:fn1}}), {a:{b:fn2}});
    });

    it('should distinguish non-equivalent values', function() {
      assertObjectEqual(subtract({a:null}, {a:null}), {});
      assertObjectEqual(subtract({a:null}, {a:undefined}), {a:null});
      assertObjectEqual(subtract({a:undefined}, {a:null}), {a:undefined});
      assertObjectEqual(subtract({a:0}, {a:'0'}), {a:0});
      assertObjectEqual(subtract({a:0}, {a:null}), {a:0});
      assertObjectEqual(subtract({a:0}, {a:false}), {a:0});
      assertObjectEqual(subtract({a:0}, {a:undefined}), {a:0});
      assertObjectEqual(subtract({a:0}, {a:''}), {a:0});
      assertObjectEqual(subtract({a:''}, {a:null}), {a:''});
      assertObjectEqual(subtract({a:''}, {a:false}), {a:''});
      assertObjectEqual(subtract({a:''}, {a:undefined}), {a:''});
    });

    it('should handle irregular input', function() {
      assertError(() => {
        subtract();
      });
      assertError(() => {
        subtract({});
      });
      assertError(() => {
        subtract(null, {});
      });
    });
  });

  describeInstance('merge', function(merge) {

    it('should merge with no collisions', function() {
      assertObjectEqual(merge({a:1}, {b:2}), {a:1,b:2});
      assertObjectEqual(merge({a:2}, {b:1}), {a:2,b:1});
      assertObjectEqual(merge({a:1}, {}), {a:1});
      assertObjectEqual(merge({}, {a:1}), {a:1});
      assertObjectEqual(merge({}, {}), {});
    });

    it('should merge with collisions', function() {
      assertObjectEqual(merge({a:1}, {a:1}), {a:1});
      assertObjectEqual(merge({a:1}, {a:2}), {a:2});
      assertObjectEqual(merge({a:1}, {a:1,b:2}), {a:1,b:2});
      assertObjectEqual(merge({a:1,b:2}, {a:1}), {a:1,b:2});
      assertObjectEqual(merge({a:1,b:2}, {a:1,b:2}), {a:1,b:2});
      assertObjectEqual(merge({a:1}, {a:[1]}), {a:[1]});
      assertObjectEqual(merge({a:1}, {a:{b:1}}), {a:{b:1}});
    });

    it('should deeply merge plain objects', function() {
      assertObjectEqual(merge({a:{a:1}}, {a:{}}), {a:{a:1}});
      assertObjectEqual(merge({a:{}}, {a:{a:1}}), {a:{a:1}});
      assertObjectEqual(merge({a:{a:1}}, {a:{a:2}}), {a:{a:2}});
      assertObjectEqual(merge({a:{a:1}}, {a:{b:2}}), {a:{a:1,b:2}});
      assertObjectEqual(
        merge({a:{a:{a:{a:1}}}}, {a:{a:{a:{b:2}}}}),
        {a:{a:{a:{a:1,b:2}}}}
      );
    });

    it('should not deeply merge arrays', function() {
      assertObjectEqual(merge({a:[]}, {a:[1]}), {a:[1]});
      assertObjectEqual(merge({a:[1,2,3]}, {a:[4,5,6]}), {a:[4,5,6]});
    });

    it('should not deeply merge known built-in types', function() {
      assertObjectEqual(merge({a:/a/}, {a:/b/}), {a:/b/});
      assertObjectEqual(
        merge(
          {a:new Date(2020, 9, 11)},
          {a:new Date(2020, 9, 12)},
        ),
        {a:new Date(2020, 9, 12)},
      );
      assertObjectEqual(
        merge(
          {a:new Set([1,2,3])},
          {a:new Set([1,2,4])},
        ),
        {a:new Set([1,2,4])},
      );
      assertObjectEqual(
        merge(
          {a:new Map([[1,2]])},
          {a:new Map([[1,3]])},
        ),
        {a:new Map([[1,3]])},
      );
    });

    it('should merge falsy values', function() {
      assertObjectEqual(merge({a:1}, {a:null}), {a:null});
      assertObjectEqual(merge({a:1}, {a:undefined}), {a:undefined});
      assertObjectEqual(merge({a:1}, {a:0}), {a:0});
      assertObjectEqual(merge({a:1}, {a:''}), {a:''});
      assertObjectEqual(merge({a:1}, {a:false}), {a:false});
    });

    it('should modify the object', function() {
      const obj = {a:1};
      const result = merge(obj, {b:2});
      assertObjectEqual(result, {a:1,b:2});
      assertEqual(result, obj);
    });

    it('should modify deeply merged objects', function() {
      const obj = {a:{a:1}};
      const a = obj.a;
      const result = merge(obj, {a:{b:2}});
      assertObjectEqual(result, {a:{a:1,b:2}});
      assertEqual(result.a, a);
    });

    it('should be able to merge from multiple sources', function() {
      assertObjectEqual(merge({a:1},{b:2},{c:3},{d:4}), {a:1,b:2,c:3,d:4});
    });

    it('should be able to merge from multiple sources with a resolver', function() {
      assertObjectEqual(merge({a:1},{a:2},{a:3},{a:4}, (key, n1, n2) => {
        return n1 + n2;
      }), {a:10});
    });

    it('should merge with resolver', function() {
      function add(key, n1, n2) {
        return n1 + n2;
      }
      assertObjectEqual(merge({a:1}, {a:1}, add), {a:2});
      assertObjectEqual(merge({a:1,b:2}, {b:2,c:3}, add), {a:1,b:4,c:3});
      assertObjectEqual(merge({}, {}, add), {});
    });

    it('should take resolver value and not continue deep merge', function() {
      assertObjectEqual(merge({a:{a:1}}, {a:{a:2}}, () => {
        return { a: 3 };
      }), {a:{a:3}});
    });

    it('should handle normally when resolver returns undefined', function() {
      assertObjectEqual(merge({a:{a:1}}, {a:{b:2}}, () => {}), {a:{a:1,b:2}});
    });

    it('should merge complex with resolver', function() {
      assertObjectEqual(
        merge({
          likes: 9,
          posts: [1,2,3],
          profile: {
            firstName: 'Bob',
          }
        }, {
          likes: 3,
          posts: [4,5,6],
          profile: {
            lastName: 'Johnson',
          }
        }, (key, a, b) => {
          if (key === 'likes') {
            return a + b;
          } else if (key === 'posts') {
            return a.concat(b);
          }
        }),
        {
          likes: 12,
          posts: [1,2,3,4,5,6],
          profile: {
            firstName: 'Bob',
            lastName: 'Johnson',
          }
        });
    });

    it('should pass correct arguments to resolver', function() {
      merge({a:1}, {a:2}, (key, val1, val2, obj1, obj2) => {
        assertEqual(key, 'a');
        assertEqual(val1, 1);
        assertEqual(val2, 2);
        assertObjectEqual(obj1, {a:1});
        assertObjectEqual(obj2, {a:2});
      });
    });

    it('should merge objects with null prototypes', function() {
      assertObjectEqual(
        merge(
          Object.create(null, {
            a: {
              value: 1,
              enumerable: true,
            }
          }),
          Object.create(null, {
            b: {
              value: 2,
              enumerable: true,
            }
          }),
        ),
        {a:1, b:2}
      );
    });

    it('should not merge non-enumerable properties', function() {
      assertObjectEqual(
        merge(
          Object.create(null, {
            a: {
              value: 1,
              enumerable: true,
            }
          }),
          Object.create(null, {
            b: {
              value: 2,
              enumerable: false,
            }
          }),
        ),
        {a:1}
      );
    });

    it('should merge enumerable getters by value', function() {
      const result = merge(
        Object.create(null, {
          a: {
            value: 1,
            enumerable: true,
          }
        }),
        Object.create(null, {
          b: {
            get: () => {
              return 2;
            },
            enumerable: true,
          }
        }),
      );
      assertObjectEqual(Object.getOwnPropertyDescriptor(result, 'b'), {
        value: 2,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    it('should not merge inherited properties', function() {
      const obj = Object.create({c:3}, {
        b: {
          enumerable: true,
          value: 2,
        }
      });
      const result = merge({a:1}, obj);
      assertObjectEqual(result, {a:1,b:2});
    });

    it('should raise an error on arrays', function() {
      assertError(() => {
        merge({}, []);
      }, TypeError);
      assertError(() => {
        merge([], {});
      }, TypeError);
    });

    it('should raise an error for class instances', function() {
      function Foo() {}
      assertError(() => {
        merge(new Foo, new Foo);
      }, TypeError);
      assertError(() => {
        merge({}, new Foo);
      }, TypeError);
      assertError(() => {
        merge(new Foo, {});
      }, TypeError);
    });

    it('should merge enumerable symbols', function() {
      const sym1 = Symbol(1);
      const sym2 = Symbol(2);
      const obj = {};
      Object.defineProperty(obj, sym1, {
        value: 1,
        enumerable: true,
      });
      Object.defineProperty(obj, sym2, {
        value: 2,
        enumerable: false,
      });
      const result = merge({}, obj);
      assertEqual(result[sym1], 1);
      assertFalse(sym2 in result);
    });

    it('should raise an error for built-in objects', function() {
      assertError(() => {
        merge(/a/, /b/);
      }, TypeError);
      assertError(() => {
        merge(new Date(), new Date());
      }, TypeError);
      assertError(() => {
        merge(new Set(), new Set());
      }, TypeError);
      assertError(() => {
        merge(new Map(), new Map());
      }, TypeError);
    });

    it('should raise an error cyclic objects', function() {
      assertError(() => {
        const obj = {};
        obj.a = obj;
        merge(obj, obj);
      }, TypeError);
    });

    it('should handle Issue #335', function() {
      assertObjectEqual(merge({a:{b:1}}, {a:{b:2,c:3}}, (key, tVal) => {
        if (key === 'b') {
          return tVal;
        }
      }), {a:{b:1,c:3}});
    });

    it('should handle Issue #365', function() {
      assertObjectEqual(merge({a:''}, {a:{b:1}}), {a:{b:1}});
      assertObjectEqual(merge({a:'1'}, {a:{b:1}}), {a:{b:1}});
    });

    it('should handle irregular input', function() {
      assertObjectEqual(merge({}), {});
      assertError(() => {
        merge();
      });
      assertError(() => {
        merge(null, {});
      });
      assertError(() => {
        merge(null, null);
      });
      assertError(() => {
        merge(null, 5);
      });
    });
  });

  describeInstance('clone', function(clone) {

    it('should create a copy of the object', function() {
      const obj = {};
      assertFalse(clone(obj) === obj);
    });

    it('should not create a deep copy of the object', function() {
      const obj = {};
      assertTrue(clone({a:obj}).a === obj);
    });

    it('should clone basic primitive properties', function() {
      assertObjectEqual(clone({}), {});
      assertObjectEqual(clone({a:1,b:0}), {a:1,b:0});
      assertObjectEqual(clone({a:'a',b:''}), {a:'a',b:''});
      assertObjectEqual(clone({a:true,b:false}), {a:true,b:false});
    });

    it('should clone falsy values', function() {
      assertEqual(clone(null), null);
      assertEqual(clone(undefined), undefined);
      assertEqual(clone(NaN), NaN);
    });

    it('should clone nested falsy values', function() {
      assertObjectEqual(clone({a:null}), {a:null});
      assertObjectEqual(clone({a:undefined}), {a:undefined});
      assertObjectEqual(clone({a:0}), {a:0});
      assertObjectEqual(clone({a:''}), {a:''});
      assertObjectEqual(clone({a:false}), {a:false});
    });

    it('should clone objects with null prototypes', function() {
      assertObjectEqual(
        clone(
          Object.create(null, {
            a: {
              value: 1,
              enumerable: true,
            }
          }),
        ),
        {a:1}
      );
    });

    it('should clone non-enumerable properties', function() {
      const result = clone(
        Object.create(null, {
          a: {
            value: 1,
            enumerable: false,
          }
        }),
      );
      assertEqual(result.a, 1);
    });

    it('should clone enumerable getters', function() {
      const result = clone(
        Object.create(null, {
          a: {
            get: () => {
              return 1;
            },
            enumerable: true,
          }
        }),
      );
      assertEqual(result.a, 1);
      assertTrue('get' in Object.getOwnPropertyDescriptor(result, 'a'));
    });

    it('should clone non-enumerable getters', function() {
      const result = clone(
        Object.create(null, {
          a: {
            get: () => {
              return 1;
            },
            enumerable: false,
          }
        }),
      );
      assertEqual(result.a, 1);
      assertTrue('get' in Object.getOwnPropertyDescriptor(result, 'a'));
    });

    it('should clone inherited properties', function() {
      const obj = Object.create({b:2}, {
        a: {
          enumerable: true,
          value: 1,
        }
      });
      const result = clone(obj);
      assertObjectEqual(result, {a:1});
      assertTrue('b' in result);
    });

    it('should clone arrays', function() {
      assertArrayEqual(clone([]), []);
      assertArrayEqual(clone([1,2,3]), [1,2,3]);
      assertArrayEqual(clone([null]), [null]);
      assertArrayEqual(clone([undefined]), [undefined]);
    });

    it('should clone typed arrays', function() {
      assertArrayEqual(clone(new Int8Array([1,2,3])), new Int8Array([1,2,3]));
      assertArrayEqual(clone(new Int16Array([1,2,3])), new Int16Array([1,2,3]));
      assertArrayEqual(clone(new Int32Array([1,2,3])), new Int32Array([1,2,3]));
      assertArrayEqual(clone(new Float32Array([1,2,3])), new Float32Array([1,2,3]));
      assertArrayEqual(clone(new Float64Array([1,2,3])), new Float64Array([1,2,3]));
      assertArrayEqual(clone(new ArrayBuffer(8)), new ArrayBuffer(8));
    });

    it('should clone dates', function() {
      assertDateEqual(clone(new Date(2020, 8, 13)), new Date(2020, 8, 13));
      assertDateEqual(clone(new Date(NaN)), new Date(NaN));
    });

    it('should clone regexes', function() {
      assertRegExpEqual(clone(/a/), /a/);
      assertRegExpEqual(clone(/a/gi), /a/gi);
    });

    it('should clone sets', function() {
      assertObjectEqual(clone(new Set()), new Set());
      assertObjectEqual(clone(new Set([1,2])), new Set([1,2]));
    });

    it('should clone maps', function() {
      assertObjectEqual(clone(new Map()), new Map());
      assertObjectEqual(clone(new Map([[1,2]])), new Map([[1,2]]));
    });

    it('should clone wrapped primitives', function() {
      assertObjectEqual(clone(new String('a')), new String('a'));
      assertObjectEqual(clone(new Number(5)), new Number(5));
      assertObjectEqual(clone(new Boolean(true)), new Boolean(true));
    });

    it('should throw an error on functions', function() {
      assertError(() => {
        clone(function() {});
      });
    });

    it('should throw an error on Arguments', function() {
      assertError(() => {
        (function() {
          clone(arguments);
        })();
      });
    });

    it('should throw an error on Symbol', function() {
      assertError(() => {
        clone(Symbol());
      });
    });

    it('should throw an error on WeakSet', function() {
      assertError(() => {
        clone(new WeakSet());
      });
    });

    it('should throw an error on WeakMap', function() {
      assertError(() => {
        clone(new WeakMap());
      });
    });

    it('should throw an error on errors', function() {
      assertError(() => {
        clone(new Error);
      });
      assertError(() => {
        clone(new TypeError);
      });
      assertError(() => {
        clone(new RangeError);
      });
    });

    it('should throw an error for class instances', function() {
      function Foo() {}
      assertError(() => {
        clone(new Foo);
      }, TypeError);
    });

  });

  describeInstance('has', function(has) {

    it('should find shallow properties with a string', () => {
      assertEqual(has({a:1}, 'a'), true);
      assertEqual(has({a:1}, 'b'), false);
      assertEqual(has({a:[1,2]}, 'a'), true);
    });

    it('should find deep properties with an array path', () => {
      assertEqual(has({a:{b:1}}, ['a', 'b']), true);
    });

    it('should find deep properties with dot syntax', () => {
      assertEqual(has({a:{b:1}}, 'a.b'), true);
      assertEqual(has({a:{b:1}}, 'a.c'), false);
      assertEqual(has({a:{b:1}}, '.'), false);
    });

    it('should find deep properties with bracket syntax', () => {
      assertEqual(has({a:{b:1}}, 'a[b]'), true);
      assertEqual(has({a:{b:1}}, 'a[c]'), false);
    });

    it('should find array elements with path', () => {
      assertEqual(has([1,2,3], [0]), true);
      assertEqual(has([1,2,3], ['0']), true);
      assertEqual(has({a:[1,2,3]}, ['a','1']), true);
      assertEqual(has({a:[1,2,3]}, ['a','5']), false);
      assertEqual(has({a:[{a:2}]}, ['a','0','a']), true);
      assertEqual(has({a:[{a:2}]}, ['a','5','a']), false);
    });

    it('should find array elements with dot syntax', () => {
      assertEqual(has({a:[1,2,3]}, 'a.1'), true);
      assertEqual(has({a:[1,2,3]}, 'a.5'), false);
      assertEqual(has({a:[{a:2}]}, 'a.0.a'), true);
      assertEqual(has({a:[{a:2}]}, 'a.5.a'), false);
      assertEqual(has([[[1]]], '0.0.0'), true);
    });

    it('should find array elements with bracket syntax', () => {
      assertEqual(has([1,2,3], '[0]'), true);
      assertEqual(has([1,2,3], '[4]'), false);
      assertEqual(has({a:[1,2,3]}, 'a[1]'), true);
      assertEqual(has({a:[1,2,3]}, 'a[5]'), false);
      assertEqual(has({a:[{a:2}]}, 'a[0].a'), true);
      assertEqual(has({a:[{a:2}]}, 'a[0].b'), false);
      assertEqual(has([[[1]]], '[0][0][0]'), true);
      assertEqual(has([[[{a:1}]]], '[0][0][0].a'), true);
      assertEqual(has([[[{a:1}]]], '0[0][0].a'), true);
      assertEqual(has({a:[1,2]}, 'a[0]'), true);
      assertEqual(has({a:[1,2]}, 'a[1]'), true);
      assertEqual(has({a:[1,2]}, 'a[2]'), false);
      assertEqual(has({a:[1,2]}, 'a[]'), false);
      assertEqual(has([], '[0]'), false);
    });

    it('should get array elements with negative syntax', () => {
      assertEqual(has([1,2,3], '[-1]'), true);
      assertEqual(has([1,2,3], '[-2]'), true);
      assertEqual(has([1,2,3], '[-3]'), true);
      assertEqual(has([1,2,3], '[-4]'), false);
      assertEqual(has([[1,2,3]], '[0][-1]'), true);
      assertEqual(has([[[1,2,3]]], '[0][0][-1]'), true);
      assertEqual(has([[[1,2,3]]], '0.0.-1'), true);
      assertEqual(has({a:[1,2]}, 'a.-1'), true);
      assertEqual(has({a:[1,2]}, 'a.-2'), true);
      assertEqual(has({a:[1,2]}, 'a.-3'), false);
      assertEqual(has({a:[1,2]}, 'a[-1]'), true);
      assertEqual(has({a:[1,2]}, 'a[-2]'), true);
      assertEqual(has({a:[1,2]}, 'a[-3]'), false);
      assertEqual(has([[[{a:1}]]], '[-1][-1][-1].a'), true);
    });

    it('should return false when deep path does not exist', () => {
      assertEqual(has({a:1}, ['a','b','c','d']), false);
      assertEqual(has({a:1}, 'a.b.c.d'), false);
      assertEqual(has({a:1}, 'a[b][c][d]'), false);
    });

    it('should prioritize deep path over key with matching syntax', () => {
      assertEqual(has({a:{b:{c:1}},'a.b.c':2}, 'a.b.c'), true);
    });

    it('should still allow access to shadowed path', () => {
      assertEqual(has({'a.b.c':1}, ['a.b.c']), true);
    });

    it('should recognize arrays with basic syntax', () => {
      assertEqual(has([1,2,3], '[0..1]'), true);
      assertEqual(has([1,2,3], '[0..-1]'), true);
      assertEqual(has([1,2,3], '[-1..0]'), true);
      assertEqual(has([1,2,3], '[0..]'), true);
      assertEqual(has([1,2,3], '[..1]'), true);
      assertEqual(has([1,2,3], '[..]'), true);
      assertEqual(has([1,2,3], '..'), true);
    });

    it('should not find inherited properties', () => {
      const obj = Object.create({a:1});
      assertEqual(has(obj, 'a'), false);
      assertEqual(has({a:obj}, ['a','a']), false);
    });

    it('should work as expected on class instances', () => {
      function Foo() {
        this.a = 'a';
      }
      Foo.prototype.b = 'b';
      assertEqual(has(new Foo, 'a'), true);
      assertEqual(has(new Foo, 'b'), false);
    });

    it('should function as expected with an empty string', () => {
      assertEqual(has({'':1}, ''), true);
      assertEqual(has({'':{'':2}}, '.'), true);
    });

    it('should not find built-in inherited methods', () => {
      assertEqual(has([], 'forEach'), false);
    });

    it('should find a property by nested id', () => {
      assertEqual(has({users:{993425:{name:'Harry'}}}, 'users.993425.name'), true);
    });

    it('should work with hasOwnProperty overridden', () => {
      assertEqual(has({hasOwnProperty: true, a: 1}, 'a'), true);
    });

    it('should handle irregular input', () => {
      assertEqual(has({null:1}, 'null'), true);
      assertEqual(has({undefined:1}, 'undefined'), true);
      assertEqual(has(), false);
      assertEqual(has(null), false);
      assertEqual(has(undefined), false);
      assertEqual(has(null, 'a.b.c'), false);
      assertEqual(has(undefined, 'a.b.c'), false);
    });

  });

  describeInstance('get', function(get) {

    it('should get shallow properties with a string', () => {
      assertEqual(get({a:1}, 'a'), 1);
      assertEqual(get({a:1}, 'b'), undefined);
      assertArrayEqual(get({a:[1,2]}, 'a'), [1,2]);
    });

    it('should get deep properties with an array path', () => {
      assertEqual(get({a:{b:1}}, ['a', 'b']), 1);
    });

    it('should get deep properties with dot syntax', () => {
      assertEqual(get({a:{b:1}}, 'a.b'), 1);
      assertEqual(get({a:{b:1}}, 'a.c'), undefined);
      assertEqual(get({a:{b:1}}, '.'), undefined);
    });

    it('should get deep properties with bracket syntax', () => {
      assertEqual(get({a:{b:1}}, 'a[b]'), 1);
      assertEqual(get({a:{b:1}}, 'a[c]'), undefined);
    });

    it('should get array elements with path', () => {
      assertEqual(get([1,2,3], [0]), 1);
      assertEqual(get([1,2,3], ['0']), 1);
      assertEqual(get({a:[1,2,3]}, ['a','1']), 2);
      assertEqual(get({a:[1,2,3]}, ['a','5']), undefined);
      assertEqual(get({a:[{a:2}]}, ['a','0','a']), 2);
      assertEqual(get({a:[{a:2}]}, ['a','5','a']), undefined);
    });

    it('should get array elements with dot syntax', () => {
      assertEqual(get({a:[1,2,3]}, 'a.1'), 2);
      assertEqual(get({a:[1,2,3]}, 'a.5'), undefined);
      assertEqual(get({a:[{a:2}]}, 'a.0.a'), 2);
      assertEqual(get({a:[{a:2}]}, 'a.5.a'), undefined);
      assertEqual(get([[[1]]], '0.0.0'), 1);
    });

    it('should get array elements with bracket syntax', () => {
      assertEqual(get([1,2,3], '[0]'), 1);
      assertEqual(get([1,2,3], '[4]'), undefined);
      assertEqual(get({a:[1,2,3]}, 'a[1]'), 2);
      assertEqual(get({a:[1,2,3]}, 'a[5]'), undefined);
      assertEqual(get({a:[{a:2}]}, 'a[0].a'), 2);
      assertEqual(get({a:[{a:2}]}, 'a[0].b'), undefined);
      assertEqual(get([[[1]]], '[0][0][0]'), 1);
      assertEqual(get([[[{a:1}]]], '[0][0][0].a'), 1);
      assertEqual(get([[[{a:1}]]], '0[0][0].a'), 1);
      assertEqual(get({a:[1,2]}, 'a[0]'), 1);
      assertEqual(get({a:[1,2]}, 'a[1]'), 2);
      assertEqual(get({a:[1,2]}, 'a[2]'), undefined);
      assertEqual(get({a:[1,2]}, 'a[]'), undefined);
      assertEqual(get([], '[0]'), undefined);
    });

    it('should get array elements with negative syntax', () => {
      assertEqual(get([1,2,3], '[-1]'), 3);
      assertEqual(get([1,2,3], '[-2]'), 2);
      assertEqual(get([1,2,3], '[-3]'), 1);
      assertEqual(get([1,2,3], '[-4]'), undefined);
      assertEqual(get([[1,2,3]], '[0][-1]'), 3);
      assertEqual(get([[[1,2,3]]], '[0][0][-1]'), 3);
      assertEqual(get([[[1,2,3]]], '0.0.-1'), 3);
      assertEqual(get({a:[1,2]}, 'a.-1'), 2);
      assertEqual(get({a:[1,2]}, 'a.-2'), 1);
      assertEqual(get({a:[1,2]}, 'a.-3'), undefined);
      assertEqual(get({a:[1,2]}, 'a[-1]'), 2);
      assertEqual(get({a:[1,2]}, 'a[-2]'), 1);
      assertEqual(get({a:[1,2]}, 'a[-3]'), undefined);
      assertEqual(get([[[{a:1}]]], '[-1][-1][-1].a'), 1);
    });

    it('should return undefined when deep path does not exist', () => {
      assertEqual(get({a:1}, ['a','b','c','d']), undefined);
      assertEqual(get({a:1}, 'a.b.c.d'), undefined);
      assertEqual(get({a:1}, 'a[b][c][d]'), undefined);
    });

    it('should prioritize deep path over key with matching syntax', () => {
      assertEqual(get({a:{b:{c:1}},'a.b.c':2}, 'a.b.c'), 1);
    });

    it('should still allow access to shadowed path', () => {
      assertEqual(get({a:{b:{c:1}},'a.b.c':2}, ['a.b.c']), 2);
    });

    it('should allow array slices to be returned with range syntax', () => {
      assertArrayEqual(get([1,2,3], '[0..1]'), [1,2]);
      assertArrayEqual(get([1,2,3], '[1..2]'), [2,3]);
      assertArrayEqual(get([1,2,3], '[1..3]'), [2,3]);
      assertArrayEqual(get([1,2,3], '[0..0]'), [1]);
      assertArrayEqual(get([1,2,3], '[0..-1]'), [1,2,3]);
      assertArrayEqual(get([1,2,3], '[-1..0]'), [3,1]);
      assertArrayEqual(get([1,2,3], '[-1..-1]'), [3]);
      assertArrayEqual(get([1,2,3], '[-2..-1]'), [2,3]);
      assertArrayEqual(get([1,2,3], '[-3..-1]'), [1,2,3]);
      assertArrayEqual(get([1,2,3], '[-4..-1]'), [1,2,3]);
      assertArrayEqual(get([1,2,3], '[-4..-3]'), [1]);
      assertArrayEqual(get([1,2,3], '[-5..-4]'), []);
      assertArrayEqual(get([1,2,3], '[0..]'), [1,2,3]);
      assertArrayEqual(get([1,2,3], '[..1]'), [1,2]);
      assertArrayEqual(get([1,2,3], '[..]'), [1,2,3]);
      assertArrayEqual(get([1,2,3], '..'), [1,2,3]);
      assertArrayEqual(get({a:[1,2,3]}, 'a[0..1]'), [1,2]);
      assertArrayEqual(get({a:{b:[1,2,3]}}, 'a.b[0..1]'), [1,2]);
      assertArrayEqual(get({a:{b:[{d:1},{d:2}]}}, 'a.b[0..1].d'), [1,2]);
      assertArrayEqual(
        get({
          a: [
            { b: [1,2,3] },
            { b: [4,5,6] },
            { b: [7,8,9] },
            { b: [10,11,12] },
          ]
        }, 'a[1..2].b[0..1]'),
        [[4,5],[7,8]]
      );
      assertArrayEqual(
        get([
            [
              [{a:'a'},{a:'b'},{a:'c'}],
              [{a:'d'},{a:'e'},{a:'f'}],
              [{a:'g'},{a:'h'},{a:'i'}],
            ]
          ], '[0][0..1][0..1]'),
        [[{a:'a'},{a:'b'}],[{a:'d'},{a:'e'}]],
      );
      assertArrayEqual(
        get([
            [
              [{a:'a'},{a:'b'},{a:'c'}],
              [{a:'d'},{a:'e'},{a:'f'}],
              [{a:'g'},{a:'h'},{a:'i'}],
            ]
          ], '[0][0..1][0..1].a'),
        [['a','b'],['d','e']],
      );
    });

    it('should throw an error when range syntax used on an object', () => {
      assertError(() => {
        get({a:1}, '[0..1]');
      }, TypeError);
    });

    it('should not get inherited properties', () => {
      const obj = Object.create({a:1});
      assertEqual(get(obj, 'a'), undefined);
      assertEqual(get({a:obj}, ['a','a']), undefined);
    });

    it('should work as expected on class instances', () => {
      function Foo() {
        this.a = 'a';
      }
      Foo.prototype.b = 'b';
      assertEqual(get(new Foo, 'a'), 'a');
      assertEqual(get(new Foo, 'b'), undefined);
    });

    it('should function as expected with an empty string', () => {
      assertEqual(get({'':1}, ''), 1);
      assertEqual(get({'':{'':2}}, '.'), 2);
    });

    it('should not get built-in inherited methods', () => {
      assertEqual(get([], 'forEach'), undefined);
    });

    it('should get a property by nested id', () => {
      assertEqual(get({users:{993425:{name:'Harry'}}}, 'users.993425.name'), 'Harry');
    });

    it('should work with hasOwnProperty overridden', () => {
      assertEqual(get({hasOwnProperty: true, a: 1}, 'a'), 1);
    });

    it('should handle irregular input', () => {
      assertEqual(get({null:1}, 'null'), 1);
      assertEqual(get({undefined:1}, 'undefined'), 1);
      assertEqual(get(), undefined);
      assertEqual(get(null), undefined);
      assertEqual(get(undefined), undefined);
      assertEqual(get(null, 'a.b.c'), undefined);
      assertEqual(get(undefined, 'a.b.c'), undefined);
    });

  });

  describeInstance('set', function(set) {

    it('should set shallow properties with a string', () => {
      assertObjectEqual(set({}, 'a', 1), {a:1});
      assertObjectEqual(set({a:1}, 'b', 2), {a:1,b:2});
    });

    it('should set array element with a numeric index', () => {
      assertArrayEqual(set([1,2], 2, 3), [1,2,3]);
    });

    it('should set deep properties with an array path', () => {
      assertObjectEqual(set({a:{b:1}}, ['a', 'b'], 2), {a:{b:2}});
    });

    it('should set deep properties with dot syntax', () => {
      assertObjectEqual(set({a:{b:1}}, 'a.b', 2), {a:{b:2}});
      assertObjectEqual(set({a:{b:1}}, 'a.c', 2), {a:{b:1,c:2}});
      assertObjectEqual(set({a:{b:1}}, '.', 2), {a:{b:1},'':{'':2}});
    });

    it('should set deep properties with bracket syntax', () => {
      assertObjectEqual(set({a:{b:1}}, 'a[b]', 2), {a:{b:2}});
      assertObjectEqual(set({a:{b:1}}, 'a[c]', 2), {a:{b:1,c:2}});
    });

    it('should set array elements with path', () => {
      assertArrayEqual(set([1,2,3], [0], 2), [2,2,3]);
      assertArrayEqual(set([1,2,3], ['0'], 2), [2,2,3]);
      assertObjectEqual(set({a:[1,2,3]}, ['a','1'], 3), {a:[1,3,3]});
      assertObjectEqual(set({a:[1,2,3]}, ['a','5'], 4), {a:[1,2,3,,,4]});
      assertObjectEqual(set({a:[{a:2}]}, ['a','0','a'], 3), {a:[{a:3}]});
      assertObjectEqual(set({a:[{a:2}]}, ['a','2','a'], 3), {a:[{a:2},,{a:3}]});
    });

    it('should set array elements with dot syntax', () => {
      assertObjectEqual(set({a:[1,2,3]}, 'a.1', 3), {a:[1,3,3]});
      assertObjectEqual(set({a:[1,2,3]}, 'a.5', 4), {a:[1,2,3,,,4]});
      assertObjectEqual(set({a:[{a:2}]}, 'a.0.a', 3), {a:[{a:3}]});
      assertObjectEqual(set({a:[{a:2}]}, 'a.2.a', 3), {a:[{a:2},,{a:3}]});
      assertArrayEqual(set([[[1]]], '0.0.0', 2), [[[2]]]);
    });

    it('should set array elements with bracket syntax', () => {
      assertArrayEqual(set([1,2,3], '[0]', 4), [4,2,3]);
      assertArrayEqual(set([1,2,3], '[3]', 4), [1,2,3,4]);
      assertObjectEqual(set({a:[1,2,3]}, 'a[1]', 3), {a:[1,3,3]});
      assertObjectEqual(set({a:[1,2,3]}, 'a[4]', 4), {a:[1,2,3,,4]});
      assertObjectEqual(set({a:[{a:2}]}, 'a[0].a', 3), {a:[{a:3}]});
      assertObjectEqual(set({a:[{a:2}]}, 'a[0].b', 3), {a:[{a:2,b:3}]});
      assertArrayEqual(set([[[1]]], '[0][0][0]', 2), [[[2]]]);
      assertArrayEqual(set([[[{a:1}]]], '[0][0][0].a', 2), [[[{a:2}]]]);
      assertArrayEqual(set([[[{a:1}]]], '0[0][0].a', 2), [[[{a:2}]]]);
      assertObjectEqual(set({a:[1,2]}, 'a[0]', 2), {a:[2,2]});
      assertObjectEqual(set({a:[1,2]}, 'a[1]', 3), {a:[1,3]});
      assertObjectEqual(set({a:[1,2]}, 'a[2]', 3), {a:[1,2,3]});
      assertArrayEqual(set([], '[0]', 1), [1]);
    });

    it('should push array elements with empty bracket syntax', () => {
      assertArrayEqual(set([], '[]', 1), [1]);
      assertArrayEqual(set([], '[]', 'foo'), ['foo']);
      assertArrayEqual(set(['a'], '[]', 'foo'), ['a','foo']);
      assertArrayEqual(set([], '[].x','foo'), [{x:'foo'}]);
      assertArrayEqual(set([], '[].x.y','foo'), [{x:{y:'foo'}}]);
      assertObjectEqual(set({a:[1,2]}, 'a[]', 3), {a:[1,2,3]});
      assertObjectEqual(set({x:['a']}, 'x[]', 'foo'), {x:['a','foo']});
      assertObjectEqual(set({x:{y:['a']}}, 'x.y[]', 'foo'), {x:{y:['a','foo']}});
      assertObjectEqual(set({}, 'x[]', 'foo'), {x:['foo']});
      assertObjectEqual(set({}, 'a[].x.y','foo'), {a:[{x:{y:'foo'}}]});
    });

    it('should initialize namespaces as arrays with bracket syntax', () => {
      assertArrayEqual(set([], '[0][0]', 1), [[1]]);
      assertArrayEqual(set([], '[0][0][0]', 1), [[[1]]]);
      assertArrayEqual(set([], '[][][]', 1), [[[1]]]);
    });

    it('should initialize namespaces as objects with dot syntax', () => {
      assertObjectEqual(set({}, '0.0', 1), {0:{0:1}});
      assertObjectEqual(set({}, '0.0.0', 1), {0:{0:{0:1}}});
      assertObjectEqual(set({}, 'users.123.name', 'Jim'), {users:{123:{name:'Jim'}}});
    });

    it('should initialize namespaces with mixed syntax', () => {
      assertObjectEqual(set({}, 'users[0].name', 'Frank'), {
        users: [
          { name: 'Frank' },
        ]
      });
      assertObjectEqual(set({}, 'users[0].posts[0].name', 'post'), {
        users: [
          { posts: [{name: 'post'}]},
        ]
      });
    });

    it('should set array elements with negative syntax', () => {
      assertArrayEqual(set([1,2,3], '[-1]', 4), [1,2,4]);
      assertArrayEqual(set([1,2,3], '[-2]', 4), [1,4,3]);
      assertArrayEqual(set([1,2,3], '[-3]', 4), [4,2,3]);
      assertArrayEqual(set([1,2,3], '[-4]', 4), [4,2,3]);
      assertArrayEqual(set([[1,2,3]], '[0][-1]', 4), [[1,2,4]]);
      assertArrayEqual(set([[[1,2,3]]], '[0][0][-1]', 4), [[[1,2,4]]]);
      assertArrayEqual(set([[[1,2,3]]], '0.0.-1', 4), [[[1,2,4]]]);
      assertObjectEqual(set({a:[1,2]}, 'a.-1', 4), {a:[1,4]});
      assertObjectEqual(set({a:[1,2]}, 'a.-2', 4), {a:[4,2]});
      assertObjectEqual(set({a:[1,2]}, 'a.-3', 4), {a:[4,2]});
      assertObjectEqual(set({a:[1,2]}, 'a[-1]', 3), {a:[1,3]});
      assertObjectEqual(set({a:[1,2]}, 'a[-2]', 3), {a:[3,2]});
      assertObjectEqual(set({a:[1,2]}, 'a[-3]', 3), {a:[3,2]});
      assertArrayEqual(set([[[{a:1}]]], '[-1][-1][-1].a', 2), [[[{a:2}]]]);
    });

    it('should create deep paths when they do not exist', () => {
      assertObjectEqual(set({}, ['a','b','c','d'], 1), {a:{b:{c:{d:1}}}});
    });

    it('should throw an error when trying to traverse into a primitive', () => {
      assertError(() => {
        set({a:1}, ['a','b','c','d'], 2);
      });
      assertError(() => {
        set({a:1}, 'a.b.c.d', 2);
      });
      assertError(() => {
        set({a:1}, 'a[b][c][d]', 2);
      });
    });

    it('should prioritize deep path over key with matching syntax', () => {
      assertObjectEqual(set({a:{b:{c:1}},'a.b.c':2}, 'a.b.c', 3), {a:{b:{c:3}},'a.b.c':2});
    });

    it('should still allow access to shadowed path', () => {
      assertObjectEqual(set({a:{b:{c:1}},'a.b.c':2}, ['a.b.c'], 3), {a:{b:{c:1}},'a.b.c':3});
    });

    it('should set array slice members a range syntax', () => {
      assertArrayEqual(set([1,2,3], '[0..1]', 4), [4,4,3]);
      assertArrayEqual(set([1,2,3], '[1..2]', 4), [1,4,4]);
      assertArrayEqual(set([1,2,3], '[1..3]', 4), [1,4,4,4]);
      assertArrayEqual(set([1,2,3], '[0..0]', 4), [4,2,3]);
      assertArrayEqual(set([1,2,3], '[0..-1]', 4), [4,4,4]);
      assertArrayEqual(set([1,2,3], '[-1..0]', 4), [4,2,4]);
      assertArrayEqual(set([1,2,3], '[-1..-1]', 4), [1,2,4]);
      assertArrayEqual(set([1,2,3], '[-2..-1]', 4), [1,4,4]);
      assertArrayEqual(set([1,2,3], '[-3..-1]', 4), [4,4,4]);
      assertArrayEqual(set([1,2,3], '[-4..-1]', 4), [4,4,4]);
      assertArrayEqual(set([1,2,3], '[-4..-3]', 4), [4,2,3]);
      assertArrayEqual(set([1,2,3], '[-5..-4]', 4), [1,2,3]);
      assertArrayEqual(set([1,2,3], '[0..]', 4), [4,4,4]);
      assertArrayEqual(set([1,2,3], '[..1]', 4), [4,4,3]);
      assertArrayEqual(set([1,2,3], '[..]', 4), [4,4,4]);
      assertArrayEqual(set([1,2,3], '..', 4), [4,4,4]);
      assertObjectEqual(set({a:[1,2,3]}, 'a[0..1]', 4), {a:[4,4,3]});
      assertObjectEqual(set({a:{b:[1,2,3]}}, 'a.b[0..1]', 4), {a:{b:[4,4,3]}});
      assertObjectEqual(set({a:{b:[{d:1},{d:2}]}}, 'a.b[0..1].d', 4), {a:{b:[{d:4},{d:4}]}});
      assertObjectEqual(
        set({
          a: [
            { b: [1,2,3] },
            { b: [4,5,6] },
            { b: [7,8,9] },
            { b: [10,11,12] },
          ]
        }, 'a[1..2].b[0..1]', 4),
        {
          a: [
            { b: [1,2,3] },
            { b: [4,4,6] },
            { b: [4,4,9] },
            { b: [10,11,12] },
          ]
        }
      );
      assertArrayEqual(
        set([
            [
              [{a:'a'},{a:'b'},{a:'c'}],
              [{a:'d'},{a:'e'},{a:'f'}],
              [{a:'g'},{a:'h'},{a:'i'}],
            ]
          ], '[0][0..1][0..1]', 4),
        [
          [
            [4,4,{a:'c'}],
            [4,4,{a:'f'}],
            [{a:'g'},{a:'h'},{a:'i'}],
          ]
        ],
      );
      assertArrayEqual(
        set([
            [
              [{a:'a'},{a:'b'},{a:'c'}],
              [{a:'d'},{a:'e'},{a:'f'}],
              [{a:'g'},{a:'h'},{a:'i'}],
            ]
          ], '[0][0..1][0..1].a', 4),
        [
          [
            [{a:4},{a:4},{a:'c'}],
            [{a:4},{a:4},{a:'f'}],
            [{a:'g'},{a:'h'},{a:'i'}],
          ]
        ]
      );
    });

    it('should throw an error when range syntax used on an object', () => {
      assertError(() => {
        set({a:1}, '[0..1]', 4);
      }, TypeError);
    });

    it('should work as expected on inherited properties', () => {
      let obj;
      obj = Object.create({a:1});
      assertObjectEqual(set(obj, 'a', 4), {a:4});

      obj = Object.create({a:1});
      assertObjectEqual(set({a:obj}, ['a','a'], 4), {a:{a:4}});
    });

    it('should work as expected on class instances', () => {
      function Foo() {
        this.a = 'a';
      }
      Foo.prototype.b = 'b';
      const foo = new Foo();
      set(foo, 'c', 'c');
      set(foo, 'd.e', 'e');
      assertEqual(foo.a, 'a');
      assertEqual(foo.b, 'b');
      assertEqual(foo.c, 'c');
      assertObjectEqual(foo.d, {e:'e'});
    });

    it('should function as expected with an empty string', () => {
      assertObjectEqual(set({'':1}, '', 2), {'':2});
      assertObjectEqual(set({'':{'':2}}, '.', 3), {'':{'':3}});
    });

    it('should shadow built-in inherited methods', () => {
      const result = set([], 'forEach', 3)
      assertEqual(result.forEach, 3);
    });

    it('should set a property by nested id', () => {
      assertObjectEqual(
        set({
          users:{
            993425: {
              name: 'Harry'
            }
          }
        }, 'users.993425.name', 'Barry'),
        {
          users: {
            993425: {
              name: 'Barry',
            }
          }
        }
      );
    });

    it('should work with hasOwnProperty overridden', () => {
      assertObjectEqual(set({hasOwnProperty: true, a: 1}, 'a', 2), {
        hasOwnProperty: true,
        a: 2,
      });
    });

    it('should handle irregular input', () => {
      assertObjectEqual(set({null:1}, 'null', 2), {null:2});
      assertObjectEqual(set({undefined:1}, 'undefined', 2), {undefined:2});
      assertError(() => {
        set();
      });
      assertError(() => {
        set(null);
      });
      assertError(() => {
        set(undefined);
      });
      assertError(() => {
        set(null);
      });
      assertError(() => {
        set(null, 'a.b.c');
      });
      assertError(() => {
        set({}, 'a');
      });
    });

  });

});
