'use strict';

describe('Core', function() {

  describe('Global', function() {

    it('should have a toString', function() {
      assertEqual(Sugar.toString(), 'Sugar');
    });

    it('should have a version', function() {
      assertMatch(Sugar.VERSION, /^(\d+\.\d+\.\d+|edge)$/);
    });

  });

  describe('Namespace', function() {

    it('should have a toString', function() {
      assertEqual(Sugar.Number.toString(), 'SugarNumber');
    });

    it('should be able to create a new namespace', function() {
      ensureNamespaceNotInitialized('Array', function() {
        var namespace = Sugar.createNamespace('Array');
        assertEqual(namespace, Sugar.Array);
        assertInstanceOf(namespace.defineInstance, Function);
      });
    });

    it('should not overwrite a created namespace', function() {
      ensureNamespaceNotInitialized('Array', function() {
        Sugar.createNamespace('Array');
        var oldNamespace = Sugar.Array;
        Sugar.createNamespace('Array');
        assertEqual(oldNamespace, Sugar.Array);
      });
    });

    it('should error when namespace is not a built-in', function() {
      assertError(function createUnknownNamespace() {
        Sugar.createNamespace('Foo');
      });
    });

  });

  describe('Defining', function() {

    function alias(name) {
      var add = Number(name.charAt(3));
      return function(n) {
        return n + add;
      };
    }

    it('should be able to define static methods', function() {
      Sugar.Number.defineStatic('add', add);
      assertEqual(Sugar.Number.add(1, 2), 3);
      delete Sugar.Number.add;
    });

    it('should be able to define instance methods as static', function() {
      Sugar.Number.defineInstance('add', add);
      assertEqual(Sugar.Number.add(1, 2), 3);
      delete Sugar.Number.add;
    });

    it('should be able to define static with object', function() {
      Sugar.Number.defineStatic({ add: add });
      assertEqual(Sugar.Number.add(1, 2), 3);
      delete Sugar.Number.add;
    });

    it('should be able to define instance with object', function() {
      Sugar.Number.defineInstance({ add: add });
      assertEqual(Sugar.Number.add(1, 2), 3);
      delete Sugar.Number.add;
    });

    it('should be able to define static aliases', function() {
      // TODO: maybe this should be a comma??
      Sugar.Number.defineStaticAlias('add1 add2', alias);
      assertEqual(Sugar.Number.add1(1), 2);
      assertEqual(Sugar.Number.add2(1), 3);
      delete Sugar.Number.add1;
      delete Sugar.Number.add2;
    });

    it('should be able to define instance aliases', function() {
      Sugar.Number.defineInstanceAlias('add1 add2', alias);
      assertEqual(Sugar.Number.add1(1), 2);
      assertEqual(Sugar.Number.add2(1), 3);
      delete Sugar.Number.add1;
      delete Sugar.Number.add2;
    });

  });

});
