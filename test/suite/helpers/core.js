(function(context) {

  // The global context
  var globalContext = typeof global !== 'undefined' && global.Object ? global : context;
  var nativeStates = [];


  function forEachNamespace(fn) {
    testIterateOverObject(Sugar, function(key, val) {
      // In environments that can't set non-enumerable properties, other props
      // may accidentally get iterated over here. Fortunately, all Sugar
      // namespaces have custom toString methods that we can leverage here to
      // separate namespaces from utility functions.
      if (typeof val === 'function' && val.toString() === 'Sugar' + key) {
        fn(key, val);
      }
    });
  }

  function restore(methodName, target, storedMethod) {
    if (target[methodName] !== storedMethod) {
      if (!storedMethod) {
        delete target[methodName];
      } else {
        target[methodName] = storedMethod;
      }
    }
  }

  function assertNamespaces(namespaces, assert, checkStatic, checkInstance) {
    for (var i = 0; i < namespaces.length; i++) {
      assertNamespace(namespaces[i], assert, checkStatic, checkInstance);
    }
  }

  function assertNamespace(namespace, assert, checkStatic, checkInstance) {
    var sugarNamespace = Sugar[namespace],
        nativeClass = globalContext[namespace],
        count = 0, mappedCount = 0;

    function methodIsMapped(method, name) {
      return (method.instance && method.instance === nativeClass.prototype[name]) || method === nativeClass[name];
    }

    function checkMethod() {
      return (!!method.instance && checkInstance) || (method.static && checkStatic);
    }

    testIterateOverObject(sugarNamespace, function(name, method) {
      if (!checkMethod(method)) {
        return;
      }
      count++;
      if (methodIsMapped(method, name)) {
        mappedCount++;
      }
    });
    if (assert === false) {
      equal(mappedCount, 0, namespace + ' methods not mapped.');
    } else {
      equal(mappedCount, count, 'All methods mapped to ' + namespace + '.');
    }
  }

  function getDefaultChainablePrototype() {
    // Force disambiguation to get at the unknown chainable prototype.
    Sugar.Array.defineInstance('foo', function() {});
    Sugar.String.defineInstance('foo', function() {});
    return new Sugar.Array().foo().constructor.prototype;
  }

  assertAllMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, true, true, true);
  }

  assertNoMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, false, true, true);
  }

  assertStaticMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, true, true, false);
  }

  assertStaticMethodsNotMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, false, true, false);
  }

  assertInstanceMethodsMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, true, false, true);
  }

  assertInstanceMethodsNotMappedToNative = function(namespaces) {
    assertNamespaces(namespaces, false, false, true);
  }

  storeNativeState = function() {
    var nativeState = {};
    forEachNamespace(function(name, namespace) {
      var state = nativeState[name] = {};
      var nativeClass = globalContext[name];
      state.active = namespace.active;
      testIterateOverObject(namespace, function(methodName, method) {
        state[methodName] = {
          sugar:    namespace[methodName],
          chain:    namespace.prototype[methodName],
          static:   nativeClass[methodName],
          instance: nativeClass.prototype[methodName]
        }
      });
    });
    nativeStates.push(nativeState);
  }

  restoreNativeState = function() {

    // "objectPrototype" preserves state for future
    // method definitions, so reset that flag here.
    Sugar.Object.extend({
      methods: [],
      objectPrototype: false
    });

    // The "unknown" chainable prototype takse a bit
    // of special work to get at, so do that here.
    var cproto = getDefaultChainablePrototype();

    var nativeState = nativeStates.pop();

    forEachNamespace(function(name, namespace) {
      var nativeClass = globalContext[name];
      namespace.active = nativeState.active;
      testIterateOverObject(namespace, function(methodName, method) {
        var methodState = nativeState[name][methodName];
        if (!methodState) {
          // If there is no stored state for this method, then
          // it's safe to assume that it was not there previously
          // and remove it completely. Do this by setting it's
          // state as undefined.
          methodState = {};
          delete cproto[methodName];
        }
        restore(methodName, namespace, methodState.sugar);
        restore(methodName, namespace.prototype, methodState.chain);
        restore(methodName, nativeClass, methodState.static);
        restore(methodName, nativeClass.prototype, methodState.instance);
      });
    });
  }

})(this);
