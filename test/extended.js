'use strict';

describe('Extended', function() {

  Sugar.createNamespace('Number');
  Sugar.createNamespace('String');
  Sugar.createNamespace('Object');

  beforeEach(function() {
    Sugar.Number.defineStatic('addStatic', add);
    Sugar.Object.defineStatic('argStatic', arg);
    Sugar.Number.defineInstance('add', add);
    Sugar.Number.defineInstance('mult', mult);
    Sugar.String.defineInstance('add', add);
    Sugar.Object.defineInstance('arg', arg);
  });

  afterEach(function() {
    Sugar.restore();
    delete Sugar.Number.addStatic;
    delete Sugar.Object.argStatic;
    delete Sugar.Number.add;
    delete Sugar.Number.mult;
    delete Sugar.String.add;
    delete Sugar.Object.arg;
  });

  describe('Static methods', function() {

    it('should extend static Number methods', function() {
      Sugar.extend();
      assertEqual(Number.addStatic(1, 2), 3);
    });

    it('should extend static Object methods', function() {
      Sugar.extend();
      assertEqual(Object.argStatic(1, 2), 2);
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

      it('should define methods as configurable', function() {
        Sugar.extend();
        assertNoError(function() {
          delete Number.prototype.add;
        });
      });

      it('should define methods as writable', function() {
        Sugar.extend();
        assertNoError(function() {
          Number.prototype.add = 1;
        });
        delete Number.prototype.add;
      });

    });

  });

  describe('Options', function() {

    describe('Global', function() {

      it('should extend specific namespaces by name', function() {
        Sugar.extend({
          include: ['Number']
        });
        assertEqual((5).add(5), 10);
        assertEqual((5).mult(5), 25);
        assertUndefined(''.add);
        assertUndefined(''.add);
      });

      it('should accept array as shortcut for include', function() {
        Sugar.extend(['Number']);
        assertEqual((5).add(5), 10);
        assertEqual((5).mult(5), 25);
        assertUndefined(''.add);
        assertUndefined(''.add);
      });

      it('should exclude specific namespaces by name', function() {
        Sugar.extend({
          exclude: ['Number']
        });
        assertUndefined((5).add);
        assertUndefined((5).mult);
        assertEqual('a'.add('b'), 'ab');
      });

      it('should throw an error when includes are inconsistent', function() {
        assertError(function() {
          Sugar.extend({
            include: ['Number'],
            exclude: ['Number']
          });
        });
      });

    });

    describe('Namespace', function() {

      it('should extend specific methods by name', function() {
        Sugar.Number.extend({
          include: ['add']
        });
        assertEqual((5).add(5), 10);
        assertUndefined((5).mult);
      });

      it('should accept array as shortcut for include', function() {
        Sugar.Number.extend(['add']);
        assertEqual((5).add(5), 10);
        assertUndefined((5).mult);
      });

      it('should exclude specific methods by name', function() {
        Sugar.Number.extend({
          exclude: ['add']
        });
        assertUndefined((5).add);
        assertEqual((5).mult(5), 25);
      });

      it('should throw an error when includes are inconsistent', function() {
        assertError(function() {
          Sugar.Number.extend({
            include: ['add'],
            exclude: ['add']
          });
        });
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


  describe('Restore', function() {

    it('should restore all namespaces', function() {
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
      assertUndefined(String.prototype.add);
      delete Number.prototype.add;
    });

    it('should not restore other namespaces', function() {
      String.prototype.add = 3;
      Sugar.extend();
      assertInstanceOf(String.prototype.add, Function);
      Sugar.restore();
      assertUndefined(Number.prototype.add);
      assertEqual(String.prototype.add, 3);
      delete String.prototype.add;
    });

    it('should not shadow native values when restoring', function() {
      Sugar.extend();
      Sugar.restore();
      assertFalse(Object.prototype.hasOwnProperty.call(Number.prototype, 'add'));
    });

  });

  describe('Existing global state', function() {

    var RealNumber;
    var FakeNumber;

    beforeEach(function() {
      // Non-configurable properties cannot be restored once
      // set so need to hijack the global space to test this,
      // then restore the built-in later.
      FakeNumber = function Number() {};
      RealNumber = Number;
      Number = FakeNumber;
    });

    afterEach(function() {
      // The order is important here as we don't want to allow
      // the suite to restore methods defined on FakeNumber back
      // onto the built-in.
      Sugar.restore();
      Number = RealNumber;
      FakeNumber = null;
    });

    describe('Extendable', function() {

      beforeEach(function() {
        Object.defineProperty(FakeNumber.prototype, 'add', {
          configurable: true,
          writable: true,
          value: 1
        });
      });

      it('should extend a fake global object', function() {
        // Global hijacking like in Sinon only works on non-primitive
        // objects like Date that are created via the global object,
        // as primitives still inherit from their now hidden built-in
        // prototypes. Simulating this by using the "new" keyword.
        FakeNumber.prototype.valueOf = function() {
          return 5;
        }
        Sugar.extend();
        assertEqual(new Number().add(5), 10);
      });

    });

    describe('Not extendable', function() {

      beforeEach(function() {
        Object.defineProperty(FakeNumber.prototype, 'add', {
          configurable: false,
          writable: true,
          value: 1
        });
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

      it('should not roll back properties that it failed to set', function() {
        try {
          Sugar.extend();
        } catch (e) {
          Number = function Number() {};
          Sugar.extend();
          Sugar.restore();
          assertUndefined(Number.prototype.add);
        }
      });

    });

  });

  // TODO: how to handle enhanced methods? flags?? defineMathMethods?
  // TODO: Sugar.Array.extend({ enhanceArray: false });
  // TODO: document API changes in changelog!

});
