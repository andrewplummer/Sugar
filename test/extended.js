'use strict';

describe('Extended', function() {

  Sugar.createNamespace('Number');
  Sugar.createNamespace('String');
  Sugar.createNamespace('Object');

  beforeEach(function() {
    Sugar.Number.defineStatic('addStatic', add);
    Sugar.Object.defineStatic('argStatic', arg);
    Sugar.Number.defineInstance('add', add);
    Sugar.String.defineInstance('add', add);
    Sugar.Object.defineInstance('arg', arg);
  });

  afterEach(function() {
    Sugar.restore();
    delete Sugar.Number.addStatic;
    delete Sugar.Object.argStatic;
    delete Sugar.Number.add;
    delete Sugar.String.add;
    delete Sugar.Object.arg;
  });

  describe('Static methods', function() {

    it('should extend static Number methods', function() {
      Sugar.extend();
      assertInstanceOf(Number.addStatic, Function);
    });

    it('should extend static Object methods', function() {
      Sugar.extend();
      assertInstanceOf(Object.argStatic, Function);
    });

  });

  describe('Instance methods', function() {

    describe('Basic', function() {

      it('should extend all namespaces', function() {
        Sugar.extend();
        assertEqual((5).add(5), 10);
        assertEqual('a'.add('b'), 'ab');
      });

      it('should extend single namespace', function() {
        Sugar.Number.extend();
        assertEqual((5).add(5), 10);
        assertUndefined(String.prototype.add);
      });

      it('should not extend Object.prototype', function() {
        Sugar.extend();
        assertUndefined(Object.prototype.arg);
      });

      it('should allow extended methods to be configurable', function() {
        Sugar.extend();
        assertNoError(function() {
          delete Number.prototype.add;
        });
      });

      it('should allow extended methods to be writable', function() {
        Sugar.extend();
        assertNoError(function() {
          Number.prototype.add = 1;
        });
        delete Number.prototype.add;
      });

    });

    xdescribe('Options', function() {

      it('should allow array as shortcut for methods param', function() {
        // TODO: decide syntax
        Sugar.Number.extend([
          'add',
          'mult'
        ]);
        assertEqual((5).add(5), 10);
        assertEqual((5).mult(5), 25);
      });

      it('should allow methods param', function() {
        // TODO: decide syntax
        Sugar.Number.extend({
          methods: ['add']
        });
        assertEqual((5).add(5), 10);
        assertUndefined((5).mult);
      });

      it('should allow exclude param', function() {
        // TODO: decide syntax
        Sugar.Number.extend({
          exclude: ['add']
        });
        assertUndefined((5).add);
        assertEqual((5).mult(5), 25);
      });

      it('should allow extending by namespace ??', function() {
        Sugar.extend({
          namespaces: [String, Number],
          exclude: [String, Number]
        });
      });

    });

    xdescribe('Enhancing', function() {

      it('should allow overwrite param', function() {
        // TODO: work this out
        Sugar.Number.defineInstance('every', stringCheck, function() {
        });

        Sugar.Number.extend({
          overwrite: false
        });
        assertUndefined((5).add);
        assertEqual((5).mult(5), 25);
      });

    });

  });

  describe('Util', function() {

    it('should be able to restore all namespaces', function() {
      Sugar.extend();
      assertInstanceOf(Number.prototype.add, Function);
      assertInstanceOf(String.prototype.add, Function);
      Sugar.restore();
      assertUndefined(Number.prototype.add);
      assertUndefined(String.prototype.add);
    });

    it('should restore to previous state', function() {
      Number.prototype.add = 3;
      Sugar.extend();
      assertInstanceOf(Number.prototype.add, Function);
      Sugar.restore();
      assertEqual(Number.prototype.add, 3);
      delete Number.prototype.add;
    });

    it('should not shadow native values when restoring', function() {
      Sugar.extend();
      Sugar.restore();
      assertFalse(Object.prototype.hasOwnProperty.call(Number.prototype, 'add'));
    });

  });

  describe('Errors', function() {

    var number;
    var FakeNumber;

    beforeEach(function() {
      FakeNumber = {
        prototype: {}
      };
      Object.defineProperty(FakeNumber.prototype, 'add', {
        configurable: false,
        writable: true,
        value: 1
      });
      // Non-configurable properties cannot be restored once
      // set so need to hijack the global space to test this,
      // then restore the real string later.
      number = Number;
      Number = FakeNumber;
    });

    afterEach(function() {
      Number = number;
      FakeNumber = null;
    });

    it('should throw an error when extending a non-writable property', function() {
      assertError(function() {
        Sugar.extend();
      });
    });

    it('should roll back extend operation on error', function() {
      try {
        Sugar.extend();
      } catch (e) {
        assertUndefined(Number.addStatic);
        assertUndefined(Object.argStatic);
        assertUndefined(String.prototype.add);
        assertEqual(Number.prototype.add, 1);
      }
    });

    it('should roll back individual namespaces on error', function() {
      try {
        Sugar.Object.extend();
        Sugar.String.extend();
        Sugar.Number.extend();
      } catch (e) {
        assertInstanceOf(Object.argStatic, Function);
        assertInstanceOf(String.prototype.add, Function);
        assertUndefined(Number.addStatic);
        assertEqual(Number.prototype.add, 1);
      }
    });

  });

  // TODO: except vs exclude?
  // TODO: defineAlias vs defineSimilar???
  // TODO: how to handle enhanced methods? flags?? defineMathMethods?
  // TODO: Sugar.Array.extend({ enhanceArray: false });
  // TODO: document API changes in changelog!

  /*
  it('should accept methods param', function() {
    Sugar.Number.extend({
      methods: ['add']
    });
  });

  it('should accept exclude param', function() {
    Sugar.Number.extend({
      exclude: ['add']
    });
  });

  it('should not extend instance methods', function() {
    Sugar.Object.extend();
  });

  // MORE
  it('should extend after global hijacking', function() {
    var nativeDate = Date;
    function FakeDate() {}
    Sugar.Date.defineStatic('foo', function() { return 'foo!'; });
    // Hijacking the global Date object. Sinon does this to allow time mocking
    // in tests, so need to support this here.
    Date = FakeDate;
    Sugar.Date.extend();
    equal(Date.foo(), 'foo!', 'hijacked global is now the target');
    Date = nativeDate;
  });
  */


});
