'use strict';

describe('Core', () => {

  describe('Creating Namespaces', () => {

    it('should be able to create a new namespace', () => {
      withResetNamespaces(() => {
        const Array = Sugar.createNamespace('Array');
        assertInstanceOf(Array, Function);
        assertInstanceOf(Array.defineInstance, Function);
      });
    });

    it('should be able to initialize Map', () => {
      withResetNamespaces(() => {
        const Map = Sugar.createNamespace('Map');
        assertInstanceOf(Map, Function);
        assertInstanceOf(Map.defineInstance, Function);
      });
    });

    it('should error when attempting to overwrite a namespace', () => {
      withResetNamespaces(() => {
        Sugar.createNamespace('Array');
        assertEqual(Sugar.createNamespace('Array'), Sugar.Array);
      });
    });

    it('should error when namespace is not a built-in', () => {
      assertError(() => {
        Sugar.createNamespace('Foo');
      });
    });

  });

  describe('Defining Methods', () => {

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
      Sugar.Number.defineStatic({ add });
      assertEqual(Sugar.Number.add(1, 2), 3);
    });

    it('should be able to define instance with object', () => {
      Sugar.Number.defineInstance({ add });
      assertEqual(Sugar.Number.add(1, 2), 3);
    });

    it('should be able to define static properties', () => {
      Sugar.Number.defineStatic('add', 'const');
      assertEqual(Sugar.Number.add, 'const');
    });

    it('should not be able to define properties as instance', () => {
      assertError(() => {
        Sugar.Number.defineInstance('add', 'const');
      });
    });

  });

});
