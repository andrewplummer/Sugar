(function(context) {

  // The global context
  var globalContext = typeof global !== 'undefined' && global.Object ? global : context;
  var nativeState;

  var NATIVES = ['Number','String','Array','Date','RegExp','Function', 'Object'];

  function restoreNative(methodName, target, storedMethod) {
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

  function isSugarMethod(method) {
    return typeof method === 'function' && (method.static || !!method.instance);
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
    nativeState = {};
    testIterateOverObject(Sugar, function(name, ns) {
      var state = nativeState[name] = {};
      nativeState[name + 'Active'] = ns.active;
      var nativeClass = globalContext[name];
      testIterateOverObject(ns, function(methodName, method) {
        if (!isSugarMethod(method)) {
          // Only store Sugar defined methods.
          return;
        }
        // Store both static and instance methods as both
        // are possible, such as in the case of Object.keys.
        state[methodName] = {
          static: nativeClass[methodName],
          instance: nativeClass.prototype[methodName]
        }
      });
    });
  }

  restoreNativeState = function() {
    // "objectPrototype" preserves state for future
    // method definitions, so reset that flag here.
    Sugar.Object.extend({
      methods: [],
      objectPrototype: false
    });
    for (var i = 0; i < NATIVES.length; i++) {

      var name        = NATIVES[i];
      var ns          = Sugar[name];
      var nativeClass = globalContext[name];

      ns.active = nativeState[name + 'Active'];
      testIterateOverObject(ns, function(methodName, method) {
        if (!isSugarMethod(method)) {
          // Only restore Sugar defined methods.
          return;
        }
        var state = nativeState[name][methodName];
        if (!state) {
          // If there is no stored state for this method, then
          // it's safe to assume that it was not there previously
          // and remove it completely. Do this by setting it's
          // state as undefined.
          state = {};
        }
        restoreNative(methodName, nativeClass, state.static);
        restoreNative(methodName, nativeClass.prototype, state.instance);
      });
    }
  }

})(this);
