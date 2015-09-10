(function() {

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : this;
  var nativeState;

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
        native = globalContext[namespace],
        count = 0, mappedCount = 0;

    function methodIsMapped(method, name) {
      return (method.instance && method.instance === native.prototype[name]) || method === native[name];
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
      var native = globalContext[name];
      testIterateOverObject(ns, function(methodName, method) {
        if (!isSugarMethod(method)) {
          // Only store Sugar defined methods.
          return;
        }
        // Store both static and instance methods as both
        // are possible, such as in the case of Object.keys.
        state[methodName] = {
          static: native[methodName],
          instance: native.prototype[methodName]
        }
      });
    });
  }

  restoreNativeState = function() {
    testIterateOverObject(Sugar, function(name, ns) {
      var native = globalContext[name];
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
        restoreNative(methodName, native, state.static);
        restoreNative(methodName, native.prototype, state.instance);
      });
    });
  }

})();
