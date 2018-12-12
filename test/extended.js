'use strict';

describe('Extended', function () {

  Sugar.createNamespace('Number');
  Sugar.createNamespace('String');
  Sugar.createNamespace('Object');

  describe('Static methods', function() {

    beforeEach(function() {
      Sugar.Number.defineStatic('add', add);
      Sugar.Object.defineStatic('arg', arg);
    });

    afterEach(function() {
      // TODO: method for this?
      delete Sugar.Number.add;
      delete Sugar.Object.arg;
      delete Number.add;
      delete Object.arg;
    });

    it('should extend static Number methods', function() {
      Sugar.extend();
      assertInstanceOf(Number.add, Function);
    });

    it('should extend static Object methods', function() {
      Sugar.extend();
      assertInstanceOf(Object.arg, Function);
    });

  });

  describe('Instance methods', function() {

    beforeEach(function() {
      Sugar.Number.defineInstance('add', add);
      Sugar.String.defineInstance('add', add);
      Sugar.Object.defineInstance('arg', arg);
    });

    afterEach(function() {
      // TODO: method for this?
      delete Sugar.Number.add;
      delete Sugar.String.add;
      delete Sugar.Object.arg;
      delete Number.prototype.add;
      delete String.prototype.add;
    });

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
          Number.prototype.add = null;
        });
      });

    });

    xdescribe('Options', function() {

      it('should allow array as shortcut for methods param', function() {
        // TODO: decide syntax
        Sugar.Number.extend('add', 'mult');
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
