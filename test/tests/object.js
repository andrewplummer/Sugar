'use strict';

/* eslint-disable no-sparse-arrays */
describeNamespace('Object', function () {

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

  describeInstance('some', (some) => {

    it('should match by primitive matchers', () => {
      assertEqual(some({a:'a',b:'b'}, 'a'), true);
      assertEqual(some({a:'a',b:'b'}, 'd'), false);
      assertEqual(some({a:1,b:2}, 7), false);
      assertEqual(some({a:true,b:false}, true), true);
      assertEqual(some({a:false,b:false}, true), false);
    });

    it('should match by regex', () => {
      assertEqual(some({a:'a',b:'b'}, /[ac]/), true);
      assertEqual(some({a:'a',b:'b'}, /[AC]/), false);
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(some({a:d1,b:d2}, new Date(2020, 7, 28)), true);
      assertEqual(some({a:d1,b:d2}, new Date(2020, 7, 30)), false);
    });

    it('should match by function', () => {
      assertEqual(some({a:1,b:2}, (key, n) => n % 2 === 0), true);
      assertEqual(some({a:2,b:4}, (key, n) => n % 2 === 1), false);
      assertEqual(some({a:1,b:2}, (key, n) => n > 5), false);
      assertEqual(some({a:1,b:2}, (key, n) => n > 1), true);
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(some({a:fn1, b:fn2}, fn2), true);
      assertEqual(some({a:fn1}, fn2), false);
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      some({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(some({a:1}, null), false);
      assertEqual(some({a:1}, NaN), false);
      assertError(() => { some({}); });
      assertError(() => { some(null); });
      assertError(() => { some('a'); });
      assertError(() => { some(1); });
    });

  });

  describeInstance('every', (every) => {

    it('should match by primitive matchers', () => {
      assertEqual(every({a:'a',b:'b'}, 'c'), false);
      assertEqual(every({a:'a',b:'b'}, 'a'), false);
      assertEqual(every({a:'a',b:'a'}, 'a'), true);
      assertEqual(every({a:1,b:2}, 3), false);
      assertEqual(every({a:1,b:2}, 2), false);
      assertEqual(every({a:1,b:1}, 1), true);
      assertEqual(every({a:true,b:false}, true), false);
      assertEqual(every({a:true,b:true}, true), true);
    });

    it('should match by regex', () => {
      assertEqual(every({a:'a',b:'b'}, /[ac]/), false);
      assertEqual(every({a:'a',b:'b'}, /[a-c]/), true);
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(every({a:d1,b:d2}, new Date(2020, 7, 28)), false);
      assertEqual(every({a:d1,b:d1}, new Date(2020, 7, 28)), true);
    });

    it('should match by function', () => {
      assertEqual(every({a:1,b:2}, (key, n) => n % 2 === 0), false);
      assertEqual(every({a:2,b:4}, (key, n) => n % 2 === 0), true);
      assertEqual(every({a:1,b:2}, (key, n) => n > 5), false);
      assertEqual(every({a:1,b:2}, (key, n) => n > 0), true);
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(every({a:fn1, b:fn2}, fn2), false);
      assertEqual(every({a:fn1, b:fn1}, fn1), true);
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      every({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(every({a:1}, null), false);
      assertEqual(every({a:1}, NaN), false);
      assertError(() => { every({}); });
      assertError(() => { every(null); });
      assertError(() => { every('a'); });
      assertError(() => { every(1); });
    });

  });

  describeInstance('none', (none) => {

    it('should match by primitive matchers', () => {
      assertEqual(none({a:'a',b:'b'}, 'a'), false);
      assertEqual(none({a:'a',b:'b'}, 'd'), true);
      assertEqual(none({a:1,b:2}, 7), true);
      assertEqual(none({a:true,b:false}, true), false);
      assertEqual(none({a:false,b:false}, true), true);
    });

    it('should match by regex', () => {
      assertEqual(none({a:'a',b:'b'}, /[ac]/), false);
      assertEqual(none({a:'a',b:'b'}, /[AC]/), true);
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(none({a:d1,b:d2}, new Date(2020, 7, 28)), false);
      assertEqual(none({a:d1,b:d2}, new Date(2020, 7, 30)), true);
    });

    it('should match by function', () => {
      assertEqual(none({a:1,b:2}, (key, n) => n % 2 === 0), false);
      assertEqual(none({a:2,b:4}, (key, n) => n % 2 === 1), true);
      assertEqual(none({a:1,b:2}, (key, n) => n > 5), true);
      assertEqual(none({a:1,b:2}, (key, n) => n > 1), false);
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(none({a:fn1, b:fn2}, fn2), false);
      assertEqual(none({a:fn1}, fn2), true);
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      none({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(none({a:1}, null), true);
      assertEqual(none({a:1}, NaN), true);
      assertError(() => { none({}); });
      assertError(() => { none(null); });
      assertError(() => { none('a'); });
      assertError(() => { none(1); });
    });

  });

  describeInstance('findKey', (findKey) => {

    it('should match by primitive matchers', () => {
      assertEqual(findKey({a:'a',b:'b'}, 'a'), 'a');
      assertEqual(findKey({a:'a',b:'b'}, 'c'), undefined);
      assertEqual(findKey({a:1,b:2}, 2), 'b');
      assertEqual(findKey({a:1,b:2}, 3), undefined);
      assertEqual(findKey({a:true,b:false}, true), 'a');
      assertEqual(findKey({a:true,b:true}, false), undefined);
    });

    it('should match by regex', () => {
      assertEqual(findKey({a:'a',b:'b'}, /[a-c]/), 'a');
      assertEqual(findKey({a:'a',b:'b'}, /[c-z]/), undefined);
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(findKey({a:d1,b:d2}, new Date(2020, 7, 28)), 'a');
      assertEqual(findKey({a:d1,b:d1}, new Date(2020, 7, 29)), undefined);
    });

    it('should match by function', () => {
      assertEqual(findKey({a:1,b:2}, (key, n) => n % 2 === 0), 'b');
      assertEqual(findKey({a:1,b:3}, (key, n) => n % 2 === 0), undefined);
      assertEqual(findKey({a:1,b:2}, (key, n) => n > 5), undefined);
      assertEqual(findKey({a:1,b:2}, (key, n) => n > 0), 'a');
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(findKey({a:fn1, b:fn2}, fn2), 'b');
      assertEqual(findKey({a:fn1, b:fn1}, fn2), undefined);
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      findKey({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(findKey({a:1}, null), undefined);
      assertEqual(findKey({a:1}, NaN), undefined);
      assertError(() => { findKey({}); });
      assertError(() => { findKey(null); });
      assertError(() => { findKey('a'); });
      assertError(() => { findKey(1); });
    });

  });

  describeInstance('selectValues', (selectValues) => {

    it('should match by primitive matchers', () => {
      assertObjectEqual(selectValues({a:'a',b:'b'}, 'a'), {a:'a'});
      assertObjectEqual(selectValues({a:'a',b:'b'}, 'c'), {});
      assertObjectEqual(selectValues({a:1,b:2}, 2), {b:2});
      assertObjectEqual(selectValues({a:1,b:2}, 3), {});
      assertObjectEqual(selectValues({a:true,b:false}, true), {a:true});
      assertObjectEqual(selectValues({a:true,b:true}, false), {});
    });

    it('should match by regex', () => {
      assertObjectEqual(selectValues({a:'a',b:'b'}, /[a-c]/), {a:'a',b:'b'});
      assertObjectEqual(selectValues({a:'a',b:'b'}, /[c-z]/), {});
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(selectValues({a:d1,b:d2}, new Date(2020, 7, 28)), {a:d1});
      assertObjectEqual(selectValues({a:d1,b:d1}, new Date(2020, 7, 29)), {});
    });

    it('should match by function', () => {
      assertObjectEqual(selectValues({a:1,b:2}, (key, n) => n % 2 === 0), {b:2});
      assertObjectEqual(selectValues({a:1,b:3}, (key, n) => n % 2 === 0), {});
      assertObjectEqual(selectValues({a:1,b:2}, (key, n) => n > 5), {});
      assertObjectEqual(selectValues({a:1,b:2}, (key, n) => n > 0), {a:1,b:2});
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(selectValues({a:fn1, b:fn2}, fn2), {b:fn2});
      assertObjectEqual(selectValues({a:fn1, b:fn1}, fn2), {});
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      selectValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should not modify the object', () => {
      const obj = {};
      assertEqual(obj === selectValues(obj, 1), false);
    });

    it('should handle irregular input', () => {
      assertObjectEqual(selectValues({a:1}, null), {});
      assertObjectEqual(selectValues({a:1}, NaN), {});
      assertError(() => { selectValues({}); });
      assertError(() => { selectValues(null); });
      assertError(() => { selectValues('a'); });
      assertError(() => { selectValues(1); });
    });

  });

  describeInstance('rejectValues', (rejectValues) => {

    it('should match by primitive matchers', () => {
      assertObjectEqual(rejectValues({a:'a',b:'b'}, 'a'), {b:'b'});
      assertObjectEqual(rejectValues({a:'a',b:'b'}, 'c'), {a:'a',b:'b'});
      assertObjectEqual(rejectValues({a:1,b:2}, 2), {a:1});
      assertObjectEqual(rejectValues({a:1,b:2}, 3), {a:1,b:2});
      assertObjectEqual(rejectValues({a:true,b:false}, true), {b:false});
      assertObjectEqual(rejectValues({a:true,b:true}, false), {a:true,b:true});
    });

    it('should match by regex', () => {
      assertObjectEqual(rejectValues({a:'a',b:'b'}, /[a-c]/), {});
      assertObjectEqual(rejectValues({a:'a',b:'b'}, /[c-z]/), {a:'a',b:'b'});
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(rejectValues({a:d1,b:d2}, new Date(2020, 7, 28)), {b:d2});
      assertObjectEqual(rejectValues({a:d1,b:d1}, new Date(2020, 7, 29)), {a:d1,b:d1});
    });

    it('should match by function', () => {
      assertObjectEqual(rejectValues({a:1,b:2}, (key, n) => n % 2 === 0), {a:1});
      assertObjectEqual(rejectValues({a:1,b:3}, (key, n) => n % 2 === 0), {a:1,b:3});
      assertObjectEqual(rejectValues({a:1,b:2}, (key, n) => n > 5), {a:1,b:2});
      assertObjectEqual(rejectValues({a:1,b:2}, (key, n) => n > 0), {});
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(rejectValues({a:fn1, b:fn2}, fn2), {a:fn1});
      assertObjectEqual(rejectValues({a:fn1, b:fn1}, fn2), {a:fn1,b:fn1});
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      rejectValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should not modify the object', () => {
      const obj = {};
      assertEqual(obj === rejectValues(obj, 1), false);
    });

    it('should handle irregular input', () => {
      assertObjectEqual(rejectValues({a:1}, null), {a:1});
      assertObjectEqual(rejectValues({a:1}, NaN), {a:1});
      assertError(() => { rejectValues({}); });
      assertError(() => { rejectValues(null); });
      assertError(() => { rejectValues('a'); });
      assertError(() => { rejectValues(1); });
    });

  });

  describeInstance('removeValues', (removeValues) => {

    it('should match by primitive matchers', () => {
      assertObjectEqual(removeValues({a:'a',b:'b'}, 'a'), {b:'b'});
      assertObjectEqual(removeValues({a:'a',b:'b'}, 'c'), {a:'a',b:'b'});
      assertObjectEqual(removeValues({a:1,b:2}, 2), {a:1});
      assertObjectEqual(removeValues({a:1,b:2}, 3), {a:1,b:2});
      assertObjectEqual(removeValues({a:true,b:false}, true), {b:false});
      assertObjectEqual(removeValues({a:true,b:true}, false), {a:true,b:true});
    });

    it('should match by regex', () => {
      assertObjectEqual(removeValues({a:'a',b:'b'}, /[a-c]/), {});
      assertObjectEqual(removeValues({a:'a',b:'b'}, /[c-z]/), {a:'a',b:'b'});
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertObjectEqual(removeValues({a:d1,b:d2}, new Date(2020, 7, 28)), {b:d2});
      assertObjectEqual(removeValues({a:d1,b:d1}, new Date(2020, 7, 29)), {a:d1,b:d1});
    });

    it('should match by function', () => {
      assertObjectEqual(removeValues({a:1,b:2}, (key, n) => n % 2 === 0), {a:1});
      assertObjectEqual(removeValues({a:1,b:3}, (key, n) => n % 2 === 0), {a:1,b:3});
      assertObjectEqual(removeValues({a:1,b:2}, (key, n) => n > 5), {a:1,b:2});
      assertObjectEqual(removeValues({a:1,b:2}, (key, n) => n > 0), {});
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertObjectEqual(removeValues({a:fn1, b:fn2}, fn2), {a:fn1});
      assertObjectEqual(removeValues({a:fn1, b:fn1}, fn2), {a:fn1,b:fn1});
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      removeValues({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should modify the object', () => {
      const obj1 = {a:1};
      const obj2 = removeValues(obj1, 1);
      assertEqual(obj1, obj2);
      assertObjectEqual(obj1, {});
    });

    it('should handle irregular input', () => {
      assertObjectEqual(removeValues({a:1}, null), {a:1});
      assertObjectEqual(removeValues({a:1}, NaN), {a:1});
      assertError(() => { removeValues({}); });
      assertError(() => { removeValues(null); });
      assertError(() => { removeValues('a'); });
      assertError(() => { removeValues(1); });
    });

  });

  describeInstance('select,selectKeys', (selectKeys) => {

    it('should select by string argument', () => {
      assertObjectEqual(selectKeys({a:1,b:2}, 'a'), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, 'b'), {b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, 'c'), {});
      assertObjectEqual(selectKeys({a:1,b:2}, ''), {});
    });

    it('should select by array argument', () => {
      assertObjectEqual(selectKeys({a:1,b:2}, ['a']), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, ['a', 'b']), {a:1,b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, []), {});
      assertObjectEqual(selectKeys({a:1,b:2}, ['c']), {});
    });

    it('should select by function', () => {
      assertObjectEqual(selectKeys({a:1,b:2}, (key) => key === 'a'), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, (key) => key === 'b'), {b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, (key) => key === 'c'), {});
    });

    it('should pass correct arguments', () => {
      selectKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should select by regex', () => {
      assertObjectEqual(selectKeys({a:1,b:2}, /a/), {a:1});
      assertObjectEqual(selectKeys({a:1,b:2}, /[ab]/), {a:1,b:2});
      assertObjectEqual(selectKeys({a:1,b:2}, /c/), {});
    });

    it('should not modify the object', () => {
      const obj1 = {a:1};
      const obj2 = selectKeys(obj1, 1);
      assertFalse(obj1 === obj2);
    });

    it('should handle irregular input', () => {
      assertObjectEqual(selectKeys({a:1}, null), {});
      assertObjectEqual(selectKeys({a:1}, NaN), {});
      assertError(() => { selectKeys(null); });
      assertError(() => { selectKeys('a'); });
      assertError(() => { selectKeys(1); });
    });

  });

  describeInstance('reject,rejectKeys', (rejectKeys) => {

    it('should reject by string argument', () => {
      assertObjectEqual(rejectKeys({a:1,b:2}, 'a'), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, 'b'), {a:1});
      assertObjectEqual(rejectKeys({a:1,b:2}, 'c'), {a:1,b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, ''), {a:1,b:2});
    });

    it('should reject by array argument', () => {
      assertObjectEqual(rejectKeys({a:1,b:2}, ['a']), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, ['a', 'b']), {});
      assertObjectEqual(rejectKeys({a:1,b:2}, []), {a:1,b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, ['c']), {a:1,b:2});
    });

    it('should reject by function', () => {
      assertObjectEqual(rejectKeys({a:1,b:2}, (key) => key === 'a'), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, (key) => key === 'b'), {a:1});
      assertObjectEqual(rejectKeys({a:1,b:2}, (key) => key === 'c'), {a:1,b:2});
    });

    it('should pass correct arguments', () => {
      rejectKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should reject by regex', () => {
      assertObjectEqual(rejectKeys({a:1,b:2}, /a/), {b:2});
      assertObjectEqual(rejectKeys({a:1,b:2}, /[ab]/), {});
      assertObjectEqual(rejectKeys({a:1,b:2}, /c/), {a:1,b:2});
    });

    it('should not modify the object', () => {
      const obj1 = {a:1};
      const obj2 = rejectKeys(obj1, 1);
      assertFalse(obj1 === obj2);
    });

    it('should handle irregular input', () => {
      assertObjectEqual(rejectKeys({a:1}, null), {a:1});
      assertObjectEqual(rejectKeys({a:1}, NaN), {a:1});
      assertError(() => { rejectKeys(null); });
      assertError(() => { rejectKeys('a'); });
      assertError(() => { rejectKeys(1); });
    });

  });

  describeInstance('remove,removeKeys', (removeKeys) => {

    it('should remove by string argument', () => {
      assertObjectEqual(removeKeys({a:1,b:2}, 'a'), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, 'b'), {a:1});
      assertObjectEqual(removeKeys({a:1,b:2}, 'c'), {a:1,b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, ''), {a:1,b:2});
    });

    it('should remove by array argument', () => {
      assertObjectEqual(removeKeys({a:1,b:2}, ['a']), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, ['a', 'b']), {});
      assertObjectEqual(removeKeys({a:1,b:2}, []), {a:1,b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, ['c']), {a:1,b:2});
    });

    it('should remove by function', () => {
      assertObjectEqual(removeKeys({a:1,b:2}, (key) => key === 'a'), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, (key) => key === 'b'), {a:1});
      assertObjectEqual(removeKeys({a:1,b:2}, (key) => key === 'c'), {a:1,b:2});
    });

    it('should pass correct arguments', () => {
      removeKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should remove by regex', () => {
      assertObjectEqual(removeKeys({a:1,b:2}, /a/), {b:2});
      assertObjectEqual(removeKeys({a:1,b:2}, /[ab]/), {});
      assertObjectEqual(removeKeys({a:1,b:2}, /c/), {a:1,b:2});
    });

    it('should modify the object', () => {
      const obj1 = {a:1};
      const obj2 = removeKeys(obj1, 1);
      assertTrue(obj1 === obj2);
    });

    it('should handle irregular input', () => {
      assertObjectEqual(removeKeys({a:1}, null), {a:1});
      assertObjectEqual(removeKeys({a:1}, NaN), {a:1});
      assertError(() => { removeKeys(null); });
      assertError(() => { removeKeys('a'); });
      assertError(() => { removeKeys(1); });
    });

  });

  describeInstance('count', (count) => {

    it('should match by primitive matchers', () => {
      assertEqual(count({a:'a',b:'b'}, 'a'), 1);
      assertEqual(count({a:'a',b:'b'}, 'c'), 0);
      assertEqual(count({a:1,b:2}, 2), 1);
      assertEqual(count({a:1,b:2}, 3), 0);
      assertEqual(count({a:true,b:false}, true), 1);
      assertEqual(count({a:true,b:true}, false), 0);
    });

    it('should match by regex', () => {
      assertEqual(count({a:'a',b:'b'}, /[a-c]/), 2);
      assertEqual(count({a:'a',b:'b'}, /[c-z]/), 0);
    });

    it('should match by date', () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(count({a:d1,b:d2}, new Date(2020, 7, 28)), 1);
      assertEqual(count({a:d1,b:d1}, new Date(2020, 7, 29)), 0);
    });

    it('should match by function', () => {
      assertEqual(count({a:1,b:2}, (key, n) => n % 2 === 0), 1);
      assertEqual(count({a:1,b:3}, (key, n) => n % 2 === 0), 0);
      assertEqual(count({a:1,b:2}, (key, n) => n > 5), 0);
      assertEqual(count({a:1,b:2}, (key, n) => n > 0), 2);
    });

    it('should match by function when strictly equal', () => {
      var fn1 = function(){};
      var fn2 = function(){};
      assertEqual(count({a:fn1, b:fn2}, fn2), 1);
      assertEqual(count({a:fn1, b:fn1}, fn2), 0);
    });

    it('should match by fuzzy matching', () => {
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

    it('should pass correct arguments', () => {
      count({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(count({a:1}, null), 0);
      assertEqual(count({a:1}, NaN), 0);
      assertError(() => { count({}); });
      assertError(() => { count(null); });
      assertError(() => { count('a'); });
      assertError(() => { count(1); });
    });

  });

  describeInstance('sum', (sum) => {

    it('should sum all values with no arguments', () => {
      assertEqual(sum({a:1,b:2}), 3);
      assertEqual(sum({a:0,b:0}), 0);
      assertEqual(sum({a:1}), 1);
      assertEqual(sum({}), 0);
    });

    it('should sum with function mapper', () => {
      assertEqual(sum({a:1,b:2}, (key, n) => n * 2), 6);
      assertEqual(sum({a:1,b:2}, (key, n) => n % 2 === 0 ? n : 0), 2);
      assertEqual(sum({a:1,b:2}, (key, n) => n > 5 ? n : 0), 0);
      assertEqual(sum({a:1,b:2}, (key, n) => n > 1 ? n : 0), 2);
    });

    it('should sum with string mapper', () => {
      assertEqual(sum({1:{age:2},2:{age:5}}, 'age'), 7);
      assertNaN(sum({1:{age:2},2:{age:5}}, 'height'));
    });

    it('should handle deep properties', () => {
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

    it('should pass correct arguments', () => {
      sum({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(sum({a:null,b:false}), 0);
      assertError(() => { sum(); });
      assertError(() => { sum(null); });
      assertError(() => { sum(1); });
      assertError(() => { sum('a'); });
    });

  });

  describeInstance('average', (average) => {

    it('should average all values with no arguments', () => {
      assertEqual(average({a:1,b:2,c:3}), 2);
      assertEqual(average({a:0,b:0,c:0}), 0);
      assertEqual(average({}), 0);
    });

    it('should average with function mapper', () => {
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n * 2), 5);
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n % 2 === 0 ? n : 0), 1.5);
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n > 5 ? n : 0), 0);
      assertEqual(average({a:1,b:2,c:3,d:4}, (key, n) => n > 2 ? n : 0), 1.75);
    });

    it('should average with string mapper', () => {
      assertEqual(average({1:{age:2},2:{age:5}}, 'age'), 3.5);
      assertNaN(average({1:{age:2},2:{age:5}}, 'height'));
    });

    it('should handle deep properties', () => {
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

    it('should handle irregular input', () => {
      assertEqual(average({a:null,b:false}), 0);
      assertNaN(average({a:NaN,b:NaN}));
      assertError(() => { average(); });
      assertError(() => { average(null); });
      assertError(() => { average(1); });
      assertError(() => { average('a'); });
    });

  });

  describeInstance('median', (median) => {

    it('should median average all values with no arguments', () => {
      assertEqual(median({a:1,b:5,c:7}), 5);
      assertEqual(median({a:1,b:5,c:6,d:8}), 5.5);
      assertEqual(median({a:8,b:6,c:5,d:1}), 5.5);
      assertEqual(median({a:8,b:5,c:6,d:1}), 5.5);
      assertEqual(median({a:1,b:80,c:81}), 80);
      assertEqual(median({a:0,b:0,c:0}), 0);
      assertEqual(median({}), 0);
    });

    it('should median average with function mapper', () => {
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n * 2), 5);
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n % 2 === 0 ? n : 0), 1);
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n > 5 ? n : 0), 0);
      assertEqual(median({a:1,b:2,c:3,d:4}, (key, n) => n > 2 ? n : 0), 1.5);
    });

    it('should average with string mapper', () => {
      assertEqual(median({1:{age:2},2:{age:5}}, 'age'), 3.5);
      assertNaN(median({1:{age:2},2:{age:5}}, 'height'));
    });

    it('should handle deep properties', () => {
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

    it('should handle irregular input', () => {
      assertEqual(median({a:null,b:false}), 0);
      assertNaN(median({a:NaN,b:NaN}));
      assertError(() => { median(); });
      assertError(() => { median(null); });
      assertError(() => { median(1); });
      assertError(() => { median('a'); });
    });

  });

  describeInstance('minKey', (minKey) => {

    it('should work with no arguments', () => {
      assertEqual(minKey({a:1,b:2,c:3}), 'a');
      assertEqual(minKey({a:0,b:0,c:0}), 'a');
    });

    it('should allow a function mapper', () => {
      assertEqual(minKey({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), 'd');
    });

    it('should allow a string mapper', () => {
      assertEqual(minKey({1:{age:5},2:{age:2}}, 'age'), '2');
      assertEqual(minKey({1:{age:2},2:{age:5}}, 'height'), '1');
    });

    it('should handle deep properties', () => {
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

    it('should handle infinite values', () => {
      assertEqual(minKey({a:Infinity}), 'a');
      assertEqual(minKey({a:-Infinity}), 'a');
    });

    it('should pass correct arguments', () => {
      minKey({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(minKey({}), undefined);
      assertEqual(minKey({a:'a',b:'b',c:'c'}), 'a');
      assertEqual(minKey({a:null, b:false}), 'a');
      assertError(() => { minKey(); });
      assertError(() => { minKey(null); });
      assertError(() => { minKey(1); });
      assertError(() => { minKey('a'); });
    });

  });

  describeInstance('minKeys', (minKeys) => {

    it('should work with no arguments', () => {
      assertArrayEqual(minKeys({a:1,b:2,c:3}), ['a']);
      assertArrayEqual(minKeys({a:1,b:1,c:3}), ['a','b']);
      assertArrayEqual(minKeys({a:0,b:0,c:0}), ['a','b','c']);
    });

    it('should allow a function mapper', () => {
      assertArrayEqual(minKeys({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), ['d']);
    });

    it('should allow a string mapper', () => {
      assertArrayEqual(minKeys({1:{age:5},2:{age:2}}, 'age'), ['2']);
      assertArrayEqual(minKeys({1:{age:2},2:{age:5}}, 'height'), ['1', '2']);
    });

    it('should handle deep properties', () => {
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

    it('should handle infinite values', () => {
      assertArrayEqual(minKeys({a:Infinity}), ['a']);
      assertArrayEqual(minKeys({a:-Infinity}), ['a']);
    });

    it('should pass correct arguments', () => {
      minKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertArrayEqual(minKeys({}), []);
      assertArrayEqual(minKeys({a:'a',b:'b',c:'c'}), ['a']);
      assertArrayEqual(minKeys({a:null, b:false}), ['a']);
      assertError(() => { minKeys(); });
      assertError(() => { minKeys(null); });
      assertError(() => { minKeys(1); });
      assertError(() => { minKeys('a'); });
    });

  });

  describeInstance('maxKey', (maxKey) => {

    it('should work with no arguments', () => {
      assertEqual(maxKey({a:1,b:2,c:3}), 'c');
      assertEqual(maxKey({a:0,b:0,c:0}), 'a');
    });

    it('should allow a function mapper', () => {
      assertEqual(maxKey({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), 'a');
    });

    it('should allow a string mapper', () => {
      assertEqual(maxKey({1:{age:5},2:{age:2}}, 'age'), '1');
      assertEqual(maxKey({1:{age:2},2:{age:5}}, 'height'), '1');
    });

    it('should handle deep properties', () => {
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

    it('should handle infinite values', () => {
      assertEqual(maxKey({a:Infinity}), 'a');
      assertEqual(maxKey({a:-Infinity}), 'a');
    });

    it('should pass correct arguments', () => {
      maxKey({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertEqual(maxKey({}), undefined);
      assertEqual(maxKey({a:'a',b:'b',c:'c'}), 'c');
      assertEqual(maxKey({a:null, b:false}), 'a');
      assertError(() => { maxKey(); });
      assertError(() => { maxKey(null); });
      assertError(() => { maxKey(1); });
      assertError(() => { maxKey('a'); });
    });

  });

  describeInstance('maxKeys', (maxKeys) => {

    it('should work with no arguments', () => {
      assertArrayEqual(maxKeys({a:1,b:2,c:3}), ['c']);
      assertArrayEqual(maxKeys({a:1,b:3,c:3}), ['b','c']);
      assertArrayEqual(maxKeys({a:0,b:0,c:0}), ['a','b','c']);
    });

    it('should allow a function mapper', () => {
      assertArrayEqual(maxKeys({a:1,b:2,c:3,d:4}, (key, n) => 1 / n), ['a']);
    });

    it('should allow a string mapper', () => {
      assertArrayEqual(maxKeys({1:{age:5},2:{age:2}}, 'age'), ['1']);
      assertArrayEqual(maxKeys({1:{age:2},2:{age:5}}, 'height'), ['1', '2']);
    });

    it('should handle deep properties', () => {
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

    it('should handle infinite values', () => {
      assertArrayEqual(maxKeys({a:Infinity}), ['a']);
      assertArrayEqual(maxKeys({a:-Infinity}), ['a']);
    });

    it('should pass correct arguments', () => {
      maxKeys({a:1}, function (key, val, obj) {
        assertEqual(key, 'a');
        assertEqual(val, 1);
        assertObjectEqual(obj, {a:1});
      });
    });

    it('should handle irregular input', () => {
      assertArrayEqual(maxKeys({}), []);
      assertArrayEqual(maxKeys({a:'a',b:'b',c:'c'}), ['c']);
      assertArrayEqual(maxKeys({a:null, b:false}), ['a']);
      assertError(() => { maxKeys(); });
      assertError(() => { maxKeys(null); });
      assertError(() => { maxKeys(1); });
      assertError(() => { maxKeys('a'); });
    });

  });

  describeInstance('reduce', (reduce) => {

    it('should accumulate the result of the passed function', () => {
      assertEqual(reduce({a:1}, () => 1), 1);
      assertEqual(reduce({a:1,b:2,c:3}, () => 1), 1);
    });

    it('should be able to perform basic sum', () => {
      assertEqual(reduce({a:1,b:2,c:3}, (acc, key, val) => acc + val), 6);
      assertEqual(reduce({a:1,b:2,c:3}, (acc, key, val) => acc + val, 0), 6);
    });

    it('should have correct arguments when no initial value passed', () => {
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

    it('should have correct arguments when initial value passed', () => {
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

    it('should correctly iterate when initial value is undefined', () => {
      reduce({a:1}, (acc) => {
        assertEqual(acc, undefined);
      }, undefined);
    });

    it('should error when object empty and no initial value', () => {
      assertError(() => { reduce({}, () => {}) }, TypeError);
    });
  });

  describeInstance('isEmpty', (isEmpty) => {

    it('should report true for empty objects', () => {
      assertTrue(isEmpty({}));
    });

    it('should report false for non-empty objects', () => {
      assertFalse(isEmpty({a:1}));
      assertFalse(isEmpty({a:null}));
      assertFalse(isEmpty({a:undefined}));
    });

    it('should work correctly on class instances', () => {
      function Foo(a) {
        if (a) {
          this.a = a;
        }
      }
      assertTrue(isEmpty(new Foo));
      assertFalse(isEmpty(new Foo(1)));
    });

    it('should handle irregular input', () => {
      assertError(() => { isEmpty(null); });
      assertError(() => { isEmpty('8'); });
      assertError(() => { isEmpty(8); });
    });

  });

  describeInstance('size', (size) => {

    it('should report correct size of objects', () => {
      assertEqual(size({}), 0);
      assertEqual(size({a:1}), 1);
      assertEqual(size({a:1,b:2,c:3}), 3);
      assertEqual(size({a:null}), 1);
      assertEqual(size({a:undefined}), 1);
    });

    it('should work correctly on class instances', () => {
      function Foo(a) {
        if (a) {
          this.a = a;
        }
      }
      assertEqual(size(new Foo), 0);
      assertEqual(size(new Foo(1)), 1);
    });

    it('should handle irregular input', () => {
      assertError(() => { size(null); });
      assertError(() => { size('8'); });
      assertError(() => { size(8); });
    });

  });

  describeInstance('isEqual', (isEqual) => {

    it('should handle primitives', () => {
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

    it('should handle irregular primitive cases', () => {
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

    it('should function as expected with insufficient arguments', () => {
      assertEqual(isEqual(), true);
      assertEqual(isEqual(undefined), true);
      assertEqual(isEqual(null), false);
      assertEqual(isEqual(''), false);
      assertEqual(isEqual(NaN), false);
      assertEqual(isEqual(0), false);
    });

    it('should distinguish primitives from wrapped counterparts', () => {
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

    it('should distinguish common type coercions', () => {
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

    it('should handle plain objects', () => {
      assertEqual(isEqual({}, {}), true);
      assertEqual(isEqual({a:1}, {a:1}), true);
      assertEqual(isEqual({a:1}, {a:2}), false);
      assertEqual(isEqual({a:1,b:2}, {a:1,b:2}), true);
      assertEqual(isEqual({a:1,b:2}, {a:1}), false);
      assertEqual(isEqual({b:2}, {a:1,b:2}), false);
    });

    it('should distinguish missing keys', () => {
      assertEqual(isEqual({a:undefined}, {}), false);
      assertEqual(isEqual({}, {a:undefined}), false);
    });

    it('should distinguish object types', () => {
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

    it('should handle object references', () => {
      const obj1 = {a:1};
      const obj2 = {a:1};
      assertEqual(isEqual({a:obj1,b:obj1}, {a:obj1,b:obj1}), true);
      assertEqual(isEqual({a:obj2,b:obj1}, {a:obj1,b:obj1}), true);
      assertEqual(isEqual({a:obj1,b:obj2}, {a:obj1,b:obj1}), true);
      assertEqual(isEqual({a:obj1,b:obj1}, {a:obj2,b:obj1}), true);
      assertEqual(isEqual({a:obj1,b:obj1}, {a:obj1,b:obj2}), true);
    });

    it('should handle cyclic references', () => {
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

    it('should complex nested objects', () => {
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

    it('should function as expected for arrays', () => {
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

    it('should handle object references inside arrays', () => {
      const obj1 = {a:1};
      const obj2 = {a:2};
      assertEqual(isEqual([obj1, obj2], [obj1, obj2]), true);
      assertEqual(isEqual([obj1, obj2], [obj2, obj1]), false);
      assertEqual(isEqual([obj1, obj2], [obj1]), false);
      assertEqual(isEqual([obj1], [obj1, obj2]), false);
    });

    it('should distinguish arrays and arguments', () => {
      const args1 = (() => {
        return arguments;
      })('a','b','c');
      const args2 = (() => {
        return arguments;
      })('a','b','c');
      assertEqual(isEqual(args1, args2), true);
      assertEqual(isEqual(['a','b','c'], args1), false);
      assertEqual(isEqual(args1, ['a','b','c']), false);
    });

    it('should handle irregular array cases', () => {
      assertEqual(isEqual([], {}), false);
      assertEqual(isEqual([0], [0]), true);
      assertEqual(isEqual([undefined], [undefined]), true);
      assertEqual(isEqual([null], [null]), true);
      assertEqual(isEqual([NaN], [NaN]), true);
    });

    it('should distinguish sparse and dense arrays', () => {
      assertEqual(isEqual(new Array(3), new Array(3)), true);
      assertEqual(isEqual(new Array(3), new Array(6)), false);
      assertEqual(isEqual(new Array(6), new Array(3)), false);
      assertEqual(isEqual([,1], [undefined,1]), false);
    });

    it('should function as expected for dates', () => {
      assertEqual(isEqual(new Date(2020, 8, 7), new Date(2020, 8, 7)), true);
      assertEqual(isEqual(new Date(2020, 8, 7), new Date(2020, 8, 8)), false);
      assertEqual(isEqual(new Date(2020, 8, 7), new Date(2020, 8, 7, 0, 0, 0, 1)), false);
      assertEqual(isEqual(new Date(1599470036490), { getTime: () => 1599470036490 }), false);
      assertEqual(isEqual({ getTime: () => 1599470036490 }, new Date(1599470036490)), false);
      assertEqual(isEqual(new Date('Invalid'), new Date('Invalid')), true);
    });

    it('should function as expected for functions', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      assertEqual(isEqual(fn1, fn1), true);
      assertEqual(isEqual(fn1, fn2), false);
      assertEqual(isEqual(fn2, fn1), false);
    });

    it('should function as expected for regexes', () => {
      assertEqual(isEqual(/a/, /a/), true);
      assertEqual(isEqual(/a/, /a/i), false);
      assertEqual(isEqual(/a/i, /a/), false);
      assertEqual(isEqual(/a/gim, /a/gim), true);
      assertEqual(isEqual(/a/gim, /b/gim), false);
      assertEqual(isEqual(/b/gim, /a/gim), false);
    });

    it('should function as expected for class instances', () => {
      function Foo(val) {
        this.value = val;
      }
      assertEqual(isEqual(new Foo, new Foo), false);
      assertEqual(isEqual({value: 1}, new Foo(1)), false);
      assertEqual(isEqual(new Foo(1), {value: 1}), false);
    });

    it('should function as expected for sets', () => {
      assertEqual(isEqual(new Set([1]), new Set([1])), true);
      assertEqual(isEqual(new Set([1]), new Set([2])), false);
      assertEqual(isEqual(new Set([2]), new Set([1])), false);
    });

    it('should function as expected for maps', () => {
      assertEqual(isEqual(new Map([[1,1]]), new Map([[1,1]])), true);
      assertEqual(isEqual(new Map([[1,1]]), new Map([[1,2]])), false);
      assertEqual(isEqual(new Map([[1,2]]), new Map([[1,1]])), false);
    });

    it('should function as expected for typed arrays', () => {
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

    it('should only return true for symbols by reference', () => {
      const sym = Symbol('a');
      assertEqual(isEqual(sym, sym), true);
      assertEqual(isEqual(Symbol('a'), Symbol('a')), false);
      assertEqual(isEqual(Object(sym), sym), false);
      assertEqual(isEqual(Object(sym), Object(sym)), false);
    });

    it('should function as expected for errors', () => {
      assertEqual(isEqual(new Error, new Error), true);
      assertEqual(isEqual(new Error('a'), new Error('a')), true);
      assertEqual(isEqual(new TypeError('a'), new TypeError('a')), true);
      assertEqual(isEqual(new Error, new TypeError), false);
      assertEqual(isEqual(new TypeError, new Error), false);
    });

    it('should function as expected with overwritten isEqual', () => {
      assertEqual(isEqual({}, {
        isEqual: () => true,
      }), false);
    });

  });

  describeInstance('intersect', (intersect) => {

    it('should intersect with second value', () => {
      assertObjectEqual(intersect({a:1}, {a:1}), {a:1});
      assertObjectEqual(intersect({a:1}, {a:2}), {a:2});
      assertObjectEqual(intersect({a:1}, {a:2,b:2}), {a:2});
      assertObjectEqual(intersect({a:1,b:2}, {a:2}), {a:2});
      assertObjectEqual(intersect({a:1,b:2}, {a:2,b:2}), {a:2,b:2});
      assertObjectEqual(intersect({a:1}, {}), {});
      assertObjectEqual(intersect({}, {a:1}), {});
      assertObjectEqual(intersect({}, {}), {});
    });

    it('should intersect with resolver', () => {
      function add(key, n1, n2) {
        return n1 + n2;
      }
      assertObjectEqual(intersect({a:1}, {a:1}, add), {a:2});
      assertObjectEqual(intersect({a:1,b:2}, {b:2,c:3}, add), {b:4});
      assertObjectEqual(intersect({}, {}, add), {});
    });

    it('should pass correct arguments to resolver', () => {
      intersect({a:1}, {a:2}, (key, val1, val2, obj1, obj2) => {
        assertEqual(key, 'a');
        assertEqual(val1, 1);
        assertEqual(val2, 2);
        assertObjectEqual(obj1, {a:1});
        assertObjectEqual(obj2, {a:2});
      });
    });

    it('should handle irregular input', () => {
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

  describeInstance('subtract', (subtract) => {

    it('should correctly subtract on primitive values', () => {
      assertObjectEqual(subtract({a:1}, {a:1}), {});
      assertObjectEqual(subtract({a:1}, {a:1,b:2}), {});
      assertObjectEqual(subtract({a:1,b:2}, {a:1}), {b:2});
      assertObjectEqual(subtract({a:1,b:2}, {a:1,b:2}), {});
      assertObjectEqual(subtract({a:1}, {a:2}), {a:1});
      assertObjectEqual(subtract({a:1}, {}), {a:1});
      assertObjectEqual(subtract({}, {a:1}), {});
      assertObjectEqual(subtract({}, {}), {});
    });

    it('should correctly subtract on nested objects', () => {
      assertObjectEqual(subtract({a:{b:1}}, {a:{b:1}}), {});
      assertObjectEqual(subtract({a:{b:1}}, {a:{b:2}}), {a:{b:1}});
      assertObjectEqual(subtract({a:{b:2}}, {a:{b:1}}), {a:{b:2}});
      assertObjectEqual(subtract({a:{b:1}}, {a:{b:1,c:1}}), {a:{b:1}});
      assertObjectEqual(subtract({a:{b:1,c:1}}, {a:{b:1}}), {a:{b:1,c:1}});
      assertObjectEqual(subtract({a:{b:1},c:{b:2}}, {a:{b:1}}), {c:{b:2}});
    });

    it('should correctly subtract on function references', () => {
      const fn1 = () => {};
      const fn2 = () => {};
      assertObjectEqual(subtract({a:{b:fn1}}, {a:{b:fn1}}), {});
      assertObjectEqual(subtract({a:{b:fn1}}, {a:{b:fn2}}), {a:{b:fn1}});
      assertObjectEqual(subtract({a:{b:fn2}}, {a:{b:fn1}}), {a:{b:fn2}});
    });

    it('should distinguish non-equivalent values', () => {
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

    it('should handle irregular input', () => {
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

  describeInstance('merge', (merge) => {

    it('should merge with no collisions', () => {
      assertObjectEqual(merge({a:1}, {b:2}), {a:1,b:2});
      assertObjectEqual(merge({a:2}, {b:1}), {a:2,b:1});
      assertObjectEqual(merge({a:1}, {}), {a:1});
      assertObjectEqual(merge({}, {a:1}), {a:1});
      assertObjectEqual(merge({}, {}), {});
    });

    it('should merge with collisions', () => {
      assertObjectEqual(merge({a:1}, {a:1}), {a:1});
      assertObjectEqual(merge({a:1}, {a:2}), {a:2});
      assertObjectEqual(merge({a:1}, {a:1,b:2}), {a:1,b:2});
      assertObjectEqual(merge({a:1,b:2}, {a:1}), {a:1,b:2});
      assertObjectEqual(merge({a:1,b:2}, {a:1,b:2}), {a:1,b:2});
      assertObjectEqual(merge({a:1}, {a:[1]}), {a:[1]});
      assertObjectEqual(merge({a:1}, {a:{b:1}}), {a:{b:1}});
    });

    it('should deeply merge plain objects', () => {
      assertObjectEqual(merge({a:{a:1}}, {a:{}}), {a:{a:1}});
      assertObjectEqual(merge({a:{}}, {a:{a:1}}), {a:{a:1}});
      assertObjectEqual(merge({a:{a:1}}, {a:{a:2}}), {a:{a:2}});
      assertObjectEqual(merge({a:{a:1}}, {a:{b:2}}), {a:{a:1,b:2}});
      assertObjectEqual(
        merge({a:{a:{a:{a:1}}}}, {a:{a:{a:{b:2}}}}),
        {a:{a:{a:{a:1,b:2}}}}
      );
    });

    it('should not deeply merge arrays', () => {
      assertObjectEqual(merge({a:[]}, {a:[1]}), {a:[1]});
      assertObjectEqual(merge({a:[1,2,3]}, {a:[4,5,6]}), {a:[4,5,6]});
    });

    it('should not deeply merge known built-in types', () => {
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

    it('should merge falsy values', () => {
      assertObjectEqual(merge({a:1}, {a:null}), {a:null});
      assertObjectEqual(merge({a:1}, {a:undefined}), {a:undefined});
      assertObjectEqual(merge({a:1}, {a:0}), {a:0});
      assertObjectEqual(merge({a:1}, {a:NaN}), {a:NaN});
      assertObjectEqual(merge({a:1}, {a:Infinity}), {a:Infinity});
      assertObjectEqual(merge({a:1}, {a:''}), {a:''});
      assertObjectEqual(merge({a:1}, {a:false}), {a:false});
    });

    it('should modify the object', () => {
      const obj = {a:1};
      const result = merge(obj, {b:2});
      assertObjectEqual(result, {a:1,b:2});
      assertEqual(result, obj);
    });

    it('should modify deeply merged objects', () => {
      const obj1 = {a:{a:1}};
      const obj2 = {a:{b:2}};
      const a = obj1.a;
      const result = merge(obj1, obj2);
      assertObjectEqual(result, {a:{a:1,b:2}});
      assertObjectEqual(obj1, {a:{a:1,b:2}});
      assertObjectEqual(obj2, {a:{b:2}});
      assertEqual(obj1.a, a);
    });

    it('should be able to merge from multiple sources', () => {
      assertObjectEqual(merge({a:1},{b:2},{c:3},{d:4}), {a:1,b:2,c:3,d:4});
    });

    it('should be able to merge from multiple sources with a resolver', () => {
      assertObjectEqual(merge({a:1},{a:2},{a:3},{a:4}, (key, n1, n2) => {
        return n1 + n2;
      }), {a:10});
    });

    it('should merge with resolver', () => {
      function fn(key, n1, n2) {
        return n1 + n2;
      }
      assertObjectEqual(merge({a:1}, {a:1}, fn), {a:2});
      assertObjectEqual(merge({a:1,b:2}, {b:2,c:3}, fn), {a:1,b:4,c:3});
      assertObjectEqual(merge({}, {}, fn), {});
    });

    it('should take resolver value and not continue deep merge', () => {
      assertObjectEqual(merge({a:{a:1}}, {a:{a:2}}, () => {
        return { a: 3 };
      }), {a:{a:3}});
    });

    it('should handle normally when resolver returns undefined', () => {
      assertObjectEqual(merge({a:{a:1}}, {a:{b:2}}, () => {}), {a:{a:1,b:2}});
    });

    it('should merge complex with resolver', () => {
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

    it('should pass correct arguments to resolver', () => {
      merge({a:1}, {a:2}, (key, val1, val2, obj1, obj2) => {
        assertEqual(key, 'a');
        assertEqual(val1, 1);
        assertEqual(val2, 2);
        assertObjectEqual(obj1, {a:1});
        assertObjectEqual(obj2, {a:2});
      });
    });

    it('should merge objects with null prototypes', () => {
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

    it('should not merge non-enumerable properties', () => {
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

    it('should merge enumerable getters by value', () => {
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

    it('should not merge inherited properties', () => {
      const obj = Object.create({c:3}, {
        b: {
          enumerable: true,
          value: 2,
        }
      });
      const result = merge({a:1}, obj);
      assertObjectEqual(result, {a:1,b:2});
    });

    it('should raise an error on arrays', () => {
      assertError(() => {
        merge({}, []);
      }, TypeError);
      assertError(() => {
        merge([], {});
      }, TypeError);
    });

    it('should raise an error for class instances', () => {
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

    it('should merge enumerable symbols', () => {
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

    it('should raise an error for built-in objects', () => {
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

    it('should raise an error cyclic objects', () => {
      assertError(() => {
        const obj = {};
        obj.a = obj;
        merge(obj, obj);
      }, TypeError);
    });

    it('should handle Issue #335', () => {
      assertObjectEqual(merge({a:{b:1}}, {a:{b:2,c:3}}, (key, tVal) => {
        if (key === 'b') {
          return tVal;
        }
      }), {a:{b:1,c:3}});
    });

    it('should handle Issue #365', () => {
      assertObjectEqual(merge({a:''}, {a:{b:1}}), {a:{b:1}});
      assertObjectEqual(merge({a:'1'}, {a:{b:1}}), {a:{b:1}});
    });

    it('should handle irregular input', () => {
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

  describeInstance('add', (add) => {

    it('should add with no collisions', () => {
      assertObjectEqual(add({a:1}, {b:2}), {a:1,b:2});
      assertObjectEqual(add({a:2}, {b:1}), {a:2,b:1});
      assertObjectEqual(add({a:1}, {}), {a:1});
      assertObjectEqual(add({}, {a:1}), {a:1});
      assertObjectEqual(add({}, {}), {});
    });

    it('should add with collisions', () => {
      assertObjectEqual(add({a:1}, {a:1}), {a:1});
      assertObjectEqual(add({a:1}, {a:2}), {a:2});
      assertObjectEqual(add({a:1}, {a:1,b:2}), {a:1,b:2});
      assertObjectEqual(add({a:1,b:2}, {a:1}), {a:1,b:2});
      assertObjectEqual(add({a:1,b:2}, {a:1,b:2}), {a:1,b:2});
      assertObjectEqual(add({a:1}, {a:[1]}), {a:[1]});
      assertObjectEqual(add({a:1}, {a:{b:1}}), {a:{b:1}});
    });

    it('should deeply add plain objects', () => {
      assertObjectEqual(add({a:{a:1}}, {a:{}}), {a:{a:1}});
      assertObjectEqual(add({a:{}}, {a:{a:1}}), {a:{a:1}});
      assertObjectEqual(add({a:{a:1}}, {a:{a:2}}), {a:{a:2}});
      assertObjectEqual(add({a:{a:1}}, {a:{b:2}}), {a:{a:1,b:2}});
      assertObjectEqual(
        add({a:{a:{a:{a:1}}}}, {a:{a:{a:{b:2}}}}),
        {a:{a:{a:{a:1,b:2}}}}
      );
    });

    it('should not deeply add arrays', () => {
      assertObjectEqual(add({a:[]}, {a:[1]}), {a:[1]});
      assertObjectEqual(add({a:[1,2,3]}, {a:[4,5,6]}), {a:[4,5,6]});
    });

    it('should not deeply add known built-in types', () => {
      assertObjectEqual(add({a:/a/}, {a:/b/}), {a:/b/});
      assertObjectEqual(
        add(
          {a:new Date(2020, 9, 11)},
          {a:new Date(2020, 9, 12)},
        ),
        {a:new Date(2020, 9, 12)},
      );
      assertObjectEqual(
        add(
          {a:new Set([1,2,3])},
          {a:new Set([1,2,4])},
        ),
        {a:new Set([1,2,4])},
      );
      assertObjectEqual(
        add(
          {a:new Map([[1,2]])},
          {a:new Map([[1,3]])},
        ),
        {a:new Map([[1,3]])},
      );
    });

    it('should add falsy values', () => {
      assertObjectEqual(add({a:1}, {a:null}), {a:null});
      assertObjectEqual(add({a:1}, {a:undefined}), {a:undefined});
      assertObjectEqual(add({a:1}, {a:0}), {a:0});
      assertObjectEqual(add({a:1}, {a:NaN}), {a:NaN});
      assertObjectEqual(add({a:1}, {a:Infinity}), {a:Infinity});
      assertObjectEqual(add({a:1}, {a:''}), {a:''});
      assertObjectEqual(add({a:1}, {a:false}), {a:false});
    });

    it('should not modify the object', () => {
      const obj = {a:1};
      const result = add(obj, {b:2});
      assertObjectEqual(result, {a:1,b:2});
      assertFalse(result === obj);
    });

    it('should not modify deeply added objects', () => {
      const obj1 = {a:{a:1}};
      const obj2 = {a:{b:2}};
      const result = add(obj1, obj2);
      assertObjectEqual(result, {a:{a:1,b:2}});
      assertObjectEqual(obj1, {a:{a:1}});
      assertObjectEqual(obj2, {a:{b:2}});
    });

    it('should be able to add from multiple sources', () => {
      assertObjectEqual(add({a:1},{b:2},{c:3},{d:4}), {a:1,b:2,c:3,d:4});
    });

    it('should be able to add from multiple sources with a resolver', () => {
      assertObjectEqual(add({a:1},{a:2},{a:3},{a:4}, (key, n1, n2) => {
        return n1 + n2;
      }), {a:10});
    });

    it('should add with resolver', () => {
      function fn(key, n1, n2) {
        return n1 + n2;
      }
      assertObjectEqual(add({a:1}, {a:1}, fn), {a:2});
      assertObjectEqual(add({a:1,b:2}, {b:2,c:3}, fn), {a:1,b:4,c:3});
      assertObjectEqual(add({}, {}, fn), {});
    });

    it('should take resolver value and not continue deep add', () => {
      assertObjectEqual(add({a:{a:1}}, {a:{a:2}}, () => {
        return { a: 3 };
      }), {a:{a:3}});
    });

    it('should handle normally when resolver returns undefined', () => {
      assertObjectEqual(add({a:{a:1}}, {a:{b:2}}, () => {}), {a:{a:1,b:2}});
    });

    it('should add complex with resolver', () => {
      assertObjectEqual(
        add({
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

    it('should pass correct arguments to resolver', () => {
      add({a:1}, {a:2}, (key, val1, val2, obj1, obj2) => {
        assertEqual(key, 'a');
        assertEqual(val1, 1);
        assertEqual(val2, 2);
        assertObjectEqual(obj1, {a:1});
        assertObjectEqual(obj2, {a:2});
      });
    });

    it('should add objects with null prototypes', () => {
      assertObjectEqual(
        add(
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

    it('should not add non-enumerable properties', () => {
      assertObjectEqual(
        add(
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

    it('should add enumerable getters by value', () => {
      const result = add(
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

    it('should not add inherited properties', () => {
      const obj = Object.create({c:3}, {
        b: {
          enumerable: true,
          value: 2,
        }
      });
      const result = add({a:1}, obj);
      assertObjectEqual(result, {a:1,b:2});
    });

    it('should raise an error on arrays', () => {
      assertError(() => {
        add({}, []);
      }, TypeError);
      assertError(() => {
        add([], {});
      }, TypeError);
    });

    it('should raise an error for class instances', () => {
      function Foo() {}
      assertError(() => {
        add(new Foo, new Foo);
      }, TypeError);
      assertError(() => {
        add({}, new Foo);
      }, TypeError);
      assertError(() => {
        add(new Foo, {});
      }, TypeError);
    });

    it('should add enumerable symbols', () => {
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
      const result = add({}, obj);
      assertEqual(result[sym1], 1);
      assertFalse(sym2 in result);
    });

    it('should raise an error for built-in objects', () => {
      assertError(() => {
        add(/a/, /b/);
      }, TypeError);
      assertError(() => {
        add(new Date(), new Date());
      }, TypeError);
      assertError(() => {
        add(new Set(), new Set());
      }, TypeError);
      assertError(() => {
        add(new Map(), new Map());
      }, TypeError);
    });

    it('should raise an error cyclic objects', () => {
      assertError(() => {
        const obj = {};
        obj.a = obj;
        add(obj, obj);
      }, TypeError);
    });

    it('should handle Issue #335', () => {
      assertObjectEqual(add({a:{b:1}}, {a:{b:2,c:3}}, (key, tVal) => {
        if (key === 'b') {
          return tVal;
        }
      }), {a:{b:1,c:3}});
    });

    it('should handle Issue #365', () => {
      assertObjectEqual(add({a:''}, {a:{b:1}}), {a:{b:1}});
      assertObjectEqual(add({a:'1'}, {a:{b:1}}), {a:{b:1}});
    });

    it('should handle irregular input', () => {
      assertObjectEqual(add({}), {});
      assertError(() => {
        add();
      });
      assertError(() => {
        add(null, {});
      });
      assertError(() => {
        add(null, null);
      });
      assertError(() => {
        add(null, 5);
      });
    });
  });

  describeInstance('clone', (clone) => {

    it('should create a copy of the object', () => {
      const obj = {};
      assertFalse(clone(obj) === obj);
    });

    it('should not create a deep copy of the object', () => {
      const obj = {};
      assertTrue(clone({a:obj}).a === obj);
    });

    it('should clone basic primitive properties', () => {
      assertObjectEqual(clone({}), {});
      assertObjectEqual(clone({a:1,b:0}), {a:1,b:0});
      assertObjectEqual(clone({a:'a',b:''}), {a:'a',b:''});
      assertObjectEqual(clone({a:true,b:false}), {a:true,b:false});
    });

    it('should clone falsy values', () => {
      assertEqual(clone(null), null);
      assertEqual(clone(undefined), undefined);
      assertEqual(clone(NaN), NaN);
    });

    it('should clone nested falsy values', () => {
      assertObjectEqual(clone({a:null}), {a:null});
      assertObjectEqual(clone({a:undefined}), {a:undefined});
      assertObjectEqual(clone({a:0}), {a:0});
      assertObjectEqual(clone({a:''}), {a:''});
      assertObjectEqual(clone({a:false}), {a:false});
    });

    it('should clone objects with null prototypes', () => {
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

    it('should clone non-enumerable properties', () => {
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

    it('should clone enumerable getters', () => {
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

    it('should clone non-enumerable getters', () => {
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

    it('should clone inherited properties', () => {
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

    it('should clone arrays', () => {
      assertArrayEqual(clone([]), []);
      assertArrayEqual(clone([1,2,3]), [1,2,3]);
      assertArrayEqual(clone([null]), [null]);
      assertArrayEqual(clone([undefined]), [undefined]);
    });

    it('should clone typed arrays', () => {
      assertArrayEqual(clone(new Int8Array([1,2,3])), new Int8Array([1,2,3]));
      assertArrayEqual(clone(new Int16Array([1,2,3])), new Int16Array([1,2,3]));
      assertArrayEqual(clone(new Int32Array([1,2,3])), new Int32Array([1,2,3]));
      assertArrayEqual(clone(new Float32Array([1,2,3])), new Float32Array([1,2,3]));
      assertArrayEqual(clone(new Float64Array([1,2,3])), new Float64Array([1,2,3]));
      assertArrayEqual(clone(new ArrayBuffer(8)), new ArrayBuffer(8));
    });

    it('should clone dates', () => {
      assertDateEqual(clone(new Date(2020, 8, 13)), new Date(2020, 8, 13));
      assertDateEqual(clone(new Date(NaN)), new Date(NaN));
    });

    it('should clone regexes', () => {
      assertRegExpEqual(clone(/a/), /a/);
      assertRegExpEqual(clone(/a/gi), /a/gi);
    });

    it('should clone sets', () => {
      assertObjectEqual(clone(new Set()), new Set());
      assertObjectEqual(clone(new Set([1,2])), new Set([1,2]));
    });

    it('should clone maps', () => {
      assertObjectEqual(clone(new Map()), new Map());
      assertObjectEqual(clone(new Map([[1,2]])), new Map([[1,2]]));
    });

    it('should clone wrapped primitives', () => {
      assertObjectEqual(clone(new String('a')), new String('a'));
      assertObjectEqual(clone(new Number(5)), new Number(5));
      assertObjectEqual(clone(new Boolean(true)), new Boolean(true));
    });

    it('should throw an error on functions', () => {
      assertError(() => {
        clone(() => {});
      });
    });

    it('should throw an error on Arguments', () => {
      assertError(() => {
        (() => {
          clone(arguments);
        })();
      });
    });

    it('should throw an error on Symbol', () => {
      assertError(() => {
        clone(Symbol());
      });
    });

    it('should throw an error on WeakSet', () => {
      assertError(() => {
        clone(new WeakSet());
      });
    });

    it('should throw an error on WeakMap', () => {
      assertError(() => {
        clone(new WeakMap());
      });
    });

    it('should throw an error on errors', () => {
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

    it('should throw an error for class instances', () => {
      function Foo() {}
      assertError(() => {
        clone(new Foo);
      }, TypeError);
    });

  });

  describeInstance('has', (has) => {

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

  describeInstance('get', (get) => {

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

  describeInstance('set', (set) => {

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

  describeInstance('invert', (invert) => {

    it('should invert basic objects', () => {
      assertObjectEqual(invert({}), {});
      assertObjectEqual(invert({a:1}), {1:'a'});
      assertObjectEqual(invert({a:1,b:2}), {1:'a',2:'b'});
    });

    it('should overwrite collisions', () => {
      assertObjectEqual(invert({a:1,b:1,c:1}), {1:'c'});
    });

    it('should function as expected on nested objects', () => {
      assertObjectEqual(invert({a:{a:1}}), {'[object Object]':'a'});
    });

    it('should function as expected on arrays', () => {
      assertObjectEqual(invert({a:[1,2,3]}), {'1,2,3': 'a'});
    });

    it('should stringify keys using internal toString method', () => {
      const obj = {
        toString: () => {
          return 'b';
        }
      };
      assertObjectEqual(invert({a:obj}), {'b': 'a'});
    });

    it('should work with hasOwnProperty overwritten', () => {
      assertObjectEqual(invert({hasOwnProperty:true,a:1}), {true:'hasOwnProperty',1:'a'});
    });

    it('should handle irregular input', () => {
      assertError(() => {
        invert();
      });
      assertError(() => {
        invert(null);
      });
      assertError(() => {
        invert(undefined);
      });
      assertError(() => {
        invert('a');
      });
      assertError(() => {
        invert(5);
      });
    });

  });

  describeInstance('isObject', (isObject) => {

    it('should be true for plain objects', () => {
      assertTrue(isObject({}));
      assertTrue(isObject(new Object()));
      assertTrue(isObject(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isObject(null));
      assertFalse(isObject(undefined));
      assertFalse(isObject(NaN));
      assertFalse(isObject(0));
      assertFalse(isObject(5));
      assertFalse(isObject(''));
      assertFalse(isObject('a'));
      assertFalse(isObject(true));
      assertFalse(isObject(false));
    });

    it('should be true for functions', () => {
      assertTrue(isObject(function(){}));
    });

    it('should be true for wrapped primitives', () => {
      assertTrue(isObject(new String('a')));
      assertTrue(isObject(new Number(5)));
      assertTrue(isObject(new Boolean(true)));
    });

    it('should be true for built-in object types', () => {
      assertTrue(isObject([]));
      assertTrue(isObject(new Date()));
      assertTrue(isObject(new Uint8Array()));
      assertTrue(isObject(new Map()));
      assertTrue(isObject(new Set()));
      assertTrue(isObject(new Error()));
      assertTrue(isObject(/abc/));
    });

    it('should be true for class instances', () => {
      function Foo() {}
      assertTrue(isObject(new Foo));
    });

    it('should be true for arguments', () => {
      assertTrue(isObject((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isObject());
    });

  });

  describeInstance('isPlainObject', (isPlainObject) => {

    it('should be true for plain objects', () => {
      assertTrue(isPlainObject({}));
      assertTrue(isPlainObject(new Object()));
      assertTrue(isPlainObject(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isPlainObject(null));
      assertFalse(isPlainObject(undefined));
      assertFalse(isPlainObject(NaN));
      assertFalse(isPlainObject(0));
      assertFalse(isPlainObject(5));
      assertFalse(isPlainObject(''));
      assertFalse(isPlainObject('a'));
      assertFalse(isPlainObject(true));
      assertFalse(isPlainObject(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isPlainObject(new String('a')));
      assertFalse(isPlainObject(new Number(5)));
      assertFalse(isPlainObject(new Boolean(true)));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isPlainObject([]));
      assertFalse(isPlainObject(new Date()));
      assertFalse(isPlainObject(new Uint8Array()));
      assertFalse(isPlainObject(new Map()));
      assertFalse(isPlainObject(new Set()));
      assertFalse(isPlainObject(new Error()));
      assertFalse(isPlainObject(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isPlainObject(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isPlainObject(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isPlainObject((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isPlainObject());
    });

  });

  describeInstance('isArray', (isArray) => {

    it('should be false for plain objects', () => {
      assertFalse(isArray({}));
      assertFalse(isArray(new Object()));
      assertFalse(isArray(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isArray(null));
      assertFalse(isArray(undefined));
      assertFalse(isArray(NaN));
      assertFalse(isArray(0));
      assertFalse(isArray(5));
      assertFalse(isArray(''));
      assertFalse(isArray('a'));
      assertFalse(isArray(true));
      assertFalse(isArray(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isArray(new String('a')));
      assertFalse(isArray(new Number(5)));
      assertFalse(isArray(new Boolean(true)));
    });

    it('should be true for plain arrays', () => {
      assertTrue(isArray([]));
      assertTrue(isArray([1,2,3]));
      assertTrue(isArray(new Array()));
    });

    it('should be false for typed arrays and array buffer', () => {
      assertFalse(isArray(new Int8Array()));
      assertFalse(isArray(new Uint8Array()));
      assertFalse(isArray(new Uint8ClampedArray()));
      assertFalse(isArray(new Int16Array()));
      assertFalse(isArray(new Uint16Array()));
      assertFalse(isArray(new Int32Array()));
      assertFalse(isArray(new Uint32Array()));
      assertFalse(isArray(new Float32Array()));
      assertFalse(isArray(new Float64Array()));
      assertFalse(isArray(new ArrayBuffer()));
    });

    it('should be false for other built-in object types', () => {
      assertFalse(isArray(new Date()));
      assertFalse(isArray(new Map()));
      assertFalse(isArray(new Set()));
      assertFalse(isArray(new Error()));
      assertFalse(isArray(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isArray(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isArray(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isArray((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isArray());
    });

  });

  describeInstance('isTypedArray', (isTypedArray) => {

    it('should be false for plain objects', () => {
      assertFalse(isTypedArray({}));
      assertFalse(isTypedArray(new Object()));
      assertFalse(isTypedArray(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isTypedArray(null));
      assertFalse(isTypedArray(undefined));
      assertFalse(isTypedArray(NaN));
      assertFalse(isTypedArray(0));
      assertFalse(isTypedArray(5));
      assertFalse(isTypedArray(''));
      assertFalse(isTypedArray('a'));
      assertFalse(isTypedArray(true));
      assertFalse(isTypedArray(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isTypedArray(new String('a')));
      assertFalse(isTypedArray(new Number(5)));
      assertFalse(isTypedArray(new Boolean(true)));
    });

    it('should be false for plain arrays', () => {
      assertFalse(isTypedArray([]));
      assertFalse(isTypedArray([1,2,3]));
      assertFalse(isTypedArray(new Array()));
    });

    it('should be true for typed arrays and array buffer', () => {
      assertTrue(isTypedArray(new Int8Array()));
      assertTrue(isTypedArray(new Uint8Array()));
      assertTrue(isTypedArray(new Uint8ClampedArray()));
      assertTrue(isTypedArray(new Int16Array()));
      assertTrue(isTypedArray(new Uint16Array()));
      assertTrue(isTypedArray(new Int32Array()));
      assertTrue(isTypedArray(new Uint32Array()));
      assertTrue(isTypedArray(new Float32Array()));
      assertTrue(isTypedArray(new Float64Array()));
      assertTrue(isTypedArray(new ArrayBuffer()));
    });

    it('should be false for other built-in object types', () => {
      assertFalse(isTypedArray(new Date()));
      assertFalse(isTypedArray(new Map()));
      assertFalse(isTypedArray(new Set()));
      assertFalse(isTypedArray(new Error()));
      assertFalse(isTypedArray(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isTypedArray(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isTypedArray(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isTypedArray((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isTypedArray());
    });

  });

  describeInstance('isString', (isString) => {

    it('should be false for plain objects', () => {
      assertFalse(isString({}));
      assertFalse(isString(new Object()));
      assertFalse(isString(Object.create(null)));
    });

    it('should be true for string primitives', () => {
      assertTrue(isString(''));
      assertTrue(isString('a'));
    });

    it('should be false for other primitives', () => {
      assertFalse(isString(null));
      assertFalse(isString(undefined));
      assertFalse(isString(NaN));
      assertFalse(isString(0));
      assertFalse(isString(5));
      assertFalse(isString(true));
      assertFalse(isString(false));
    });

    it('should work as expected for wrapped primitives', () => {
      assertTrue(isString(new String('a')));
      assertFalse(isString(new Number(5)));
      assertFalse(isString(new Boolean(true)));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isString([]));
      assertFalse(isString(new Date()));
      assertFalse(isString(new Uint8Array()));
      assertFalse(isString(new Map()));
      assertFalse(isString(new Set()));
      assertFalse(isString(new Error()));
      assertFalse(isString(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isString(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isString(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isString((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isString());
    });

  });

  describeInstance('isNumber', (isNumber) => {

    it('should be false for plain objects', () => {
      assertFalse(isNumber({}));
      assertFalse(isNumber(new Object()));
      assertFalse(isNumber(Object.create(null)));
    });

    it('should be true for number primitives', () => {
      assertTrue(isNumber(NaN));
      assertTrue(isNumber(0));
      assertTrue(isNumber(-0));
      assertTrue(isNumber(5));
      assertTrue(isNumber(-Infinity));
      assertTrue(isNumber(Infinity));
    });

    it('should be false for other primitives', () => {
      assertFalse(isNumber(null));
      assertFalse(isNumber(undefined));
      assertFalse(isNumber(''));
      assertFalse(isNumber('a'));
      assertFalse(isNumber(true));
      assertFalse(isNumber(false));
    });

    it('should work as expected for wrapped primitives', () => {
      assertFalse(isNumber(new String('a')));
      assertTrue(isNumber(new Number(5)));
      assertFalse(isNumber(new Boolean(true)));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isNumber([]));
      assertFalse(isNumber(new Date()));
      assertFalse(isNumber(new Uint8Array()));
      assertFalse(isNumber(new Map()));
      assertFalse(isNumber(new Set()));
      assertFalse(isNumber(new Error()));
      assertFalse(isNumber(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isNumber(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isNumber(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isNumber((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isNumber());
    });

  });

  describeInstance('isBoolean', (isBoolean) => {

    it('should be false for plain objects', () => {
      assertFalse(isBoolean({}));
      assertFalse(isBoolean(new Object()));
      assertFalse(isBoolean(Object.create(null)));
    });

    it('should be true for boolean primitives', () => {
      assertTrue(isBoolean(true));
      assertTrue(isBoolean(false));
    });

    it('should be false for other primitives', () => {
      assertFalse(isBoolean(null));
      assertFalse(isBoolean(undefined));
      assertFalse(isBoolean(NaN));
      assertFalse(isBoolean(0));
      assertFalse(isBoolean(5));
      assertFalse(isBoolean(''));
      assertFalse(isBoolean('a'));
    });

    it('should work as expected for wrapped primitives', () => {
      assertFalse(isBoolean(new String('a')));
      assertFalse(isBoolean(new Number(5)));
      assertTrue(isBoolean(new Boolean(true)));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isBoolean([]));
      assertFalse(isBoolean(new Date()));
      assertFalse(isBoolean(new Uint8Array()));
      assertFalse(isBoolean(new Map()));
      assertFalse(isBoolean(new Set()));
      assertFalse(isBoolean(new Error()));
      assertFalse(isBoolean(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isBoolean(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isBoolean(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isBoolean((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isBoolean());
    });

  });

  describeInstance('isDate', (isDate) => {

    it('should be false for plain objects', () => {
      assertFalse(isDate({}));
      assertFalse(isDate(new Object()));
      assertFalse(isDate(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isDate(null));
      assertFalse(isDate(undefined));
      assertFalse(isDate(NaN));
      assertFalse(isDate(0));
      assertFalse(isDate(5));
      assertFalse(isDate(''));
      assertFalse(isDate('a'));
      assertFalse(isDate(true));
      assertFalse(isDate(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isDate(new String('a')));
      assertFalse(isDate(new Number(5)));
      assertFalse(isDate(new Boolean(true)));
    });

    it('should be true for dates', () => {
      assertTrue(isDate(new Date()));
      assertTrue(isDate(new Date('invalid')));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isDate([]));
      assertFalse(isDate(new Uint8Array()));
      assertFalse(isDate(new Map()));
      assertFalse(isDate(new Set()));
      assertFalse(isDate(new Error()));
      assertFalse(isDate(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isDate(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isDate(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isDate((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isDate());
    });

  });

  describeInstance('isFunction', (isFunction) => {

    it('should be false for plain objects', () => {
      assertFalse(isFunction({}));
      assertFalse(isFunction(new Object()));
      assertFalse(isFunction(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isFunction(null));
      assertFalse(isFunction(undefined));
      assertFalse(isFunction(NaN));
      assertFalse(isFunction(0));
      assertFalse(isFunction(5));
      assertFalse(isFunction(''));
      assertFalse(isFunction('a'));
      assertFalse(isFunction(true));
      assertFalse(isFunction(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isFunction(new String('a')));
      assertFalse(isFunction(new Number(5)));
      assertFalse(isFunction(new Boolean(true)));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isFunction([]));
      assertFalse(isFunction(new Date()));
      assertFalse(isFunction(new Uint8Array()));
      assertFalse(isFunction(new Map()));
      assertFalse(isFunction(new Set()));
      assertFalse(isFunction(new Error()));
      assertFalse(isFunction(/abc/));
    });

    it('should be true for functions', () => {
      assertTrue(isFunction(() => {}));
      assertTrue(isFunction(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isFunction(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isFunction((function() { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isFunction());
    });

  });

  describeInstance('isRegExp', (isRegExp) => {

    it('should be false for plain objects', () => {
      assertFalse(isRegExp({}));
      assertFalse(isRegExp(new Object()));
      assertFalse(isRegExp(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isRegExp(null));
      assertFalse(isRegExp(undefined));
      assertFalse(isRegExp(NaN));
      assertFalse(isRegExp(0));
      assertFalse(isRegExp(5));
      assertFalse(isRegExp(''));
      assertFalse(isRegExp('a'));
      assertFalse(isRegExp(true));
      assertFalse(isRegExp(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isRegExp(new String('a')));
      assertFalse(isRegExp(new Number(5)));
      assertFalse(isRegExp(new Boolean(true)));
    });

    it('should be true for regexes', () => {
      assertTrue(isRegExp(/abc/));
      assertTrue(isRegExp(RegExp('abc')));
      assertTrue(isRegExp(RegExp('abc', 'gim')));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isRegExp([]));
      assertFalse(isRegExp(new Date()));
      assertFalse(isRegExp(new Uint8Array()));
      assertFalse(isRegExp(new Map()));
      assertFalse(isRegExp(new Set()));
      assertFalse(isRegExp(new Error()));
    });

    it('should be false for functions', () => {
      assertFalse(isRegExp(() => {}));
      assertFalse(isRegExp(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isRegExp(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isRegExp((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isRegExp());
    });

  });

  describeInstance('isSet', (isSet) => {

    it('should be false for plain objects', () => {
      assertFalse(isSet({}));
      assertFalse(isSet(new Object()));
      assertFalse(isSet(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isSet(null));
      assertFalse(isSet(undefined));
      assertFalse(isSet(NaN));
      assertFalse(isSet(0));
      assertFalse(isSet(5));
      assertFalse(isSet(''));
      assertFalse(isSet('a'));
      assertFalse(isSet(true));
      assertFalse(isSet(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isSet(new String('a')));
      assertFalse(isSet(new Number(5)));
      assertFalse(isSet(new Boolean(true)));
    });

    it('should be true for sets', () => {
      assertTrue(isSet(new Set()));
      assertTrue(isSet(new Set([1,2,3])));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isSet([]));
      assertFalse(isSet(new Date()));
      assertFalse(isSet(new Uint8Array()));
      assertFalse(isSet(new Map()));
      assertFalse(isSet(new Error()));
      assertFalse(isSet(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isSet(() => {}));
      assertFalse(isSet(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isSet(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isSet((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isSet());
    });

  });

  describeInstance('isMap', (isMap) => {

    it('should be false for plain objects', () => {
      assertFalse(isMap({}));
      assertFalse(isMap(new Object()));
      assertFalse(isMap(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertFalse(isMap(null));
      assertFalse(isMap(undefined));
      assertFalse(isMap(NaN));
      assertFalse(isMap(0));
      assertFalse(isMap(5));
      assertFalse(isMap(''));
      assertFalse(isMap('a'));
      assertFalse(isMap(true));
      assertFalse(isMap(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isMap(new String('a')));
      assertFalse(isMap(new Number(5)));
      assertFalse(isMap(new Boolean(true)));
    });

    it('should be true for maps', () => {
      assertTrue(isMap(new Map()));
      assertTrue(isMap(new Map([[1,2]])));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isMap([]));
      assertFalse(isMap(new Date()));
      assertFalse(isMap(new Uint8Array()));
      assertFalse(isMap(new Set()));
      assertFalse(isMap(new Error()));
      assertFalse(isMap(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isMap(() => {}));
      assertFalse(isMap(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isMap(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isMap((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isMap());
    });

  });

  describeInstance('isPrimitive', (isPrimitive) => {

    it('should be false for plain objects', () => {
      assertFalse(isPrimitive({}));
      assertFalse(isPrimitive(new Object()));
      assertFalse(isPrimitive(Object.create(null)));
    });

    it('should be false for primitives', () => {
      assertTrue(isPrimitive(null));
      assertTrue(isPrimitive(undefined));
      assertTrue(isPrimitive(NaN));
      assertTrue(isPrimitive(0));
      assertTrue(isPrimitive(5));
      assertTrue(isPrimitive(''));
      assertTrue(isPrimitive('a'));
      assertTrue(isPrimitive(true));
      assertTrue(isPrimitive(false));
    });

    it('should be false for wrapped primitives', () => {
      assertFalse(isPrimitive(new String('a')));
      assertFalse(isPrimitive(new Number(5)));
      assertFalse(isPrimitive(new Boolean(true)));
    });

    it('should be false for built-in object types', () => {
      assertFalse(isPrimitive([]));
      assertFalse(isPrimitive(new Date()));
      assertFalse(isPrimitive(new Uint8Array()));
      assertFalse(isPrimitive(new Map()));
      assertFalse(isPrimitive(new Set()));
      assertFalse(isPrimitive(new Error()));
      assertFalse(isPrimitive(/abc/));
    });

    it('should be false for functions', () => {
      assertFalse(isPrimitive(function(){}));
    });

    it('should be false for class instances', () => {
      function Foo() {}
      assertFalse(isPrimitive(new Foo));
    });

    it('should be false for arguments', () => {
      assertFalse(isPrimitive((() => { return arguments; })()));
    });

    it('should handle irregular input', () => {
      assertFalse(isPrimitive());
    });

  });

});
