(function(context) {

  // The global context
  var globalContext = typeof global !== 'undefined' && global.Object ? global : context;
  var nativeStates = [];

  var NATIVES = ['Number','String','Array','Date','RegExp','Function', 'Object'];

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

  function getChainablePrototype() {
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
    testIterateOverObject(Sugar, function(name, ns) {
      var state = nativeState[name] = {};
      nativeState[name + 'Active'] = ns.active;
      var nativeClass = globalContext[name];
      testIterateOverObject(ns, function(methodName, method) {
        state[methodName] = {
          sugar:    ns[methodName],
          chain:    ns.prototype[methodName],
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
    var cproto = getChainablePrototype();

    var nativeState = nativeStates.pop();

    for (var i = 0; i < NATIVES.length; i++) {

      var name        = NATIVES[i];
      var ns          = Sugar[name];
      var nativeClass = globalContext[name];

      ns.active = nativeState[name + 'Active'];
      testIterateOverObject(ns, function(methodName, method) {
        var methodState = nativeState[name][methodName];
        if (!methodState) {
          // If there is no stored state for this method, then
          // it's safe to assume that it was not there previously
          // and remove it completely. Do this by setting it's
          // state as undefined.
          methodState = {};
          delete cproto[methodName];
        }
        restore(methodName, ns, methodState.sugar);
        restore(methodName, ns.prototype, methodState.chain);
        restore(methodName, nativeClass, methodState.static);
        restore(methodName, nativeClass.prototype, methodState.instance);
      });
    }
  }

})(this);
