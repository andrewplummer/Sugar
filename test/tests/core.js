'use strict';

describe('Core', () => {

  describe('Global', () => {

    it('should have a version', () => {
      assertMatch(Sugar.VERSION, /^(\d+\.\d+\.\d+|edge)$/);
    });

  });

  describe('Namespace', () => {

    it('should be able to create a new namespace', () => {
      ensureNamespaceNotInitialized('Array', () => {
        Sugar.createNamespace('Array');
        assertInstanceOf(Sugar.Array, Function);
        assertInstanceOf(Sugar.Array.defineInstance, Function);
      });
    });

    it('should not overwrite a created namespace', () => {
      ensureNamespaceNotInitialized('Array', () => {
        Sugar.createNamespace('Array');
        var oldNamespace = Sugar.Array;
        Sugar.createNamespace('Array');
        assertEqual(oldNamespace, Sugar.Array);
      });
    });

    it('should error when namespace is not a built-in', () => {
      assertError(function createUnknownNamespace() {
        Sugar.createNamespace('Foo');
      });
    });

  });

  describe('Defining', () => {

    describe('Basic', () => {

      afterEach(() => {
        delete Sugar.Number.add;
      });

      it('should be able to define static methods', () => {
        Sugar.Number.defineStatic('add', add);
        assertEqual(Sugar.Number.add(1, 2), 3);
      });

      it('should be able to define instance methods as static', () => {
        Sugar.Number.defineInstance('add', add);
        assertEqual(Sugar.Number.add(1, 2), 3);
      });

      it('should be able to define static with object', () => {
        Sugar.Number.defineStatic({ add: add });
        assertEqual(Sugar.Number.add(1, 2), 3);
      });

      it('should be able to define instance with object', () => {
        Sugar.Number.defineInstance({ add: add });
        assertEqual(Sugar.Number.add(1, 2), 3);
      });

    });

    describe('Aliases', () => {

      function alias(name) {
        var add = Number(name.charAt(3));
        return (n) => {
          return n + add;
        };
      }

      afterEach(() => {
        delete Sugar.Number.add1;
        delete Sugar.Number.add2;
      });

      it('should be able to define static aliases', () => {
        Sugar.Number.defineStaticAlias('add1 add2', alias);
        assertEqual(Sugar.Number.add1(1), 2);
        assertEqual(Sugar.Number.add2(1), 3);
      });

      it('should be able to define instance aliases', () => {
        Sugar.Number.defineInstanceAlias('add1 add2', alias);
        assertEqual(Sugar.Number.add1(1), 2);
        assertEqual(Sugar.Number.add2(1), 3);
      });

      it('should be able to define aliases with a comma as well', () => {
        Sugar.Number.defineInstanceAlias('add1,add2', alias);
        assertEqual(Sugar.Number.add1(1), 2);
        assertEqual(Sugar.Number.add2(1), 3);
      });

    });

  });

});
