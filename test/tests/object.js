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
});
