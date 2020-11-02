'use strict';

describe('Chainable', () => {

  Sugar.createNamespace('Number');
  Sugar.createNamespace('String');
  Sugar.createNamespace('Object');
  Sugar.createNamespace('Array');
  Sugar.createNamespace('RegExp');
  Sugar.createNamespace('Function');

  describe('Constructor', () => {
    it('should instantiate with new keyword', () => {
      assertEqual(new Sugar.Number(1).raw, 1);
    });

    it('should throw an error without new keyword', () => {
      assertError(() => {
        Sugar.Number(1);
      });
    });

    it('should correctly construct numbers', () => {
      assertEqual(new Sugar.Number().raw, 0);
      assertEqual(new Sugar.Number(null).raw, 0);
      assertEqual(new Sugar.Number(5).raw, 5);
      assertEqual(new Sugar.Number('5').raw, 5);
      assertEqual(new Sugar.Number([]).raw, 0);
      assertEqual(new Sugar.Number(undefined).raw, 0);
      assertNaN(new Sugar.Number('a').raw);
    });

    it('should correctly construct strings', () => {
      assertEqual(new Sugar.String().raw, '');
      assertEqual(new Sugar.String(null).raw, 'null');
      assertEqual(new Sugar.String(5).raw, '5');
      assertEqual(new Sugar.String('5').raw, '5');
      assertEqual(new Sugar.String([]).raw, '');
      assertEqual(new Sugar.String(undefined).raw, '');
      assertEqual(new Sugar.String('a').raw, 'a');
    });

    it('should correctly construct arrays', () => {
      assertArrayEqual(new Sugar.Array().raw, []);
      assertArrayEqual(new Sugar.Array(null).raw, []);
      assertArrayEqual(new Sugar.Array(undefined).raw, []);
      assertArrayEqual(new Sugar.Array('abc').raw, ['a', 'b', 'c']);
      assertArrayEqual(new Sugar.Array({ a: 1 }).raw, []);
      assertArrayEqual(new Sugar.Array(new Set([1, 2, 3])).raw, [1, 2, 3]);
      assertArrayEqual(new Sugar.Array(new Map([[1, 2]])).raw, [[1, 2]]);
    });

    it('should correctly construct objects', () => {
      assertObjectEqual(new Sugar.Object().raw, {});
      assertObjectEqual(new Sugar.Object(undefined).raw, {});
      assertObjectEqual(new Sugar.Object({ a: 1 }).raw, { a: 1 });
      assertObjectEqual(new Sugar.Object(new Map([['a', 1]])).raw, { a: 1 });
      assertError(() => {
        new Sugar.Object(null);
      });
      assertError(() => {
        new Sugar.Object('abc');
      });
    });

    it('should correctly construct regexes', () => {
      assertRegExpEqual(new Sugar.RegExp(/abc/).raw, /abc/);
      assertRegExpEqual(new Sugar.RegExp(5).raw, /5/);
      assertRegExpEqual(new Sugar.RegExp('?').raw, /\?/);
      assertError(() => {
        new Sugar.RegExp();
      });
      assertError(() => {
        new Sugar.RegExp(null);
      });
      assertError(() => {
        new Sugar.RegExp(undefined);
      });
    });

    it('should correctly wrap Functions or throw', () => {
      const fn = () => {};
      assertEqual(new Sugar.Function(fn).raw, fn);
      assertError(() => {
        new Sugar.Function();
      });
    });
  });

  describe('Instance Methods', () => {
    it('should be able to define instance methods', () => {
      Sugar.Number.defineInstance('add', add);
      assertEqual(new Sugar.Number(5).add(5).raw, 10);
      delete Sugar.Number.add;
    });

    it('should be able to accept an arbitrary number of arguments', () => {
      Sugar.Number.defineInstance('add', function() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce((sum, n) => {
          return sum + n;
        }, 0);
      });
      assertEqual(
        new Sugar.Number(5).add(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).raw,
        60
      );
      delete Sugar.Number.add;
    });

    it('should throw an error when trying overwrite method', () => {
      Sugar.Number.defineInstance('add', add);
      assertError(function overwriteInstance() {
        Sugar.Number.defineInstance('add', mult);
      });
      delete Sugar.Number.add;
    });

    it('should allow chaining', () => {
      Sugar.Number.defineInstance('add', add);
      Sugar.Number.defineInstance('mult', mult);
      assertEqual(new Sugar.Number(5).add(5).mult(5).raw, 50);
      delete Sugar.Number.add;
      delete Sugar.Number.mult;
    });

    it('should allow chaining across namespaces', () => {
      // Note that Object is being used here as a safeguard as
      // it's behavior differs slightly when extending.
      Sugar.Number.defineInstance('argObject', arg2);
      Sugar.Object.defineInstance('argNumber', arg2);
      assertEqual(new Sugar.Number().argObject({}).argNumber(1).raw, 1);
      delete Sugar.Number.argObject;
      delete Sugar.Object.argNumber;
    });
  });

  describe('Wrapping Behavior', () => {
    beforeEach(() => {
      Sugar.Number.defineInstance('arg', arg2);
    });

    afterEach(() => {
      delete Sugar.Number.arg;
    });

    it('should not wrap boolean result', () => {
      assertFalse(new Sugar.Number(1).arg(false));
      assertTrue(new Sugar.Number(2).arg(true));
    });

    it('should not wrap null', () => {
      assertNull(new Sugar.Number(1).arg(null));
    });

    it('should not wrap undefined', () => {
      assertUndefined(new Sugar.Number(1).arg(undefined));
    });

    it('should wrap empty string', () => {
      assertEqual(new Sugar.Number(1).arg('').raw, '');
    });

    it('should wrap 0', () => {
      assertEqual(new Sugar.Number(1).arg(0).raw, 0);
    });

    it('should wrap NaN', () => {
      assertNaN(new Sugar.Number(1).arg(NaN).raw);
    });

    it('should wrap object result and initialize namespace', () => {
      ensureNamespaceNotInitialized('Object', () => {
        var obj = {};
        assertEqual(new Sugar.Number(1).arg(obj).raw, obj);
        assertTrue(!!Sugar.Object);
      });
    });

    it('should not initialize namespace for custom classes', () => {
      function Foo() {}
      new Sugar.Number(1).arg(new Foo());
      assertTrue(!Sugar.Foo);
    });

    it('should not initialize namespace for custom classes with same name as built-ins', () => {
      ensureNamespaceNotInitialized('Array', () => {
        function Array() {}
        new Sugar.Number(1).arg(new Array());
        assertTrue(!Sugar.Array);
      });
    });

    it('should not fail when object has no prototype', () => {
      if (Object.create) {
        var obj = Object.create(null);
        assertEqual(new Sugar.Number(1).arg(obj).raw, obj);
      }
    });
  });

  describe('Native Mapping', () => {
    it('should map native methods to chainable prototype', () => {
      assertEqual(new Sugar.Number(5).toFixed(2).raw, '5.00');
    });

    it('should chain defined methods alongside native', () => {
      Sugar.Number.defineInstance('add', add);
      Sugar.String.defineInstance('add', add);
      assertEqual(
        new Sugar.Number(5).add(5).toFixed(2).add('px').raw,
        '10.00px'
      );
      delete Sugar.Number.add;
      delete Sugar.String.add;
    });

    it('should coerce non-primitives', () => {
      assertEqual(new Sugar.Number(new Number(1)).raw, 1);
    });
  });

  describe('Operators', () => {
    var zero = new Sugar.Number(0);
    var two = new Sugar.Number(2);
    var a = new Sugar.String('a');

    it('should coerce double equals', () => {
      assertTrue(two == 2);
      assertTrue(2 == two);
      assertTrue(a == 'a');
      assertTrue('a' == a);
    });

    it('should coerce comparison operators', () => {
      assertEqual(two > 1, true);
      assertEqual(two > 3, false);
      assertEqual(1 < two, true);
      assertEqual(3 < two, false);
    });

    it('should coerce arithmetic operators', () => {
      assertEqual(two + 1, 3);
      assertEqual(2 + two, 4);
      assertEqual(two - 1, 1);
      assertEqual(5 - two, 3);
      assertEqual(two * 3, 6);
      assertEqual(4 * two, 8);
      assertEqual(two / 2, 1);
      assertEqual(6 / two, 3);
      assertEqual(two % 1, 0);
      assertEqual(7 % two, 1);
    });

    it('should coerce incrment operator', () => {
      var val = new Sugar.Number(1);
      val++;
      assertEqual(val, 2);
    });

    it('should coerce assignment operators', () => {
      var val = new Sugar.Number(1);
      val += 5;
      assertEqual(val, 6);
    });

    it('should coerce bitwise operators', () => {
      assertEqual(two | 1, 3);
      assertEqual(1 | two, 3);
    });

    it('should coerce unary operators', () => {
      assertEqual(+two, 2);
      assertEqual(-two, -2);
    });

    it('should coerce string concatenation operator', () => {
      assertEqual(a + 'b', 'ab');
      assertEqual('b' + a, 'ba');
    });

    it('should not coerce conditional operators', () => {
      assertTrue(zero ? true : false);
    });

    it('should not coerce logical operators', () => {
      assertFalse(zero && false);
    });
  });

  describe('toString', () => {
    it('should return a chainable', () => {
      assertEqual(new Sugar.Number(1).toString().raw, '1');
    });

    it('should match its built-in class', () => {
      assertEqual(new Sugar.Array([1, 2, 3]).toString().raw, '1,2,3');
    });

    it('should be equivalent to calling prototype.toString', () => {
      assertEqual(
        new Sugar.Object({}).toString().raw,
        Object.prototype.toString.call({})
      );
    });
  });
});
